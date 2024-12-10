import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const response = await axios.post('https://fs191x.buildship.run/dtrader-next/session', {
            email,
            password,
            app_id: localStorage.getItem('app_id')
        });
        document.cookie = `access_token=${response.data.output.access_token}`;
        document.cookie = `refresh_token=${response.data.output.refresh_token}`;
        // Redirect to trading page
    };

    return (
        <div>
            <h2>Login here</h2>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;
