import React from 'react';
import { Link } from 'react-router';

const Account = () => {
    return (
        <div>
            <h2>Account Page</h2>
            <Link to="/account/deposit">Deposit</Link>
            <Link to="/account/withdraw">Withdraw</Link>
            <Link to="/account/statement">Account Statement</Link>
        </div>
    );
};

export default Account;
