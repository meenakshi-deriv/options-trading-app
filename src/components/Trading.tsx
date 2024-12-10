import React from 'react';
import { Link } from 'react-router';

const Trading = () => {
    return (
        <div>
            <h2>Trading Page</h2>
            <Link to="/buy"><button style={{ backgroundColor: 'green' }}>Buy</button></Link>
            <Link to="/sell"><button style={{ backgroundColor: 'red' }}>Sell</button></Link>
            <Link to="/account">Account</Link>
        </div>
    );
};

export default Trading;
