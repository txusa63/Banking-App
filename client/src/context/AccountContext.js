import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';

export const AccountContext = createContext();

export const AccountContextProvider = (props) => {
    const {user} = useContext(UserContext);
    const [accounts, setAccounts] = useState([]);

    const getAccounts = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            }
        }
        const response = await fetch(`/accounts/all/${user.id}`, requestOptions);
        if(!response.ok) {
            console.log('Something went wrong here...')
        }
        else {
            const data = await response.json();
            console.log('data = ', data)
            setAccounts(data)
        }
    }

    useEffect(() => {
        console.log('user', user)
        getAccounts();
    }, [user])
    return (
        <AccountContext.Provider value={{accounts, setAccounts, getAccounts}}>
            {props.children}
        </AccountContext.Provider>
    )
}

