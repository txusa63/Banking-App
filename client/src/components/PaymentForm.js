import React, {useState} from 'react'

export default function PaymentForm() {
    const [recipientEmail, setRecipientEmail] = useState('');
    return (
        <div className='my-app'>
            <h3>Hello</h3>
            <form>
                <h3>Add Payment Info</h3>
                <label>
                    Email: {' '}
                    <input 
                        type='email'
                        value={recipientEmail}
                        onChange={e => setRecipientEmail(e.target.value)}
                    />
                </label>
                <button>Submit</button>
            </form>
        </div>
    )
}
