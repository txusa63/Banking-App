import React, { useContext, useEffect } from 'react';
import {BrowserRouter, Route, Routes, useNavigate} from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Header from './components/Header';
import { UserContext } from './context/UserContext';
import DeleteAccount from './components/DeleteAccount';
import EditAccount from './components/EditAccount';
import Accounts from './components/Accounts';
import Transfer from './components/Transfer';
import Payment from './components/Payment';
import NewBankAccount from './components/NewBankAccount';
import BankCustomers from './components/BankCustomers';
import Transactions from './components/Transactions';
import ZelleRegistration from './components/ZelleRegistration';

export default function Router() {
    const {user} = useContext(UserContext);

    return (
        <BrowserRouter>
            {user.token && <Header />}
            <Routes>
                <Route exact path='/' element={<Home />} />
                {
                    (user.token && user.isUserAdmin) && (
                        <>
                            <Route className={'Route'} path='/bankCustomers' element={<BankCustomers />} />
                            <Route path='/editAccount' element={<EditAccount /> } />
                            <Route path='/deleteAccount' element={<DeleteAccount /> } />
                        </>
                    )
                }
                {
                    (user.token && !user.isUserAdmin) && (
                        <>
                            <Route path='/accounts' element={<Accounts />} />
                            <Route path='/transfer' element={<Transfer />} />
                            <Route path='/payment' element={<Payment />} />
                            <Route path='/transactions' element={<Transactions />} />
                            <Route path='/newBankAccount' element={<NewBankAccount />} />
                        </>
                    )
                }
            </Routes>
        </BrowserRouter>
    )
}
