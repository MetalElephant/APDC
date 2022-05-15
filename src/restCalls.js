//fetch api to make calls to rest backend

class restCalls {


    //depois alterar url
    login (username, password) {
        return fetch ("https://totemic-courage-344200.appspot.com/rest/users/login", {   
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
    

    register (username, password, pwdConfirmation, email, visibility, name, homePhone, mobilePhone, address, nif) {
        return fetch ("https://totemic-courage-344200.appspot.com/rest/users/register/", {
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
                visibility: visibility,
                homePhone: homePhone,
                mobilePhone: mobilePhone,
                address: address,
                nif: nif
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
        return fetch ("https://totemic-courage-344200.appspot.com/rest/parcel/register", {
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

    modifyParcel (parcelName, description, groundType, currUsage, prevUsage) {
        return fetch ("https://totemic-courage-344200.appspot.com/rest/parcel/update", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                owner: JSON.parse(localStorage.getItem('token')).username,
                parcelName: parcelName,
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

    modifyPassword (oldPassword, newPassword, pwdConfirmation) {
        return fetch ("https://totemic-courage-344200.appspot.com/rest/users/updatePwd", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: JSON.parse(localStorage.getItem('token')).username,
                oldPwd: oldPassword,
                newPwd: newPassword,
                pwdConfirmation: pwdConfirmation
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

    modifyUserAttributes (name, email, visibility, address, homePhone, mobilePhone, nif) {
        return fetch ("https://totemic-courage-344200.appspot.com/rest/users/update", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: JSON.parse(localStorage.getItem('token')).username,
                usernameToUpdate: JSON.parse(localStorage.getItem('token')).username,
                name: name,
                email: email,
                visibility: visibility,
                address: address,
                homePhone: homePhone,
                mobilePhone: mobilePhone,
                nif: nif
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
        return fetch ("https://totemic-courage-344200.appspot.com/rest/users/info", {
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
        return fetch ("https://totemic-courage-344200.appspot.com/rest/parcel/list", {
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
        return fetch ("https://totemic-courage-344200.appspot.com/rest/users/logout", {
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

