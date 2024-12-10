import React, { useState } from 'react';
import axios from 'axios';

const Deposit = () => {
    const [amount, setAmount] = useState('');

    const handleDeposit = async () => {
        const currency = localStorage.getItem('currency');
        const championTokenRow = document.cookie.split('; ').find(row => row.startsWith('champion_token'));
        const championToken = championTokenRow && championTokenRow.split('=')[1];
        await axios.post('https://fs191x.buildship.run/dtrader-next/deposit', {
            amount,
            currency
        }, {
            headers: { 'Authorization': championToken }
        });
        // Handle success or error
    };

    return (
        <div>
            <h2>Deposit</h2>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
            <button onClick={handleDeposit}>Deposit</button>
        </div>
    );
};

export default Deposit;
