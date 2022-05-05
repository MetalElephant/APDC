//fetch api to make calls to rest backend

class restCalls {


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

    parcelRegister (owner, parcelName, parcelId, markers, description, groundType, currUsage, prevUsage, area) {
        return fetch ("https://upbeat-polygon-344116.appspot.com/rest/users/parcel", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                owner: owner,
                parcelName: parcelName,
                parcelId: parcelId,
                points: markers,
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

    modifyParcel (parcelId, parcelName, description, groundType, currUsage, prevUsage, area) {
        return fetch ("https://upbeat-polygon-344116.appspot.com/rest/users/modifyParcel", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                owner: localStorage.getItem('username'),
                parcelId: parcelId,
                parcelName: parcelName,
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

    logout() {
        return fetch ("https://upbeat-polygon-344116.appspot.com/rest/users/logout/", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: localStorage.getItem('username')
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

