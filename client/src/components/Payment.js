import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AccountContext } from '../context/AccountContext';
import { UserContext } from '../context/UserContext';

export default function Payment() {
    const {user, setUser, loggedIn} = useContext(UserContext);
    // const {user, getUser} = useContext(UserContext);
    const {accounts} = useContext(AccountContext);
    const [list1, setList1] = useState(accounts);
    const [firstAccount, setFirstAccount] = useState('');
    const [selected1, setSelected1] = useState('');
    const [amount, setAmount] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');
    const [recipientFound, setRecipientFound] = useState(null); 
    const [recipientData, setRecipientData] = useState([]);
    const navigate = useNavigate();
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);


    const checkIfRecipientHasZelle = async () => {
        const recipientEmailRes = await fetch(`/users/email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: recipientEmail})
        });
        console.log('recipientEmailRes', recipientEmailRes)
        // if(!recipientEmailRes.ok) {
        //     setRecipientFound(false);
        // }
        // else {
        //     const data = await recipientEmailRes.json();
        //     console.log('data', data)
        //     setRecipientFound(true);
        //     setRecipientData(data);
        // }
        const data = await recipientEmailRes.json();
        console.log('data', data)
        if('msg' in data) {
            setRecipientFound(false);
        }
        else {
            setRecipientFound(true);
            setRecipientData(data);
        }
    };

    const checkIfRecipientHasAccount = async () => {
        // if(recipientFound) {
        //     const accountExistsResponse = await fetch(`/accounts/recipient/${recipientData.id}`, {
        //         method: 'GET',
        //         headers: {'Content-Type': 'application/json'},
        //     });
        //    if(!accountExistsResponse.ok) {
        //        setRecipientAccountExists(false)
        //    }
        //    else {
        //        const data = await accountExistsResponse.json();
        //        setRecipientAccountExists(true)
        //    }
        //    console.log('recipientAccountExists', recipientAccountExists)
        // }
        
        // const accountExistsResponse = await fetch(`/accounts/recipient/${recipientData.id}`, {
        //     method: 'GET',
        //     headers: {'Content-Type': 'application/json'},
        // });

        // console.log('accountExistsResponse', accountExistsResponse)

        // if(!accountExistsResponse.ok) {
        //    setRecipientAccountExists(false)
        // }
        // else {
        //    const data = await accountExistsResponse.json();
        //    setRecipientAccountExists(true)
        // }
        // console.log('recipientAccountExists', recipientAccountExists)
    }

    const mapAccounts = (list) => {
        return list.map((account) => {
            return (
                <option 
                    key={account.id} 
                    value={`${account.id}`}
                >
                    {account.account_number} - {account.account_type}
                </option>
            )
        })
    };

    const handleInputChange = (x) => {
        if(!isNaN(x)) {
            setAmount(x);
        }
    };

    const processSenderPayment = async () => {
        console.log('sender to recipient');
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + user.token
            },
        };
        const userAccount = await fetch(`/accounts/${firstAccount}`, requestOptions);
        const userAccountData = await userAccount.json();

        console.log('userAccountData = ', userAccountData);

        userAccountData.balance = userAccountData.balance - Number(amount);

        console.log('userAccountData after reduction = ', userAccountData);

        const bodyObj = {account_id: userAccountData.id, method: 'PAYMENT', payload: Number('-' + Number(amount)), previous_balance: userAccountData.balance}
        console.log(bodyObj)

        const userTransaction = await fetch(`/transactions/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + user.token
            },
            body: JSON.stringify(bodyObj)
        });

        const userTransfer = await fetch(`/accounts/transfer/${userAccountData.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + user.token
            },
            body: JSON.stringify({account_type: userAccountData.account_type, balance: userAccountData.balance})
        })
    };

    const processRecipientPayment = async () => {
        console.log('recipient receiving');

        const recipientAccount = await fetch(`/accounts/recipient/${recipientData.id}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
        const recipientAccountData = await recipientAccount.json();

        recipientAccountData.balance = recipientAccountData.balance + Number(amount);

        const recipientTransaction = await fetch(`/transactions/${recipientAccountData.owner_id}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({account_id: recipientAccountData.id, method: 'PAYMENT', payload: Number(amount), previous_balance: recipientAccountData.balance})
        });

        const recipientTransfer = await fetch(`/accounts/transfer/recipient/${recipientAccountData.id}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({account_type: recipientAccountData.account_type, balance: recipientAccountData.balance})
        })

    };

    const submit = async (e) => {
        e.preventDefault();

        
        processSenderPayment();
        processRecipientPayment();
        navigate('/');
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
        <div className='payment'>
            Payment
            <form onSubmit={submit}>
                <h3>Chase Pay with Zelle&#174; </h3>
                <p>The recipient must be registered with Zelle to receive funds</p>
                <label>
                    Email: {' '}
                    <input 
                        type='email'
                        value={recipientEmail}
                        onChange={e => setRecipientEmail(e.target.value)}
                    />
                </label>
                {recipientFound === true && '✅'}
                {recipientFound === false && '⛔️'}
                {/* {recipientAccountExists === false && 'No Account Exists For This User'} */}
                <button type='button' onClick={checkIfRecipientHasZelle}>Search</button>
                {(recipientEmail !== '' && recipientEmail.includes('@gmail.com') && recipientFound) && (
                    <label>
                        Select Account {' '}
                        <select
                            name='firstAccount'
                            value={firstAccount}
                            onChange={e => {setFirstAccount(e.target.value); setSelected1(e.target.value)}}
                        >
                            <option key={0}> ------ </option>
                            {mapAccounts(list1)}
                        </select>
                    </label>
                )}
                {(firstAccount !== '' && firstAccount !== '------') && (
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
