async function fetchF(token, id) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }
    const response = await fetch(`/accounts/${id}`, requestOptions);
    if(!response.ok) {
        console.log('Something went wrong here...')
        return null;
    }
    else {
        const data = await response.json();
        console.log('data = ', data)
        // setUser({...user, accounts: data})
        return data;
    }
};

export default fetchF;