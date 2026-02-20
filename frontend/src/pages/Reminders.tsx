import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Add as AddIcon,
  Snooze as SnoozeIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { GET_REMINDERS } from '../graphql/queries/reminders';
import { CREATE_REMINDER, UPDATE_REMINDER, SNOOZE_REMINDER, COMPLETE_REMINDER, DELETE_REMINDER } from '../graphql/mutations/reminders';

const EMPTY_REMINDER = { title: '', description: '', reminderTime: '', timezone: 'UTC', isRecurring: false };

const Reminders: React.FC = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<any>(null);
  const [newReminder, setNewReminder] = useState({ ...EMPTY_REMINDER });
  const [error, setError] = useState('');

  const { data, loading, refetch } = useQuery(GET_REMINDERS, {
    variables: { upcoming: true },
  });

  const [createReminder] = useMutation(CREATE_REMINDER, {
    onCompleted: () => {
      setCreateDialogOpen(false);
      setNewReminder({ ...EMPTY_REMINDER });
      setError('');
      refetch();
    },
    onError: (err) => setError(err.message),
  });

  const [updateReminder] = useMutation(UPDATE_REMINDER, {
    onCompleted: () => {
      setEditDialogOpen(false);
      setEditingReminder(null);
      setError('');
      refetch();
    },
    onError: (err) => setError(err.message),
  });

  const [snoozeReminder] = useMutation(SNOOZE_REMINDER, {
    onCompleted: () => refetch(),
    onError: (err) => setError(err.message),
  });

  const [completeReminder] = useMutation(COMPLETE_REMINDER, {
    onCompleted: () => refetch(),
    onError: (err) => setError(err.message),
  });

  const [deleteReminder] = useMutation(DELETE_REMINDER, {
    onCompleted: () => refetch(),
    onError: (err) => setError(err.message),
  });

  const handleCreateReminder = () => {
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

  const handleDeleteReminder = (id: string) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      deleteReminder({ variables: { id } });
    }
  };

  const reminders = data?.reminders || [];

  const isPast = (dateStr: string) => new Date(dateStr) < new Date();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Reminders ({reminders.length})
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateDialogOpen(true)}>
          New Reminder
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      {!loading && reminders.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">No upcoming reminders</Typography>
          <Typography variant="body2" color="text.secondary">Click "New Reminder" to set one up.</Typography>
        </Box>
      )}

      <Grid container spacing={2}>
        {reminders.map((reminder: any) => (
          <Grid item xs={12} sm={6} md={4} key={reminder.id}>
            <Card sx={{
              borderLeft: reminder.isCompleted ? '4px solid green' : isPast(reminder.reminderTime) ? '4px solid red' : '4px solid #1976d2',
              opacity: reminder.isCompleted ? 0.7 : 1,
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ textDecoration: reminder.isCompleted ? 'line-through' : 'none' }}>
                      {reminder.title}
                    </Typography>
                    {reminder.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {reminder.description}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', ml: 1 }}>
                    <IconButton size="small" onClick={() => handleEditOpen(reminder)} title="Edit">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteReminder(reminder.id)} title="Delete" color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body2" color={isPast(reminder.reminderTime) && !reminder.isCompleted ? 'error' : 'text.secondary'} sx={{ mt: 1.5 }}>
                  {new Date(reminder.reminderTime).toLocaleString()}
                </Typography>

                <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                  {reminder.isRecurring && <Chip label="Recurring" size="small" color="info" />}
                  {reminder.isCompleted && <Chip label="Completed" size="small" color="success" />}
                  {isPast(reminder.reminderTime) && !reminder.isCompleted && <Chip label="Overdue" size="small" color="error" />}
                </Box>

                {!reminder.isCompleted && (
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
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

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
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
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
