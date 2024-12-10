import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Sell = () => {
    const [buyId, setBuyId] = useState('');
    const [price, setPrice] = useState('');

    const fetchOpenPositions = async () => {
        const appId = localStorage.getItem('app_id');
        const accessTokenRow = document.cookie.split('; ').find(row => row.startsWith('access_token'));
        const accessToken = accessTokenRow && accessTokenRow.split('=')[1];
        const response = await axios.get(`https://fs191x.buildship.run/dtrader-next/open_positions?app_id=${appId}`, {
            headers: { 'Authorization': accessToken }
        });
        return response.data;
    };

    useEffect(() => {
        fetchOpenPositions().then(data => {
            if (data.length > 0) {
                setBuyId(data[0].buy_id);
            }
        });
    }, []);

    const handleSell = async () => {
        const appId = localStorage.getItem('app_id');
        const accessTokenRow = document.cookie.split('; ').find(row => row.startsWith('access_token'));
        const accessToken = accessTokenRow && accessTokenRow.split('=')[1];
        await axios.post('https://fs191x.buildship.run/dtrader-next/sell', {
            buy_id: buyId,
            price,
            app_id: appId
        }, {
            headers: { 'Authorization': accessToken }
        });
        // Handle success or error
    };

    return (
        <div>
            <h2>Sell</h2>
            <input type="text" value={buyId} onChange={(e) => setBuyId(e.target.value)} placeholder="Buy ID" />
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
            <button onClick={handleSell} style={{ backgroundColor: 'red' }}>Sell</button>
        </div>
    );
};

export default Sell;
