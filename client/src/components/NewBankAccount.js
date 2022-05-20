import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AccountContext } from '../context/AccountContext';
import { UserContext } from '../context/UserContext';

export default function NewBankAccount() {
    const {user, setUser} = useContext(UserContext);
    const {accounts} = useContext(AccountContext);
    const [accountType, setAccountType] = useState('Checking');
    const [balance, setBalance] = useState(0.00);
    const navigate = useNavigate();

    console.log('accounts currently present for this user',accounts)

    const submit = async (e) => {
        e.preventDefault();

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + user.token
            },
            body: JSON.stringify({account_type: accountType, balance: balance})
        }

        const response = await fetch('/accounts/', requestOptions);
        setAccountType('Checking');
        navigate('/');
    }

    const accountMessage = () => {
        if(accountType === 'Checking') {
           return (
                <ul>
                    <li>Debit Card</li>
                    <li>Direct Deposit</li>
                    <li>Overdraft Fees</li>
                    <li>Monthly Service Fees</li>
                    <li>No Earned Interest</li>
                    <li>No Minimum Amount</li>
                </ul>
           )
        }
        if(accountType === 'Savings') {
            return (
                <ul>
                    <li>Earned Interest</li>
                    <li>Direct Deposit</li>
                    <li>Limit of Six Transactions per Month</li>
                    <li>No Monthly Service Fees</li>
                    <li>No Minimum Amount</li>
                    <li>Cover Overdraft for Checking Account</li>
                </ul>
            )
        }
        if(accountType === 'Student') {
            return (
                <ul>
                    <li>Debit Card</li>
                    <li>Direct Deposit</li>
                    <li>Overdraft Fees</li>
                    <li>No Monthly Service Fees</li>
                    <li>No Earned Interest</li>
                    <li>No Minimum Amount</li>
                </ul>
            )
        }
    };

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
    }

    useEffect(() => {
        isUserLoggedIn();
    }, []);

    useEffect(() => {
        if(accounts.length === 0) {
            let result = Number((Math.random()*10000).toFixed(2))
            console.log('result', result)
            setBalance(result);
        }
    }, []);

    return (
        <div className='my-app'>
            <h3>New Account</h3>
            <h4>What type of account do you want?</h4>
            <form onSubmit={submit}>
                <label>
                    Account Type: {' '}
                    <select 
                        name='accountType' 
                        value={accountType}
                        onChange={e => setAccountType(e.target.value)}
                    >
                        <option value='Checking'>Checking</option>
                        <option value='Savings'>Savings</option>
                        <option value='Student'>Student</option>
                    </select>
                </label>
                {accountMessage()}
                <button>Create Account</button>
            </form>
            <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
    )
}
