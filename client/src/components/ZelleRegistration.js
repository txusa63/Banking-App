import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AccountContext } from '../context/AccountContext';
import { UserContext } from '../context/UserContext';

export default function ZelleRegistration() {
    const [bankAccountExists, setBankAccountExists] = useState(null);
    const {user, getUser} = useContext(UserContext);
    const {accounts, getAccounts} = useContext(AccountContext);
    const navigate = useNavigate();
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    const register = async () => {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + user.token
            },
            body: JSON.stringify({zelle_registered: true})
        }
        const response = await fetch(`/users/zelle/registration/${user.id}`, requestOptions);
        const data = await response.json()
        console.log('data = ', data); 
        getUser()
        // forceUpdate()
    }

    useEffect(() => {
        console.log('useEffect in Zelle runs')
        getUser();
    }, [user.zelleRegistered])

    return (
        <div className='zelle'>
            <img src='/Zelle_logo.svg' alt='Zelle Logo' height='25%' width='25%'/>
            <h4>Sign Up for Chase Pay with Zelle&#174;  to Send Money to Other Chase Account Holders Now!</h4>
            <p>You Need to Have a Chase Bank Account to Sign Up for Chase Pay with Zelle&#174; </p>

            {(user.zelleRegistered === false && accounts.length !== 0) && <button onClick={register}>Register</button>}

            <h1>More to Come!</h1>
        </div>
    )
}
