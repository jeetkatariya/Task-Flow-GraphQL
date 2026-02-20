import React, { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  IconButton,
  Tooltip,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Divider,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  CheckCircle as CheckIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  LocalFireDepartment as StreakIcon,
  Today as TodayIcon,
  DateRange as WeekIcon,
  CalendarMonth as RangeIcon,
} from '@mui/icons-material';
import { GET_HABITS } from '../graphql/queries/habits';
import { CREATE_HABIT, LOG_HABIT, DELETE_HABIT, UPDATE_HABIT } from '../graphql/mutations/habits';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const EMPTY_HABIT = { name: '', description: '', frequency: 'daily', color: '#4caf50', targetDays: [0, 1, 2, 3, 4, 5, 6] };

/* ── helpers ─────────────────────────────────────── */

function getDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getWeekDates(): Date[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dates: Date[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(d);
  }
  return dates;
}

function getDatesInRange(start: Date, end: Date): Date[] {
  const dates: Date[] = [];
  const d = new Date(start);
  d.setHours(0, 0, 0, 0);
  const e = new Date(end);
  e.setHours(0, 0, 0, 0);
  while (d <= e) {
    dates.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

function isTargetDay(dayIndex: number, frequency: string, targetDays: number[]): boolean {
  if (frequency === 'daily') return true;
  return targetDays.includes(dayIndex);
}

function todayStr(): string {
  return getDateStr(new Date());
}

/* ── component ───────────────────────────────────── */

const Habits: React.FC = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [rangeDialogOpen, setRangeDialogOpen] = useState(false);
  const [rangeHabitId, setRangeHabitId] = useState<string | null>(null);
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');
  const [editingHabit, setEditingHabit] = useState<any>(null);
  const [newHabit, setNewHabit] = useState({ ...EMPTY_HABIT });
  const [error, setError] = useState('');
  const [inflight, setInflight] = useState<Set<string>>(new Set()); // tracks "habitId-date" keys

  const { data, loading, refetch } = useQuery(GET_HABITS);

  const refetchAll = useCallback(() => {
    console.log('[Habits] Refetching habits data…');
    refetch();
  }, [refetch]);

  /* ── mutations ──────────────────────────────────── */

  const [createHabit] = useMutation(CREATE_HABIT, {
    onCompleted: (d) => {
      console.log('[Habits] Created habit:', d.createHabit.name);
      setCreateDialogOpen(false);
      setNewHabit({ ...EMPTY_HABIT });
      setError('');
      refetchAll();
    },
    onError: (err) => { console.error('[Habits] Create error:', err.message); setError(err.message); },
  });

  const [updateHabit] = useMutation(UPDATE_HABIT, {
    onCompleted: (d) => {
      console.log('[Habits] Updated habit:', d.updateHabit.id);
      setEditDialogOpen(false);
      setEditingHabit(null);
      setError('');
      refetchAll();
    },
    onError: (err) => { console.error('[Habits] Update error:', err.message); setError(err.message); },
  });

  const [logHabitMutation] = useMutation(LOG_HABIT, {
    onError: (err) => { console.error('[Habits] Log error:', err.message); setError(err.message); },
  });

  const [deleteHabit] = useMutation(DELETE_HABIT, {
    onCompleted: () => { console.log('[Habits] Deleted habit'); refetchAll(); },
    onError: (err) => { console.error('[Habits] Delete error:', err.message); setError(err.message); },
  });

  const weekDates = useMemo(() => getWeekDates(), []);

  /* ── log helpers (with once-per-day guard) ──────── */

  /** Returns true if this habit+date already has a completed log */
  const isLoggedForDate = useCallback((habit: any, date: Date): boolean => {
    const ds = getDateStr(date);
    return habit.logs?.some((log: any) => {
      const logDate = typeof log.date === 'string' ? log.date.split('T')[0] : getDateStr(new Date(log.date));
      return logDate === ds && log.completed;
    }) || false;
  }, []);

  const inflightKey = (habitId: string, dateStr: string) => `${habitId}|${dateStr}`;

  /** Fire a single log mutation with in-flight guard */
  const doLog = useCallback(async (habitId: string, dateStr: string, completed: boolean) => {
    const key = inflightKey(habitId, dateStr);
    if (inflight.has(key)) {
      console.log('[Habits] Skipping — already in flight:', key);
      return;
    }
    setInflight((prev) => new Set(prev).add(key));
    console.log(`[Habits] Logging: habit=${habitId}, date=${dateStr}, completed=${completed}`);
    try {
      await logHabitMutation({ variables: { habitId, date: dateStr, completed } });
    } finally {
      setInflight((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
      refetchAll();
    }
  }, [inflight, logHabitMutation, refetchAll]);

  /* ── toggle a single day (check / uncheck) ─────── */
  const handleToggleLog = (habitId: string, date: Date, isCurrentlyCompleted: boolean) => {
    doLog(habitId, getDateStr(date), !isCurrentlyCompleted);
  };

  /* ── Log Today ─────────────────────────────────── */
  const handleLogToday = (habit: any) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const completed = isLoggedForDate(habit, today);
    if (completed) {
      console.log('[Habits] Already logged today — toggling off');
    }
    doLog(habit.id, todayStr(), !completed);
  };

  /* ── Log This Week ──────────────────────────────── */
  const handleLogThisWeek = async (habit: any) => {
    const targetDays = habit.targetDays || [0, 1, 2, 3, 4, 5, 6];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysToLog = weekDates.filter((d) => {
      if (d > today) return false; // skip future
      if (!isTargetDay(d.getDay(), habit.frequency, targetDays)) return false;
      return !isLoggedForDate(habit, d); // skip already completed
    });

    if (daysToLog.length === 0) {
      setError('All target days this week are already logged!');
      return;
    }

    console.log(`[Habits] Batch logging ${daysToLog.length} days for "${habit.name}"`);
    for (const d of daysToLog) {
      await doLog(habit.id, getDateStr(d), true);
    }
  };

  /* ── Log Custom Range ───────────────────────────── */
  const openRangeDialog = (habitId: string) => {
    setRangeHabitId(habitId);
    setRangeStart(todayStr());
    setRangeEnd(todayStr());
    setRangeDialogOpen(true);
  };

  const handleLogCustomRange = async () => {
    if (!rangeHabitId || !rangeStart || !rangeEnd) return;
    const habit = habits.find((h: any) => h.id === rangeHabitId);
    if (!habit) return;

    const targetDays = habit.targetDays || [0, 1, 2, 3, 4, 5, 6];
    const start = new Date(rangeStart);
    const end = new Date(rangeEnd);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start > end) {
      setError('Start date must be before or equal to end date');
      return;
    }

    const allDates = getDatesInRange(start, end);
    const daysToLog = allDates.filter((d) => {
      if (d > today) return false;
      if (!isTargetDay(d.getDay(), habit.frequency, targetDays)) return false;
      return !isLoggedForDate(habit, d);
    });

    if (daysToLog.length === 0) {
      setError('All target days in this range are already logged!');
      return;
    }

    setRangeDialogOpen(false);
    console.log(`[Habits] Custom range logging ${daysToLog.length} days for "${habit.name}" (${rangeStart} → ${rangeEnd})`);
    for (const d of daysToLog) {
      await doLog(habit.id, getDateStr(d), true);
    }
  };

  /* ── CRUD handlers ──────────────────────────────── */

  const handleCreateHabit = () => {
    console.log('[Habits] Creating habit:', newHabit.name, 'frequency:', newHabit.frequency);
    createHabit({
      variables: {
        createHabitInput: {
          name: newHabit.name,
          description: newHabit.description || undefined,
          frequency: newHabit.frequency,
          color: newHabit.color,
          targetDays: newHabit.frequency === 'daily' ? [0, 1, 2, 3, 4, 5, 6] : newHabit.targetDays,
        },
      },
    });
  };

  const handleEditOpen = (habit: any) => {
    setEditingHabit({
      id: habit.id,
      name: habit.name,
      description: habit.description || '',
      frequency: habit.frequency,
      color: habit.color || '#4caf50',
      targetDays: habit.targetDays || [0, 1, 2, 3, 4, 5, 6],
    });
    setEditDialogOpen(true);
  };

  const handleEditSave = () => {
    if (!editingHabit) return;
    console.log('[Habits] Saving edit for habit:', editingHabit.id);
    updateHabit({
      variables: {
        id: editingHabit.id,
        updateHabitInput: {
          name: editingHabit.name,
          description: editingHabit.description || undefined,
          frequency: editingHabit.frequency,
          color: editingHabit.color,
          targetDays: editingHabit.frequency === 'daily' ? [0, 1, 2, 3, 4, 5, 6] : editingHabit.targetDays,
        },
      },
    });
  };

  const handleDeleteHabit = (id: string) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      deleteHabit({ variables: { id } });
    }
  };

  const handleTargetDayToggle = (dayIndex: number, setter: (v: any) => void, current: any) => {
    const newDays = current.targetDays.includes(dayIndex)
      ? current.targetDays.filter((d: number) => d !== dayIndex)
      : [...current.targetDays, dayIndex].sort();
    setter({ ...current, targetDays: newDays });
  };

  /* ── derived ────────────────────────────────────── */

  const habits = data?.habits || [];

  /* ── render ─────────────────────────────────────── */

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Habits ({habits.length})
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateDialogOpen(true)}>
          New Habit
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      {!loading && habits.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">No habits yet</Typography>
          <Typography variant="body2" color="text.secondary">Click "New Habit" to start tracking.</Typography>
        </Box>
      )}

      <Grid container spacing={3}>
        {habits.map((habit: any) => {
          const targetDays = habit.targetDays || [0, 1, 2, 3, 4, 5, 6];
          const todayCompleted = isLoggedForDate(habit, new Date());
          const todayBusy = inflight.has(inflightKey(habit.id, todayStr()));

          return (
            <Grid item xs={12} key={habit.id}>
              <Card sx={{
                borderLeft: `5px solid ${habit.color || '#4caf50'}`,
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: 4 },
              }}>
                <CardContent>
                  {/* ── header row ── */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {habit.name}
                          {todayCompleted && <CheckIcon fontSize="small" sx={{ color: 'success.main' }} />}
                        </Typography>
                        {habit.description && (
                          <Typography variant="body2" color="text.secondary">{habit.description}</Typography>
                        )}
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Chip label={habit.frequency} size="small" sx={{ backgroundColor: habit.color || '#4caf50', color: 'white' }} />
                      {habit.streak && habit.streak.currentStreak > 0 && (
                        <Chip
                          icon={<StreakIcon sx={{ color: '#ff9800 !important' }} />}
                          label={`${habit.streak.currentStreak} day${habit.streak.currentStreak > 1 ? 's' : ''}`}
                          size="small" variant="outlined" color="warning"
                        />
                      )}
                      <IconButton size="small" onClick={() => handleEditOpen(habit)} title="Edit"><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => handleDeleteHabit(habit.id)} title="Delete" color="error"><DeleteIcon fontSize="small" /></IconButton>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* ── quick-log action buttons ── */}
                  <Box sx={{ display: 'flex', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant={todayCompleted ? 'outlined' : 'contained'}
                      size="small"
                      color={todayCompleted ? 'success' : 'primary'}
                      startIcon={todayBusy ? <CircularProgress size={16} /> : <TodayIcon />}
                      disabled={todayBusy}
                      onClick={() => handleLogToday(habit)}
                    >
                      {todayCompleted ? 'Undo Today' : 'Log Today'}
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<WeekIcon />}
                      onClick={() => handleLogThisWeek(habit)}
                    >
                      Log This Week
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<RangeIcon />}
                      onClick={() => openRangeDialog(habit.id)}
                    >
                      Log Custom Range
                    </Button>
                  </Box>

                  {/* ── weekly log view ── */}
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 500 }}>
                      Last 7 Days
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
                      {weekDates.map((date) => {
                        const dayIndex = date.getDay();
                        const isTarget = isTargetDay(dayIndex, habit.frequency, targetDays);
                        const isCompleted = isLoggedForDate(habit, date);
                        const isToday = getDateStr(date) === todayStr();
                        const today = new Date(); today.setHours(0, 0, 0, 0);
                        const isFuture = date > today;
                        const busy = inflight.has(inflightKey(habit.id, getDateStr(date)));

                        return (
                          <Tooltip
                            key={getDateStr(date)}
                            title={
                              busy ? 'Saving…'
                                : isFuture ? 'Future date'
                                  : !isTarget ? 'Not a target day'
                                    : isCompleted ? 'Completed — click to uncheck'
                                      : 'Not done — click to check'
                            }
                          >
                            <Paper
                              elevation={isToday ? 3 : 0}
                              sx={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                p: 1, minWidth: 56, borderRadius: 2,
                                cursor: isTarget && !isFuture && !busy ? 'pointer' : 'default',
                                bgcolor: isToday ? 'primary.50' : 'transparent',
                                border: isToday ? '2px solid' : '1px solid',
                                borderColor: isToday ? 'primary.main' : 'divider',
                                opacity: !isTarget ? 0.4 : isFuture ? 0.5 : 1,
                                transition: 'all 0.15s',
                                '&:hover': isTarget && !isFuture && !busy ? { bgcolor: 'action.hover', transform: 'scale(1.05)' } : {},
                              }}
                              onClick={() => {
                                if (isTarget && !isFuture && !busy) {
                                  handleToggleLog(habit.id, date, isCompleted);
                                }
                              }}
                            >
                              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: isToday ? 700 : 400 }}>
                                {DAY_NAMES[dayIndex]}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                {date.getDate()}/{date.getMonth() + 1}
                              </Typography>
                              <Box sx={{ mt: 0.5 }}>
                                {busy ? (
                                  <CircularProgress size={24} />
                                ) : isTarget ? (
                                  isCompleted ? (
                                    <CheckIcon sx={{ color: habit.color || 'success.main', fontSize: 28 }} />
                                  ) : (
                                    <UncheckedIcon sx={{ color: 'grey.400', fontSize: 28 }} />
                                  )
                                ) : (
                                  <Box sx={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography variant="caption" color="text.disabled">—</Typography>
                                  </Box>
                                )}
                              </Box>
                            </Paper>
                          </Tooltip>
                        );
                      })}
                    </Box>
                  </Box>

                  {/* ── streak stats ── */}
                  {habit.streak && (
                    <Box sx={{ display: 'flex', gap: 3, mt: 2, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="body2" color="text.secondary">
                        Current Streak: <strong>{habit.streak.currentStreak}</strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Longest Streak: <strong>{habit.streak.longestStreak}</strong>
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* ═══════ Create Habit Dialog ═══════ */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Habit</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" value={newHabit.name}
            onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })} margin="normal" required autoFocus />
          <TextField fullWidth label="Description" value={newHabit.description}
            onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })} margin="normal" multiline rows={3} />
          <FormControl fullWidth margin="normal">
            <InputLabel>Frequency</InputLabel>
            <Select value={newHabit.frequency} label="Frequency"
              onChange={(e) => {
                const freq = e.target.value;
                setNewHabit({
                  ...newHabit, frequency: freq,
                  targetDays: freq === 'daily' ? [0, 1, 2, 3, 4, 5, 6] : freq === 'weekly' ? [1, 2, 3, 4, 5] : newHabit.targetDays,
                });
              }}>
              <MenuItem value="daily">Daily (every day)</MenuItem>
              <MenuItem value="weekly">Weekly (select days)</MenuItem>
              <MenuItem value="custom">Custom (pick specific days)</MenuItem>
            </Select>
          </FormControl>
          {(newHabit.frequency === 'weekly' || newHabit.frequency === 'custom') && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Select target days:</Typography>
              <FormGroup row>
                {DAY_NAMES.map((day, idx) => (
                  <FormControlLabel key={idx}
                    control={<Checkbox checked={newHabit.targetDays.includes(idx)}
                      onChange={() => handleTargetDayToggle(idx, setNewHabit, newHabit)} size="small" />}
                    label={day} />
                ))}
              </FormGroup>
            </Box>
          )}
          <TextField fullWidth label="Color" type="color" value={newHabit.color}
            onChange={(e) => setNewHabit({ ...newHabit, color: e.target.value })} margin="normal" InputLabelProps={{ shrink: true }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setCreateDialogOpen(false); setNewHabit({ ...EMPTY_HABIT }); }}>Cancel</Button>
          <Button onClick={handleCreateHabit} variant="contained" disabled={!newHabit.name}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* ═══════ Edit Habit Dialog ═══════ */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Habit</DialogTitle>
        <DialogContent>
          {editingHabit && (
            <>
              <TextField fullWidth label="Name" value={editingHabit.name}
                onChange={(e) => setEditingHabit({ ...editingHabit, name: e.target.value })} margin="normal" required autoFocus />
              <TextField fullWidth label="Description" value={editingHabit.description}
                onChange={(e) => setEditingHabit({ ...editingHabit, description: e.target.value })} margin="normal" multiline rows={3} />
              <FormControl fullWidth margin="normal">
                <InputLabel>Frequency</InputLabel>
                <Select value={editingHabit.frequency} label="Frequency"
                  onChange={(e) => {
                    const freq = e.target.value;
                    setEditingHabit({
                      ...editingHabit, frequency: freq,
                      targetDays: freq === 'daily' ? [0, 1, 2, 3, 4, 5, 6] : freq === 'weekly' ? [1, 2, 3, 4, 5] : editingHabit.targetDays,
                    });
                  }}>
                  <MenuItem value="daily">Daily (every day)</MenuItem>
                  <MenuItem value="weekly">Weekly (select days)</MenuItem>
                  <MenuItem value="custom">Custom (pick specific days)</MenuItem>
                </Select>
              </FormControl>
              {(editingHabit.frequency === 'weekly' || editingHabit.frequency === 'custom') && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Select target days:</Typography>
                  <FormGroup row>
                    {DAY_NAMES.map((day, idx) => (
                      <FormControlLabel key={idx}
                        control={<Checkbox checked={editingHabit.targetDays.includes(idx)}
                          onChange={() => handleTargetDayToggle(idx, setEditingHabit, editingHabit)} size="small" />}
                        label={day} />
                    ))}
                  </FormGroup>
                </Box>
              )}
              <TextField fullWidth label="Color" type="color" value={editingHabit.color}
                onChange={(e) => setEditingHabit({ ...editingHabit, color: e.target.value })} margin="normal" InputLabelProps={{ shrink: true }} />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" disabled={!editingHabit?.name}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* ═══════ Log Custom Range Dialog ═══════ */}
      <Dialog open={rangeDialogOpen} onClose={() => setRangeDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Log Custom Date Range</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select a date range. All un-logged target days within the range (up to today) will be marked as completed.
          </Typography>
          <TextField fullWidth label="Start Date" type="date" value={rangeStart}
            onChange={(e) => setRangeStart(e.target.value)} margin="normal"
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: todayStr() }} />
          <TextField fullWidth label="End Date" type="date" value={rangeEnd}
            onChange={(e) => setRangeEnd(e.target.value)} margin="normal"
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: todayStr() }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRangeDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleLogCustomRange} variant="contained" disabled={!rangeStart || !rangeEnd}>
            Log Range
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Habits;
