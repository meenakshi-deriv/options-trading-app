import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [appId, setAppId] = useState('');

    const handleSignup = async () => {
        const response = await axios.post('https://fs191x.buildship.run/dtrader-next/signup', {
            email,
            password,
            currency,
            app_id: appId
        });
        localStorage.setItem('user_id', response.data.user_id);
        localStorage.setItem('currency', currency);
        localStorage.setItem('app_id', appId);
        // Redirect to login
    };

    return (
        <div>
            <h2>Signup this</h2>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
                <option value="AUD">AUD</option>
            </select>
            <input type="text" value={appId} onChange={(e) => setAppId(e.target.value)} placeholder="App ID" />
            <button onClick={handleSignup}>Signup</button>
        </div>
    );
};

export default Signup;
