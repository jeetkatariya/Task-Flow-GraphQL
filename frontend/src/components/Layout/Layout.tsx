import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Menu,
  MenuItem,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TaskFlow
          </Typography>
          <Button color="inherit" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={() => navigate('/tasks')}>
            Tasks
          </Button>
          <Button color="inherit" onClick={() => navigate('/notes')}>
            Notes
          </Button>
          <Button color="inherit" onClick={() => navigate('/habits')}>
            Habits
          </Button>
          <Button color="inherit" onClick={() => navigate('/reminders')}>
            Reminders
          </Button>
          <Button
            color="inherit"
            startIcon={<AccountCircle />}
            onClick={handleMenuOpen}
          >
            {user?.username}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;
