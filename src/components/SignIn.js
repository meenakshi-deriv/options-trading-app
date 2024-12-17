import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Box,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const app_id = localStorage.getItem('app_id');
      
      // Sign in and get accounts
      const signInResponse = await axios.post('https://fs191x.buildship.run/dtrader-next/session', {
        ...formData,
        app_id
      });

      console.log('Sign in response:', signInResponse.data); // Debug log

      // Store tokens
      Cookies.set('access_token', signInResponse.data.output.access_token);
      Cookies.set('refresh_token', signInResponse.data.output.refresh_token);

      // Store accounts in localStorage for account selection
      if (signInResponse.data.output && signInResponse.data.output.accounts) {
        localStorage.setItem('available_accounts', JSON.stringify(signInResponse.data.output.accounts));
      } else {
        console.error('No accounts found in response');
        setError('No accounts found for this user');
        return;
      }

      // Get champion token
      const championResponse = await axios.post('https://fs191x.buildship.run/dtrader-next/champion-token', {
        email: formData.email,
        password: formData.password,
        app_id
      });

      Cookies.set('champion_token', championResponse.data.output.champion_token);

      // Navigate to account page for account selection
      navigate('/account');
    } catch (error) {
      console.error('Sign in error:', error.response?.data || error); // Debug log
      setError('Sign in failed. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Sign In
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default SignIn;
