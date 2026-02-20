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
  FormControlLabel,
  Checkbox,
  Chip,
  Alert,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  Add as AddIcon,
  Snooze as SnoozeIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Replay as ReplayIcon,
} from '@mui/icons-material';
import { GET_ALL_REMINDERS } from '../graphql/queries/reminders';
import { CREATE_REMINDER, UPDATE_REMINDER, SNOOZE_REMINDER, COMPLETE_REMINDER, DELETE_REMINDER } from '../graphql/mutations/reminders';

const EMPTY_REMINDER = { title: '', description: '', reminderTime: '', timezone: 'UTC', isRecurring: false };

const Reminders: React.FC = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<any>(null);
  const [newReminder, setNewReminder] = useState({ ...EMPTY_REMINDER });
  const [error, setError] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);

  const { data, loading, refetch } = useQuery(GET_ALL_REMINDERS);

  const refetchAll = useCallback(() => {
    console.log('[Reminders] Refetching reminders data…');
    refetch();
  }, [refetch]);

  const [createReminder] = useMutation(CREATE_REMINDER, {
    onCompleted: (data) => {
      console.log('[Reminders] Created reminder:', data.createReminder.title);
      setCreateDialogOpen(false);
      setNewReminder({ ...EMPTY_REMINDER });
      setError('');
      refetchAll();
    },
    onError: (err) => {
      console.error('[Reminders] Create error:', err.message);
      setError(err.message);
    },
  });

  const [updateReminder] = useMutation(UPDATE_REMINDER, {
    onCompleted: (data) => {
      console.log('[Reminders] Updated reminder:', data.updateReminder.id);
      setEditDialogOpen(false);
      setEditingReminder(null);
      setError('');
      refetchAll();
    },
    onError: (err) => {
      console.error('[Reminders] Update error:', err.message);
      setError(err.message);
    },
  });

  const [snoozeReminder] = useMutation(SNOOZE_REMINDER, {
    onCompleted: (data) => {
      console.log('[Reminders] Snoozed reminder:', data.snoozeReminder.id, 'new time:', data.snoozeReminder.reminderTime);
      refetchAll();
    },
    onError: (err) => {
      console.error('[Reminders] Snooze error:', err.message);
      setError(err.message);
    },
  });

  const [completeReminder] = useMutation(COMPLETE_REMINDER, {
    onCompleted: (data) => {
      console.log('[Reminders] Completed reminder:', data.completeReminder.id, 'isRecurring:', data.completeReminder.isRecurring);
      refetchAll();
    },
    onError: (err) => {
      console.error('[Reminders] Complete error:', err.message);
      setError(err.message);
    },
  });

  const [deleteReminder] = useMutation(DELETE_REMINDER, {
    onCompleted: () => {
      console.log('[Reminders] Deleted reminder');
      refetchAll();
    },
    onError: (err) => {
      console.error('[Reminders] Delete error:', err.message);
      setError(err.message);
    },
  });

  const handleCreateReminder = () => {
    console.log('[Reminders] Creating reminder:', newReminder.title);
    createReminder({
      variables: {
        createReminderInput: {
          title: newReminder.title,
          description: newReminder.description || undefined,
          reminderTime: new Date(newReminder.reminderTime).toISOString(),
          timezone: newReminder.timezone,
          isRecurring: newReminder.isRecurring,
        },
      },
    });
  };

  const handleEditOpen = (reminder: any) => {
    setEditingReminder({
      id: reminder.id,
      title: reminder.title,
      description: reminder.description || '',
      reminderTime: reminder.reminderTime ? new Date(reminder.reminderTime).toISOString().slice(0, 16) : '',
      timezone: reminder.timezone || 'UTC',
      isRecurring: reminder.isRecurring || false,
    });
    setEditDialogOpen(true);
  };

  const handleEditSave = () => {
    if (!editingReminder) return;
    console.log('[Reminders] Saving edit for reminder:', editingReminder.id);
    updateReminder({
      variables: {
        id: editingReminder.id,
        updateReminderInput: {
          title: editingReminder.title,
          description: editingReminder.description || undefined,
          reminderTime: editingReminder.reminderTime ? new Date(editingReminder.reminderTime).toISOString() : undefined,
          timezone: editingReminder.timezone,
          isRecurring: editingReminder.isRecurring,
        },
      },
    });
  };

  const handleReactivate = (reminder: any) => {
    console.log('[Reminders] Reactivating recurring reminder:', reminder.id);
    const now = new Date();
    now.setMinutes(now.getMinutes() + 60);
    updateReminder({
      variables: {
        id: reminder.id,
        updateReminderInput: {
          reminderTime: now.toISOString(),
          isRecurring: true,
        },
      },
    });
  };

  const handleDeleteReminder = (id: string) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      deleteReminder({ variables: { id } });
    }
  };

  const allReminders = data?.reminders || [];
  const now = new Date();

  const { overdueReminders, upcomingReminders, completedReminders } = useMemo(() => {
    const overdue: any[] = [];
    const upcoming: any[] = [];
    const completed: any[] = [];

    allReminders.forEach((r: any) => {
      if (r.isCompleted) {
        completed.push(r);
      } else if (new Date(r.reminderTime) < now) {
        overdue.push(r);
      } else {
        upcoming.push(r);
      }
    });

    return { overdueReminders: overdue, upcomingReminders: upcoming, completedReminders: completed };
  }, [allReminders]);

  const isPast = (dateStr: string) => new Date(dateStr) < now;

  const ReminderCard = ({ reminder, isCompleted = false }: { reminder: any; isCompleted?: boolean }) => (
    <Card sx={{
      borderLeft: isCompleted
        ? '4px solid #4caf50'
        : isPast(reminder.reminderTime)
          ? '4px solid #f44336'
          : '4px solid #1976d2',
      opacity: isCompleted ? 0.75 : 1,
      transition: 'box-shadow 0.2s',
      '&:hover': { boxShadow: 4 },
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ textDecoration: isCompleted ? 'line-through' : 'none' }}>
              {reminder.title}
            </Typography>
            {reminder.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {reminder.description}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', ml: 1 }}>
            {!isCompleted && (
              <IconButton size="small" onClick={() => handleEditOpen(reminder)} title="Edit">
                <EditIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton size="small" onClick={() => handleDeleteReminder(reminder.id)} title="Delete" color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Typography
          variant="body2"
          color={isPast(reminder.reminderTime) && !isCompleted ? 'error' : 'text.secondary'}
          sx={{ mt: 1.5 }}
        >
          {new Date(reminder.reminderTime).toLocaleString()}
        </Typography>

        <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
          {reminder.isRecurring && <Chip label="Recurring" size="small" color="info" />}
          {isCompleted && <Chip label="Completed" size="small" color="success" />}
          {isPast(reminder.reminderTime) && !isCompleted && <Chip label="Overdue" size="small" color="error" />}
        </Box>

        {!isCompleted && (
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button variant="outlined" size="small" startIcon={<SnoozeIcon />} onClick={() => snoozeReminder({ variables: { id: reminder.id, minutes: 15 } })}>
              +15m
            </Button>
            <Button variant="outlined" size="small" startIcon={<SnoozeIcon />} onClick={() => snoozeReminder({ variables: { id: reminder.id, minutes: 60 } })}>
              +1h
            </Button>
            <Button variant="contained" size="small" startIcon={<CheckIcon />} color="success" onClick={() => completeReminder({ variables: { id: reminder.id } })}>
              Done
            </Button>
          </Box>
        )}

        {/* Reactivate button for completed recurring reminders */}
        {isCompleted && reminder.isRecurring && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<ReplayIcon />}
              color="primary"
              onClick={() => handleReactivate(reminder)}
            >
              Schedule Next
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Reminders ({allReminders.length})
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateDialogOpen(true)}>
          New Reminder
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      {!loading && allReminders.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">No reminders yet</Typography>
          <Typography variant="body2" color="text.secondary">Click "New Reminder" to set one up.</Typography>
        </Box>
      )}

      {/* Overdue Section */}
      {overdueReminders.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
            🔴 Overdue ({overdueReminders.length})
          </Typography>
          <Grid container spacing={2}>
            {overdueReminders.map((reminder: any) => (
              <Grid item xs={12} sm={6} md={4} key={reminder.id}>
                <ReminderCard reminder={reminder} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Upcoming Section */}
      {upcomingReminders.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            🔵 Upcoming ({upcomingReminders.length})
          </Typography>
          <Grid container spacing={2}>
            {upcomingReminders.map((reminder: any) => (
              <Grid item xs={12} sm={6} md={4} key={reminder.id}>
                <ReminderCard reminder={reminder} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Completed Section */}
      {completedReminders.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, cursor: 'pointer' }}
            onClick={() => setShowCompleted(!showCompleted)}
          >
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main' }}>
              ✅ Completed ({completedReminders.length})
            </Typography>
            {showCompleted ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Box>
          <Collapse in={showCompleted}>
            <Grid container spacing={2}>
              {completedReminders.map((reminder: any) => (
                <Grid item xs={12} sm={6} md={4} key={reminder.id}>
                  <ReminderCard reminder={reminder} isCompleted />
                </Grid>
              ))}
            </Grid>
          </Collapse>
        </Box>
      )}

      {/* No active reminders message */}
      {!loading && overdueReminders.length === 0 && upcomingReminders.length === 0 && completedReminders.length > 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          All reminders completed! Recurring reminders can be rescheduled from the Completed section below.
        </Alert>
      )}

      {/* Create Reminder Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Reminder</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Title" value={newReminder.title} onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })} margin="normal" required autoFocus />
          <TextField fullWidth label="Description" value={newReminder.description} onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })} margin="normal" multiline rows={3} />
          <TextField fullWidth label="Reminder Time" type="datetime-local" value={newReminder.reminderTime} onChange={(e) => setNewReminder({ ...newReminder, reminderTime: e.target.value })} margin="normal" InputLabelProps={{ shrink: true }} required />
          <FormControlLabel
            control={<Checkbox checked={newReminder.isRecurring} onChange={(e) => setNewReminder({ ...newReminder, isRecurring: e.target.checked })} />}
            label="Recurring"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setCreateDialogOpen(false); setNewReminder({ ...EMPTY_REMINDER }); }}>Cancel</Button>
          <Button onClick={handleCreateReminder} variant="contained" disabled={!newReminder.title || !newReminder.reminderTime}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Reminder Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Reminder</DialogTitle>
        <DialogContent>
          {editingReminder && (
            <>
              <TextField fullWidth label="Title" value={editingReminder.title} onChange={(e) => setEditingReminder({ ...editingReminder, title: e.target.value })} margin="normal" required autoFocus />
              <TextField fullWidth label="Description" value={editingReminder.description} onChange={(e) => setEditingReminder({ ...editingReminder, description: e.target.value })} margin="normal" multiline rows={3} />
              <TextField fullWidth label="Reminder Time" type="datetime-local" value={editingReminder.reminderTime} onChange={(e) => setEditingReminder({ ...editingReminder, reminderTime: e.target.value })} margin="normal" InputLabelProps={{ shrink: true }} required />
              <FormControlLabel
                control={<Checkbox checked={editingReminder.isRecurring} onChange={(e) => setEditingReminder({ ...editingReminder, isRecurring: e.target.checked })} />}
                label="Recurring"
                sx={{ mt: 1 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" disabled={!editingReminder?.title || !editingReminder?.reminderTime}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Reminders;
