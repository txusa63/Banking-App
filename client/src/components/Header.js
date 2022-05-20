import React, { useContext, useState } from 'react'
import { UserContext } from '../context/UserContext';
import {Collapse, Nav, Navbar, NavbarBrand, NavbarText, NavbarToggler, NavItem, NavLink} from 'reactstrap';
import {NavLink as RRNavLink, useNavigate} from 'react-router-dom';

const themeStyle = {
    backgroundColor: 'gray'
}

const activeStyle = {
    color: 'white'
}

const inActiveStyle = {
    color: 'black'
}

export default function Header() {
    const {user, setUser} = useContext(UserContext);
    const [theme, setTheme] = useState('light');
    const navigate = useNavigate();

    const logout = () => {
        setUser({...user, token: null});
        navigate('/')
    }

    const changeTheme = () => {
        if(theme === 'light') {
            setTheme('dark');
        }
        if(theme === 'dark') {
            setTheme('light');
        }
    }

    return (
        <div>
            <Navbar style={{backgroundColor: 'rgb(37, 114, 202)', color: 'black'}} expand='sm' fixed='top' >
                <NavbarBrand className={'navb'} href='/'><img src='/chase-icon.png' alt='Chase Icon' height='25%' width='25%' /> {' '}Chase Bank </NavbarBrand>
                <NavbarToggler onClick={function noRefClick(){}} />
                <Collapse navbar>
                    <Nav className='me-auto' navbar>
                        {
                            (user.token && user.isUserAdmin !== null) && (
                                user.isUserAdmin ? (
                                    <>
                                        <NavItem>
                                            <NavLink tag={RRNavLink} to='/bankCustomers' style={({isActive}) => isActive ? activeStyle : inActiveStyle}  >Bank Customers</NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink tag={RRNavLink} to='/editAccount' style={({isActive}) => isActive ? activeStyle : inActiveStyle}  >Edit Account</NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink tag={RRNavLink} to='/deleteAccount' style={({isActive}) => isActive ? activeStyle : inActiveStyle}  >Delete Account</NavLink>
                                        </NavItem>
                                    </>
                                ) : (
                                    <>
                                        <NavItem>
                                            <NavLink tag={RRNavLink} to='/' style={({isActive}) => isActive ? activeStyle : inActiveStyle}  >Home</NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink tag={RRNavLink} to='/accounts' style={({isActive}) => isActive ? activeStyle : inActiveStyle}  >Accounts</NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink tag={RRNavLink} to='/transfer' style={({isActive}) => isActive ? activeStyle : inActiveStyle}  >Transfer</NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink tag={RRNavLink} to='/payment' style={({isActive}) => isActive ? activeStyle : inActiveStyle}  >Chase Pay with Zelle&#174; </NavLink>
                                        </NavItem>
                                    </>
                                )
                            )
                        }
                    </Nav>
                    <NavbarText>
                       <h5>Welcome {user.username}</h5>
                    </NavbarText>
                    <button className='logout-btn' onClick={logout}>Logout</button>
                </Collapse>
            </Navbar>
        </div>
    )
}
