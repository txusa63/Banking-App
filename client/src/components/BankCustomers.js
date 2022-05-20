import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/UserContext';
import BankCustomersList from './BankCustomersList';

export default function BankCustomers() {
    const [bankCustomers, setBankCustomers] = useState([]);
    const {user} = useContext(UserContext);

    const getCustomers = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + user.token
            }
        }
        const response = await fetch('/users/client', requestOptions);
        const data = await response.json();
        setBankCustomers(data);
    }

    useEffect(() => {
        getCustomers()
    }, [])

    return (
        <div>
            !bankCustomers && <BankCustomersList bankCustomers={bankCustomers} />
        </div>
    )
}
