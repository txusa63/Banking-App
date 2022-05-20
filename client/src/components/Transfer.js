import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { AccountContext } from '../context/AccountContext';
import { UserContext } from '../context/UserContext';

export default function Transfer() {
    const {user, setUser} = useContext(UserContext)
    const {accounts} = useContext(AccountContext);
    const [list1, setList1] = useState(accounts);
    const [list2, setList2] = useState(accounts);
    const [firstAccount, setFirstAccount] = useState('')
    const [secondAccount, setSecondAccount] = useState('');
    const [selected1, setSelected1] = useState('');
    const [selected2, setSelected2] = useState('');
    const [amount, setAmount] = useState('');
    const navigate = useNavigate();
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    let dollarsUS = Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'});

    const mapAccounts = (list, selected) => {
        return list.map((account) => {
            if(account.id !== parseInt(selected)) {
                return (
                    <option 
                        key={account.id} 
                        value={`${account.id}`}
                    >
                        {account.account_number} - {account.account_type} {dollarsUS.format(account.balance)}
                    </option>
                )
            }
        })
    };

    const handleInputChange = (x) => {
        if(!isNaN(x)) {
            setAmount(x);
        }
    };

    const submit = async (e) => {
        e.preventDefault();

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + user.token
            },
        };
        const firstResponse = await fetch(`/accounts/${firstAccount}`, requestOptions);
        const dataFirst = await firstResponse.json();

        const secondResponse = await fetch(`/accounts/${secondAccount}`, requestOptions);
        const dataSecond = await secondResponse.json();

        dataFirst.balance = dataFirst.balance - Number(amount);
        console.log('dataFirst = ', dataFirst)

        const transaction1Obj = {account_id: dataFirst.id, method: 'TRANSFER', payload: Number('-' + Number(amount)), previous_balance: dataFirst.balance}
        console.log(transaction1Obj);
        const transaction1 = await fetch(`/transactions/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + user.token
            },
            body: JSON.stringify(transaction1Obj)
        });

        dataSecond.balance = dataSecond.balance + Number(amount);
        const transaction2 = await fetch(`/transactions/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + user.token
            },
            body: JSON.stringify({account_id: dataSecond.id, method: 'TRANSFER', payload: Number(amount), previous_balance: dataSecond.balance})
        });

        const firstTransfer = await fetch(`/accounts/transfer/${dataFirst.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + user.token
            },
            body: JSON.stringify({account_type: dataFirst.account_type, balance: dataFirst.balance})
        });

        const secondTransfer = await fetch(`/accounts/transfer/${dataSecond.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + user.token
            },
            body: JSON.stringify({account_type: dataSecond.account_type, balance: dataSecond.balance})
        });
        // forceUpdate();
        navigate('/')
        // forceUpdate();
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

    return (
        <div className='transfer'>
            Transfer
            <form onSubmit={submit}>
                <h3>Start Transfer</h3>
                <label> From {' '}
                    <select
                        name='firstAccount'
                        value={firstAccount}
                        onChange={e => {setFirstAccount(e.target.value); setSelected1(e.target.value)}}
                    >
                        <option key={0}> ------ </option>
                        {mapAccounts(list1, selected2)}
                    </select>
                </label>
                <label> To {' '}
                    <select
                        name='secondAccount'
                        value={secondAccount}
                        onChange={e => {setSecondAccount(e.target.value); setSelected2(e.target.value)}}
                    >
                        <option key={0}> ------ </option>
                        {mapAccounts(list2, selected1)}
                    </select>
                </label>
                {(firstAccount !== '' && firstAccount !== '------' && secondAccount !== '' && secondAccount !== '------') && (
                    <div>
                        <input 
                            type='text'
                            placeholder='Enter Amount'
                            value={amount}
                            onChange={e => handleInputChange(e.target.value)}
                        />
                        <button>Submit</button>
                    </div>
                )}
            </form>
        </div>
    )
}
