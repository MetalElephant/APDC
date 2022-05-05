//fetch api to make calls to rest backend

class restCalls {

    constructor(){}


    //depois alterar url
    login (username, password) {
        return fetch ("https://upbeat-polygon-344116.appspot.com/rest/users/login", {   
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        }).then (function (response) {
            if (!response.ok) {
                return response.text().then((text) => {
                    const error = new Error(text)
                    error.code = response.status;
                    throw error
                })
            }
            return response.text()
        }).then(function (text) {
            localStorage.setItem('token', text);
            localStorage.setItem('username', username);
            return text;
        }) 
    }
    

    register (username, password, email, name) {
        return fetch ("https://upbeat-polygon-344116.appspot.com/rest/users/register/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
                pwdConfirmation: password,
                email: email,
                name: name
            })
        }).then (function (response) {
            if (!response.ok) {
                return response.text().then((text) => {
                    const error = new Error(text)
                    error.code = response.status;
                    throw error
                })
            }
            return response.text()
        }).then(function (text) {
            return text;
        }) 
    }

<<<<<<< HEAD
    
    
    modifyParcel (owner, parcelName, parcelId, description, groundType, currUsage, prevUsage, area) {
        return fetch ("https://upbeat-polygon-344116.appspot.com/rest/users/modifyParcel", {
=======
    parcelRegister (owner, parcelName, parcelId, markers, description, groundType, currUsage, prevUsage, area) {
        return fetch ("https://upbeat-polygon-344116.appspot.com/rest/users/parcel", {
>>>>>>> 4965080655cdac775cb55964b32fa438c02846a4
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                owner: localStorage.getItem('username'),
                parcelName: parcelName,
                parcelId: parcelId,
                points:markers,
                description: description,
                groundType: groundType,
                currUsage: currUsage,
                prevUsage: prevUsage,
                area: area
            })
        }).then (function (response) {
            if (!response.ok) {
                return response.text().then((text) => {
                    const error = new Error(text)
                    error.code = response.status;
                    throw error
                })
            }
            return response.text()
        }).then(function (text) {
            return text;
        }) 
    }

}

const restCallsExport = new restCalls();
export default restCallsExport;

