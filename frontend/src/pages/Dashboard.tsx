import React from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  LinearProgress,
  Chip,
  Divider,
} from '@mui/material';
import {
  Assignment as TaskIcon,
  Warning as WarningIcon,
  FitnessCenter as HabitIcon,
  NotificationsActive as ReminderIcon,
} from '@mui/icons-material';
import { GET_TASKS, GET_OVERDUE_TASKS, GET_UPCOMING_TASKS } from '../graphql/queries/tasks';
import { GET_PINNED_NOTES } from '../graphql/queries/notes';
import { GET_HABITS } from '../graphql/queries/habits';
import { GET_ALL_REMINDERS } from '../graphql/queries/reminders';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const { data: tasksData } = useQuery(GET_TASKS, {
    variables: { pagination: { page: 1, limit: 100 } },
    fetchPolicy: 'cache-and-network',
  });
  const { data: overdueData } = useQuery(GET_OVERDUE_TASKS, { fetchPolicy: 'cache-and-network' });
  const { data: upcomingData } = useQuery(GET_UPCOMING_TASKS, { variables: { days: 7 }, fetchPolicy: 'cache-and-network' });
  const { data: notesData } = useQuery(GET_PINNED_NOTES, { fetchPolicy: 'cache-and-network' });
  const { data: habitsData } = useQuery(GET_HABITS, { fetchPolicy: 'cache-and-network' });
  const { data: remindersData } = useQuery(GET_ALL_REMINDERS, { fetchPolicy: 'cache-and-network' });

  const totalTasks = tasksData?.tasks?.meta?.total ?? 0;
  const tasks = tasksData?.tasks?.tasks || [];
  const overdueTasks = overdueData?.overdueTasks || [];
  const upcomingTasks = upcomingData?.upcomingTasks || [];
  const pinnedNotes = notesData?.pinnedNotes || [];
  const habits = habitsData?.habits || [];
  const allReminders = remindersData?.reminders || [];
  const activeReminders = allReminders.filter((r: any) => !r.isCompleted);

  const completedTasks = tasks.filter((t: any) => t.status === 'done').length;
  const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  console.log('[Dashboard] Stats:', {
    totalTasks,
    completedTasks,
    overdue: overdueTasks.length,
    habits: habits.length,
    activeReminders: activeReminders.length,
    pinnedNotes: pinnedNotes.length,
  });

  const statCardSx = {
    height: '100%',
    transition: 'transform 0.15s, box-shadow 0.15s',
    '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      {/* Stats Cards – all same height, clickable */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={statCardSx}>
            <CardActionArea onClick={() => navigate('/tasks')} sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <TaskIcon color="primary" />
                  <Typography color="text.secondary">Total Tasks</Typography>
                </Box>
                <Typography variant="h4">{totalTasks}</Typography>
                <LinearProgress variant="determinate" value={taskCompletionRate} sx={{ mt: 2 }} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {completedTasks} completed
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={statCardSx}>
            <CardActionArea onClick={() => navigate('/tasks')} sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <WarningIcon color="error" />
                  <Typography color="text.secondary">Overdue Tasks</Typography>
                </Box>
                <Typography variant="h4" color="error">
                  {overdueTasks.length}
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  {overdueTasks.length > 0 ? 'Needs attention!' : 'All caught up'}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={statCardSx}>
            <CardActionArea onClick={() => navigate('/habits')} sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <HabitIcon color="success" />
                  <Typography color="text.secondary">Active Habits</Typography>
                </Box>
                <Typography variant="h4">{habits.length}</Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  {habits.length > 0 ? 'Keep going!' : 'Start a habit'}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={statCardSx}>
            <CardActionArea onClick={() => navigate('/reminders')} sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <ReminderIcon color="info" />
                  <Typography color="text.secondary">Active Reminders</Typography>
                </Box>
                <Typography variant="h4">{activeReminders.length}</Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  {activeReminders.length > 0 ? `Next: ${activeReminders[0]?.title}` : 'No reminders'}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Overdue Tasks */}
        {overdueTasks.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Overdue Tasks
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {overdueTasks.slice(0, 5).map((task: any) => (
                  <Box
                    key={task.id}
                    sx={{ mb: 1.5, p: 1.5, bgcolor: 'error.50', border: '1px solid', borderColor: 'error.200', borderRadius: 1, cursor: 'pointer' }}
                    onClick={() => navigate('/tasks')}
                  >
                    <Typography variant="subtitle2">{task.title}</Typography>
                    <Chip label={task.priority} size="small" color="error" sx={{ mt: 0.5 }} />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Upcoming Tasks */}
        {upcomingTasks.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Upcoming Tasks (7 days)
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {upcomingTasks.slice(0, 5).map((task: any) => (
                  <Box
                    key={task.id}
                    sx={{ mb: 1.5, p: 1.5, bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200', borderRadius: 1, cursor: 'pointer' }}
                    onClick={() => navigate('/tasks')}
                  >
                    <Typography variant="subtitle2">{task.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Pinned Notes */}
        {pinnedNotes.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Pinned Notes
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {pinnedNotes.slice(0, 3).map((note: any) => (
                  <Box key={note.id} sx={{ mb: 1.5, cursor: 'pointer' }} onClick={() => navigate('/notes')}>
                    <Typography variant="subtitle2">{note.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {note.content?.substring(0, 80)}...
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Habits Streaks */}
        {habits.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Habit Streaks
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {habits.slice(0, 5).map((habit: any) => (
                  <Box
                    key={habit.id}
                    sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => navigate('/habits')}
                  >
                    <Typography variant="subtitle2">{habit.name}</Typography>
                    {habit.streak && (
                      <Chip label={`${habit.streak.currentStreak} day streak`} size="small" color="primary" />
                    )}
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Dashboard;
