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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  CheckCircle as CheckIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { GET_HABITS } from '../graphql/queries/habits';
import { CREATE_HABIT, LOG_HABIT, DELETE_HABIT, UPDATE_HABIT } from '../graphql/mutations/habits';

const EMPTY_HABIT = { name: '', description: '', frequency: 'daily', color: '#4caf50' };

const Habits: React.FC = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<any>(null);
  const [newHabit, setNewHabit] = useState({ ...EMPTY_HABIT });
  const [error, setError] = useState('');

  const { data, loading, refetch } = useQuery(GET_HABITS);

  const [createHabit] = useMutation(CREATE_HABIT, {
    onCompleted: () => {
      setCreateDialogOpen(false);
      setNewHabit({ ...EMPTY_HABIT });
      setError('');
      refetch();
    },
    onError: (err) => setError(err.message),
  });

  const [updateHabit] = useMutation(UPDATE_HABIT, {
    onCompleted: () => {
      setEditDialogOpen(false);
      setEditingHabit(null);
      setError('');
      refetch();
    },
    onError: (err) => setError(err.message),
  });

  const [logHabit] = useMutation(LOG_HABIT, {
    onCompleted: () => refetch(),
    onError: (err) => setError(err.message),
  });

  const [deleteHabit] = useMutation(DELETE_HABIT, {
    onCompleted: () => refetch(),
    onError: (err) => setError(err.message),
  });

  const handleCreateHabit = () => {
    createHabit({
      variables: {
        createHabitInput: {
          name: newHabit.name,
          description: newHabit.description || undefined,
          frequency: newHabit.frequency,
          color: newHabit.color,
          targetDays: [0, 1, 2, 3, 4, 5, 6],
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
    });
    setEditDialogOpen(true);
  };

  const handleEditSave = () => {
    if (!editingHabit) return;
    updateHabit({
      variables: {
        id: editingHabit.id,
        updateHabitInput: {
          name: editingHabit.name,
          description: editingHabit.description || undefined,
          frequency: editingHabit.frequency,
          color: editingHabit.color,
        },
      },
    });
  };

  const handleLogHabit = (habitId: string) => {
    logHabit({
      variables: {
        habitId,
        date: new Date().toISOString().split('T')[0],
        completed: true,
      },
    });
  };

  const handleDeleteHabit = (id: string) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      deleteHabit({ variables: { id } });
    }
  };

  const habits = data?.habits || [];

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

      <Grid container spacing={2}>
        {habits.map((habit: any) => (
          <Grid item xs={12} sm={6} md={4} key={habit.id}>
            <Card sx={{ borderLeft: `4px solid ${habit.color || '#4caf50'}` }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6">{habit.name}</Typography>
                    {habit.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {habit.description}
                      </Typography>
                    )}
                  </Box>
                  <Chip label={habit.frequency} size="small" sx={{ backgroundColor: habit.color || '#4caf50', color: 'white' }} />
                </Box>

                {habit.streak && (
                  <Box sx={{ mt: 2, p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2">
                      Current Streak: <strong>{habit.streak.currentStreak}</strong> days
                    </Typography>
                    <Typography variant="body2">
                      Longest Streak: <strong>{habit.streak.longestStreak}</strong> days
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'space-between' }}>
                  <Button variant="contained" size="small" startIcon={<CheckIcon />} color="success" onClick={() => handleLogHabit(habit.id)}>
                    Log Today
                  </Button>
                  <Box>
                    <IconButton size="small" onClick={() => handleEditOpen(habit)} title="Edit">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteHabit(habit.id)} title="Delete" color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create Habit Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Habit</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" value={newHabit.name} onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })} margin="normal" required autoFocus />
          <TextField fullWidth label="Description" value={newHabit.description} onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })} margin="normal" multiline rows={3} />
          <FormControl fullWidth margin="normal">
            <InputLabel>Frequency</InputLabel>
            <Select value={newHabit.frequency} label="Frequency" onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value })}>
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl>
          <TextField fullWidth label="Color" type="color" value={newHabit.color} onChange={(e) => setNewHabit({ ...newHabit, color: e.target.value })} margin="normal" InputLabelProps={{ shrink: true }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateHabit} variant="contained" disabled={!newHabit.name}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Habit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Habit</DialogTitle>
        <DialogContent>
          {editingHabit && (
            <>
              <TextField fullWidth label="Name" value={editingHabit.name} onChange={(e) => setEditingHabit({ ...editingHabit, name: e.target.value })} margin="normal" required autoFocus />
              <TextField fullWidth label="Description" value={editingHabit.description} onChange={(e) => setEditingHabit({ ...editingHabit, description: e.target.value })} margin="normal" multiline rows={3} />
              <FormControl fullWidth margin="normal">
                <InputLabel>Frequency</InputLabel>
                <Select value={editingHabit.frequency} label="Frequency" onChange={(e) => setEditingHabit({ ...editingHabit, frequency: e.target.value })}>
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="custom">Custom</MenuItem>
                </Select>
              </FormControl>
              <TextField fullWidth label="Color" type="color" value={editingHabit.color} onChange={(e) => setEditingHabit({ ...editingHabit, color: e.target.value })} margin="normal" InputLabelProps={{ shrink: true }} />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" disabled={!editingHabit?.name}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Habits;
