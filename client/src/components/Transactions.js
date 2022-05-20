import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const {user, setUser} = useContext(UserContext);
    const {state} = useLocation();
    const navigate = useNavigate();

    let dollarsUS = Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'});

    const getTransactions = async () => {
        const transactionsRes = await fetch(`/transactions/${state.account.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log(transactionsRes)

        const data = await transactionsRes.json();
        console.log(data)
        setTransactions(data);
    };

    const renderTransactions = () => {
        return transactions.map(transaction => {
            return (
                <React.Fragment key={transaction.id}>
                    <tr>
                        <td>{dollarsUS.format(transaction.payload)}</td>
                        <td>{transaction.method}</td>
                        <td>{dollarsUS.format(transaction.previous_balance)}</td>
                    </tr>
                </React.Fragment>
            )
        })
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
        getTransactions()
    }, [])

    return (
        <div className='transactions'>
            <table>
                <caption>Transaction History</caption>
                <tbody>
                    <tr>
                        <th width='3%'>Amount</th>
                        <th width='3%'>Type of Transaction</th>
                        <th width='3%'>Remaining Balance</th> 
                    </tr>
                    {renderTransactions()}
                </tbody>
            </table>
            <button onClick={() => navigate(-1)}>Go Back</button> {' '}
        </div>
    )
}
