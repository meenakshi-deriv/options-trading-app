import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Trading from './components/Trading';
import Account from './components/Account';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/trading" element={<Trading />} />
          <Route path="/account" element={<Account />} />
          <Route path="/" element={<Navigate to="/signin" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
