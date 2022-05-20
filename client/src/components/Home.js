import React, { useContext, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
// import { AccountContext } from '../context/AccountContext';
import { UserContext } from '../context/UserContext'
import Login from './Login';
import ZelleRegistration from './ZelleRegistration';

export default function Home() {
    const {user, setUser, loggedIn} = useContext(UserContext);
    // const {user, getUser} = useContext(UserContext);
    // const {accounts} = useContext(AccountContext);
    const navigate = useNavigate();
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    console.log('Home')

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
        }
    }

    useEffect(() => {
        isUserLoggedIn();
        navigate('/')
    }, []);

    // useEffect(() => {
    //     forceUpdate();
    // }, [user.zelleRegistered])

    return (
        <div className=''>
            {
                !user.token ? <Login /> : (
                    <>
                        {user.zelleRegistered === false ? <ZelleRegistration  /> : (
                            <div className='home'>
                                <h2>Welcome!</h2>
                                <img src='/chase-logo.png' height='25%' width='25%' />
                            </div>
                        )} 
                       
                    </>
                )
            }
        </div>
    )
}
