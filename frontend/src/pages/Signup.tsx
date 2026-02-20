import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link as MuiLink,
} from '@mui/material';
import { SIGNUP_MUTATION } from '../graphql/mutations/auth';
import { useAuth } from '../contexts/AuthContext';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  username: yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

interface SignupForm {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string>('');
  const [signupMutation, { loading }] = useMutation(SIGNUP_MUTATION);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: SignupForm) => {
    try {
      setError('');
      const result = await signupMutation({
        variables: {
          signupInput: {
            email: data.email,
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            password: data.password,
          },
        },
      });

      if (result.data?.signup) {
        const { access_token, user } = result.data.signup;
        login(access_token, user);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Sign Up
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Username"
              {...register('username')}
              error={!!errors.username}
              helperText={errors.username?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              label="First Name"
              {...register('firstName')}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Last Name"
              {...register('lastName')}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              margin="normal"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
            <Box textAlign="center">
              <MuiLink component={Link} to="/login">
                Already have an account? Login
              </MuiLink>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Signup;
