import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AccountContext } from '../context/AccountContext';
import { UserContext } from '../context/UserContext'
import Transactions from './Transactions';

export default function Accounts() {
    const {user, setUser} = useContext(UserContext);
    const {accounts, getAccounts} = useContext(AccountContext);
    const navigate = useNavigate();

    let dollarsUS = Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'});
    console.log('accounts', accounts)

    const renderAccounts = () => {
        return accounts.map((account) => {
            return (
                <div 
                    key={account.id} 
                    className='accounts-list'
                    onClick={() => navigate('/transactions', {state:{account}})}
                >
                    {account.account_type} {' Account '} &nbsp; {' --- '} &nbsp;  ${account.balance}
                    {/* <Transactions  id={account.id} /> */}
                </div>
            )
        })
    }

    const isUserLoggedIn = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            }
        }

        const response = await fetch('/users/auth/isValid', requestOptions);
        if(!response.ok) {
            setUser({...user, token: null});
            navigate('/')
        }
    };

    useEffect(() => {
        isUserLoggedIn();
        getAccounts();
    }, [])

    return (
        <div className='accounts'>
            {/* <p>Welcome</p> */}
            <button onClick={() => navigate('/newBankAccount')}>Open an Account</button>
            {renderAccounts()}
        </div>
    )
}
