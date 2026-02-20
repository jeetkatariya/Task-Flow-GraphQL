import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  CheckCircle as CheckIcon,
  RadioButtonUnchecked as CircleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { GET_TASKS, GET_OVERDUE_TASKS } from '../graphql/queries/tasks';
import { CREATE_TASK, UPDATE_TASK, COMPLETE_TASK, DELETE_TASK } from '../graphql/mutations/tasks';

const EMPTY_TASK = { title: '', description: '', priority: 'medium', status: 'todo', dueDate: '' };

const Tasks: React.FC = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [statusTab, setStatusTab] = useState('all');
  const [newTask, setNewTask] = useState({ ...EMPTY_TASK });
  const [error, setError] = useState('');

  const filterVars: any = { pagination: { page: 1, limit: 100 } };
  if (statusTab && statusTab !== 'all') {
    filterVars.filter = { status: [statusTab] };
  }

  const { data: tasksData, loading, refetch } = useQuery(GET_TASKS, { variables: filterVars });
  const { data: overdueData, refetch: refetchOverdue } = useQuery(GET_OVERDUE_TASKS);

  const refetchAll = () => { refetch(); refetchOverdue(); };

  const [createTask] = useMutation(CREATE_TASK, {
    onCompleted: () => {
      setCreateDialogOpen(false);
      setNewTask({ ...EMPTY_TASK });
      setError('');
      refetchAll();
    },
    onError: (err) => setError(err.message),
  });

  const [updateTask] = useMutation(UPDATE_TASK, {
    onCompleted: () => {
      setEditDialogOpen(false);
      setEditingTask(null);
      setError('');
      refetchAll();
    },
    onError: (err) => setError(err.message),
  });

  const [completeTask] = useMutation(COMPLETE_TASK, {
    onCompleted: () => refetchAll(),
    onError: (err) => setError(err.message),
  });

  const [deleteTask] = useMutation(DELETE_TASK, {
    onCompleted: () => refetchAll(),
    onError: (err) => setError(err.message),
  });

  const handleCreateTask = () => {
    const input: any = { title: newTask.title };
    if (newTask.description) input.description = newTask.description;
    if (newTask.priority) input.priority = newTask.priority;
    if (newTask.dueDate) input.dueDate = new Date(newTask.dueDate).toISOString();
    createTask({ variables: { createTaskInput: input } });
  };

  const handleEditOpen = (task: any) => {
    setEditingTask({
      id: task.id,
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '',
    });
    setEditDialogOpen(true);
  };

  const handleEditSave = () => {
    if (!editingTask) return;
    const input: any = {};
    if (editingTask.title) input.title = editingTask.title;
    if (editingTask.description !== undefined) input.description = editingTask.description;
    if (editingTask.priority) input.priority = editingTask.priority;
    if (editingTask.status) input.status = editingTask.status;
    if (editingTask.dueDate) input.dueDate = new Date(editingTask.dueDate).toISOString();
    updateTask({ variables: { id: editingTask.id, updateTaskInput: input } });
  };

  const handleCompleteTask = (id: string) => {
    completeTask({ variables: { id } });
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask({ variables: { id } });
    }
  };

  const getPriorityColor = (priority: string): 'error' | 'warning' | 'info' | 'success' | 'default' => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string): 'success' | 'info' | 'warning' | 'default' => {
    switch (status) {
      case 'done': return 'success';
      case 'in_progress': return 'info';
      case 'todo': return 'warning';
      default: return 'default';
    }
  };

  const tasks = tasksData?.tasks?.tasks || [];
  const totalCount = tasksData?.tasks?.meta?.total ?? 0;
  const overdueTasks = overdueData?.overdueTasks || [];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Tasks ({totalCount})
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateDialogOpen(true)}>
          New Task
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      {/* Status filter tabs */}
      <Tabs value={statusTab} onChange={(_, v) => setStatusTab(v)} sx={{ mb: 3 }}>
        <Tab label="All" value="all" />
        <Tab label="Todo" value="todo" />
        <Tab label="In Progress" value="in_progress" />
        <Tab label="Done" value="done" />
      </Tabs>

      {/* Overdue banner */}
      {overdueTasks.length > 0 && statusTab === 'all' && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          You have <strong>{overdueTasks.length}</strong> overdue task(s)!
        </Alert>
      )}

      {loading && <Typography>Loading tasks...</Typography>}

      {!loading && tasks.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">No tasks found</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Click "New Task" to create one.
          </Typography>
        </Box>
      )}

      <Grid container spacing={2}>
        {tasks.map((task: any) => (
          <Grid item xs={12} sm={6} md={4} key={task.id}>
            <Card sx={{
              opacity: task.status === 'done' ? 0.7 : 1,
              borderLeft: task.isOverdue ? '4px solid red' : 'none',
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="h6"
                      sx={{ textDecoration: task.status === 'done' ? 'line-through' : 'none' }}
                      noWrap
                    >
                      {task.title}
                    </Typography>
                    {task.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }} noWrap>
                        {task.description}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 1.5, flexWrap: 'wrap' }}>
                      <Chip label={task.priority} color={getPriorityColor(task.priority)} size="small" />
                      <Chip label={task.status.replace('_', ' ')} color={getStatusColor(task.status)} size="small" variant="outlined" />
                    </Box>
                    {task.dueDate && (
                      <Typography variant="caption" color={task.isOverdue ? 'error' : 'text.secondary'} sx={{ mt: 1, display: 'block' }}>
                        Due: {new Date(task.dueDate).toLocaleString()}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', ml: 1 }}>
                    <IconButton size="small" onClick={() => handleCompleteTask(task.id)} title="Complete">
                      {task.status === 'done' ? <CheckIcon color="success" /> : <CircleIcon />}
                    </IconButton>
                    <IconButton size="small" onClick={() => handleEditOpen(task)} title="Edit">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteTask(task.id)} title="Delete" color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} margin="normal" required autoFocus />
          <TextField fullWidth label="Description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} margin="normal" multiline rows={3} />
          <FormControl fullWidth margin="normal">
            <InputLabel>Priority</InputLabel>
            <Select value={newTask.priority} label="Priority" onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="urgent">Urgent</MenuItem>
            </Select>
          </FormControl>
          <TextField fullWidth label="Due Date" type="datetime-local" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} margin="normal" InputLabelProps={{ shrink: true }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateTask} variant="contained" disabled={!newTask.title}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          {editingTask && (
            <>
              <TextField fullWidth label="Title" value={editingTask.title} onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })} margin="normal" required autoFocus />
              <TextField fullWidth label="Description" value={editingTask.description} onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })} margin="normal" multiline rows={3} />
              <FormControl fullWidth margin="normal">
                <InputLabel>Priority</InputLabel>
                <Select value={editingTask.priority} label="Priority" onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select value={editingTask.status} label="Status" onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}>
                  <MenuItem value="todo">Todo</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="done">Done</MenuItem>
                </Select>
              </FormControl>
              <TextField fullWidth label="Due Date" type="datetime-local" value={editingTask.dueDate} onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })} margin="normal" InputLabelProps={{ shrink: true }} />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" disabled={!editingTask?.title}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Tasks;
