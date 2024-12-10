import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router';
import Signup from './components/Signup.js';
import Login from './components/Login';
import Trading from './components/Trading';
import Account from './components/Account';
import Deposit from './components/Deposit';
import Statement from './components/Statement';
import Buy from './components/Buy';
import Sell from './components/Sell';
import Withdraw from './components/Withdraw';

const App = () => {
    return (
        <Router>
            <nav>
                <Link to="/signup">Signup</Link>
                <Link to="/login">Login</Link>
                <Link to="/trading">Trading</Link>
                <Link to="/account">Account</Link>
            </nav>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/trading" element={<Trading />} />
                <Route path="/account" element={<Account />} />
                <Route path="/account/deposit" element={<Deposit />} />
                <Route path="/account/withdraw" element={<Withdraw />} />
                <Route path="/account/statement" element={<Statement />} />
                <Route path="/buy" element={<Buy />} />
                <Route path="/sell" element={<Sell />} />
                <Route path="/" element={<Login />} />
            </Routes>
        </Router>
    );
};

export default App;
