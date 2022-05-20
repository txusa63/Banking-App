import React, { createContext, useEffect, useState } from 'react';

export const UserContext = createContext();

export const UserContextProvider = (props) => {
    const localStorageValue = localStorage.getItem('myAuthToken');
    const [user, setUser] = useState(
        {
            token: localStorageValue === 'null' ? JSON.parse(localStorageValue) : localStorageValue, 
            username: null,
            isUserAdmin: null, 
            zelleRegistered: null,
            remember: false, 
            id: null,
        }
    );
    const [loggedIn, setLoggedIn] = useState(undefined);

    const getUser = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            }
        }

        const response = await fetch('/users/auth/isValid', requestOptions);
        console.log('response = ', response)

        
        const data = await response.json();
        console.log('data = ', data)
       
        if(!response.ok) {
            setUser({...user, token: null});
        }

        localStorage.setItem('myAuthToken', user.token);
        setUser({...user, isUserAdmin: data.isAdmin, id: data.id, zelleRegistered: data.zelle_registered, username: data.username});

    };

    const isLoggedIn = async () => {
        console.log('isLoggedIn called');
        console.log('token', user.token)
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            }
        }

        const response = await fetch('/users/auth/isValid', requestOptions);
        if(!response.ok) {
            // setUser({...user, token: null});
            setLoggedIn(false)
            // return false
        }
        setLoggedIn(true);
        // return true
    }

    useEffect(() => {
        getUser();
    }, [user.token]);

    // useEffect(() => {
    //     checkLogStatus()
    // },[])

    return(
        <UserContext.Provider value={{user, setUser, loggedIn, getUser}}>
            {props.children}
        </UserContext.Provider>
    )
}