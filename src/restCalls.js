//fetch api to make calls to rest backend

class restCalls {


    //depois alterar url
    login (username, password) {
        return fetch ("https://land-it.appspot.com/rest/users/login", {   
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
            return text;
        }) 
    }
    

    register (username, password, pwdConfirmation, email, name) {
        return fetch ("https://land-it.appspot.com/rest/users/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
                pwdConfirmation: pwdConfirmation,
                email: email,
                name: name,
                visibility: "default"
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

    parcelRegister (parcelName, parcelRegion, description, groundType, currUsage, prevUsage, area, allLats, allLngs) {
        return fetch ("https://land-it.appspot.com/rest/parcel/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                owner: JSON.parse(localStorage.getItem('token')).username,
                parcelName: parcelName,
                parcelRegion: parcelRegion,
                description: description,
                groundType: groundType,
                currUsage: currUsage,
                prevUsage: prevUsage,
                area: area,
                allLats: allLats,
                allLngs: allLngs
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

    modifyParcel (parcelId, parcelName, description, groundType, currUsage, prevUsage) {
        return fetch ("https://land-it.appspot.com/rest/parcel/updateParcel", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                owner: JSON.parse(localStorage.getItem('token')).username,
                parcelName: parcelName,
                parcelRegion: parcelId,
                description: description,
                groundType: groundType,
                currUsage: currUsage,
                prevUsage: prevUsage
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

    userInfo() {
        return fetch ("https://land-it.appspot.com/rest/users/showUserData", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: JSON.parse(localStorage.getItem('token')).username
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
            localStorage.setItem('user', text);
            return text;
        })
    }

    parcelInfo() {
        return fetch ("https://land-it.appspot.com/rest/parcel/list", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: JSON.parse(localStorage.getItem('token')).username
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
            localStorage.setItem('parcels', text);
            return text;
        })
    }



    logout() {
        return fetch ("https://land-it.appspot.com/rest/users/logout", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: JSON.parse(localStorage.getItem('token')).username
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
            localStorage.removeItem('user')
            localStorage.removeItem('token')   
            localStorage.removeItem('parcels')      
            return text;
        }) 
    }

}

const restCallsExport = new restCalls();
export default restCallsExport;

