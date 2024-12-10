import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sign in
      const app_id = localStorage.getItem('app_id');
      const signInResponse = await axios.post('https://fs191x.buildship.run/dtrader-next/session', {
        ...formData,
        app_id
      });
  
      Cookies.set('access_token', signInResponse.data.output.access_token);
      Cookies.set('refresh_token', signInResponse.data.output.refresh_token);

      // Get champion token
      const championResponse = await axios.post('https://fs191x.buildship.run/dtrader-next/champion-token', {
        email: formData.email,
        password: formData.password,
        app_id
      });

      Cookies.set('champion_token', championResponse.data.output.champion_token);
      localStorage.setItem('account_id', championResponse.data.output.account_id);

      navigate('/account');
    } catch (error) {
      console.error('Sign in failed:', error);
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
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
