import { Typography, Box, Paper, Avatar } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <Paper sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ width: 64, height: 64, mr: 2 }}>
          {user?.firstName?.[0]}{user?.lastName?.[0]}
        </Avatar>
        <Box>
          <Typography variant="h4">
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            @{user?.username}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Account Information
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {user?.email}
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          <strong>Username:</strong> {user?.username}
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          <strong>Name:</strong> {user?.firstName} {user?.lastName}
        </Typography>
      </Box>
    </Paper>
  );
};

export default Profile;
