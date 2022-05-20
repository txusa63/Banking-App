import React from 'react'

export default function BankCustomersList({bankCustomers}) {
    const renderBankCustomers = () => {
        return bankCustomers.map((bankCustomer) => {
            return (
                <div key={bankCustomer.id}>
                    {bankCustomer.username}
                </div>
            )
        })
    }
    return (
        <div>
            {renderBankCustomers()}
        </div>
    )
}
