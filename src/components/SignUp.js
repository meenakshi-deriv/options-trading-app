import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const currencies = ['USD', 'GBP', 'JPY', 'AUD'];

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    app_id: '',
    currency: 'USD',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Define your JWT bearer token
    const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEwMDAsImFwcF9pZCI6MTAwMCwiaWF0IjoxNzMzMzc2ODMxLCJleHAiOjE3NjQ5MTI4MjJ9.dobQ9wKzr9tSYuks6FbAxdgTSXx0BOEkKT8WuIQT1JYe0isj5WFTOFpLdYAbhV1tcXthbHHNz8Bk9AiHd0xhoAx49Jqi0BYejoXcIdsBQdFGLuaHgd4IZk2vM4M_McxChqNFFwktjKRswWnAYjFzHl-Fl6sy8Qb9Xt-CTJje8TD7lpmkGMyrAqTcXyUFDBg4-xQM66O0xxV4zn7v0RWmlF4S5JXtyXS0kEFSrgbwinrZ2fpEbDoLSGzz2-_yQO-TSSW9BYPRB077bWZcX0POREumH0ry-bDekwiXOrHKdHoAmmslpqev4-XONLJfXiBZszWdu9WLpgW4r-HTAD22SQ';

    try {
      const response = await axios.post('https://fs191x.buildship.run/dtrader-next/signup', formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Add the bearer token here
        },
      });

      if (response.data ) {
        localStorage.setItem('user_id', response.data.output.user_id);
        localStorage.setItem('currency', formData.currency);
        localStorage.setItem('app_id', formData.app_id);
        navigate('/signin');
      } else {
        console.error('Unexpected response format', response.data);
      }
    } catch (error) {
      if (error.response) {
        console.error('Signup failed with status:', error.response.status);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error', error.message);
      }
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
          Sign Up
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="app_id"
            label="App ID"
            id="app_id"
            value={formData.app_id}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            select
            name="currency"
            label="Currency"
            value={formData.currency}
            onChange={handleChange}
          >
            {currencies.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default SignUp;