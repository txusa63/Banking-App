import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const styles = {
    // backgroundImage: `url('/chase.jpg')`,
    // backgroundRepeat: 'no-repeat', 
    // backgroundSize: 'cover', 
    // backgroundPosition: 'center center', 
    // height: '100%',
    // minHeight: '100%',
}

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const {user, setUser} = useContext(UserContext);

    const login = async (e) => {
        e.preventDefault();

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: JSON.stringify(`grant_type=&username=${username}&password=${password}&scope=&client_id=&client_secret=`)
        };

        const response = await fetch('/login', requestOptions);
        const data = await response.json();

        if(response.ok) {
            setUser({...user, token: data.access_token});
        }
        navigate('/')
    }

    return (
        <div className='login' style={styles}>
            <img src='/chase-logo-1.png' alt='Chase Bank Logo' height='25%' width='25%' />
            {/* <br /> */}
            <form onSubmit={login}>
                <div className='input-box'>
                    <p style={{textAlign: 'center'}}>Please Login</p>
                    <input 
                        type='text'
                        placeholder='Enter username'
                        className='login-input'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <input 
                        type='password'
                        placeholder='Enter password'
                        className='login-input'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button type='submit'>Log In</button>
                </div>
            </form>
        </div>
    )
}
