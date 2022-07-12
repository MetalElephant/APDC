//fetch api to make calls to rest backend

class restCalls {

    //depois alterar url https://land--it.appspot.com/rest/users/login
    login(username, password) {
        return fetch("https://landit-app.appspot.com/rest/user/login", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        }).then(function (response) {
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

    register(username, password, pwdConfirmation, email, name, homePhone, mobilePhone, nif, photo, role, district, county, autarchy, street, code) {
        return fetch("https://landit-app.appspot.com/rest/user/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',

            },
            body: JSON.stringify({
                username: username,
                password: password,
                pwdConfirmation: pwdConfirmation,
                email: email,
                name: name,
                homePhone: homePhone,
                mobilePhone: mobilePhone,
                street: street,
                nif: nif,
                photo: photo,
                role: role,
                district: district,
                county: county,
                autarchy: autarchy,
                code: code
            })
        }).then(function (response) {
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

    registerUserSU(username, email, name, isRep, district, county, autarchy) {
        return fetch("https://landit-app.appspot.com/rest/admin/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                usernameReg: JSON.parse(localStorage.getItem('token')).username,
                username: username,
                email: email,
                name: name,
                isRep: isRep,
                district: district,
                county: county,
                autarchy: autarchy
            })
        }).then(function (response) {
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

    parcelRegister(parcelName, owners, district, county, freguesia, description, groundType, currUsage, prevUsage, allLats, allLngs, photo, type) {
        //var splitOwners = owners.split(",");
        return fetch("https://landit-app.appspot.com/rest/parcel/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                owner: JSON.parse(localStorage.getItem('token')).username,
                owners: owners,
                parcelName: parcelName,
                county: county,
                district: district,
                autarchy: freguesia,
                description: description,
                groundType: groundType,
                currUsage: currUsage,
                prevUsage: prevUsage,
                allLats: allLats,
                allLngs: allLngs,
                confirmation: photo,
                type: type //2 for png or jpeg, 1 for pdf
            })
        }).then(function (response) {
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

    modifyParcel(owner, owners, parcelName, description, groundType, currUsage, prevUsage, allLats, allLngs) {
        return fetch("https://landit-app.appspot.com/rest/parcel/update", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: JSON.parse(localStorage.getItem('token')).username,
                owner: owner,
                owners: owners,
                parcelName: parcelName,
                description: description,
                groundType: groundType,
                currUsage: currUsage,
                prevUsage: prevUsage,
                allLats: allLats,
                allLngs: allLngs
            })
        }).then(function (response) {
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

    deleteParcel(objectName, owner) {
        return fetch("https://landit-app.appspot.com/rest/parcel/remove", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: JSON.parse(localStorage.getItem('token')).username,
                objectName: objectName,
                owner: owner
            })
        }).then(function (response) {
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

    deleteUser(usernameToRemove) {
        return fetch("https://landit-app.appspot.com/rest/user/remove", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: JSON.parse(localStorage.getItem('token')).username,
                name: usernameToRemove
            })
        }).then(function (response) {
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

    deleteReward(objectName, owner) {
        return fetch("https://landit-app.appspot.com/rest/reward/remove", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: JSON.parse(localStorage.getItem('token')).username,
                owner: owner,
                objectName: objectName
            })
        }).then(function (response) {
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

    modifyPassword(oldPassword, newPassword, pwdConfirmation) {
        return fetch("https://landit-app.appspot.com/rest/user/updatePwd", {
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
        }).then(function (response) {
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

    modifyUserAttributes(usernameToUpdate, name, email, street, homePhone, mobilePhone, nif, photo, district, county, autarchy) {
        return fetch("https://landit-app.appspot.com/rest/user/update", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: JSON.parse(localStorage.getItem('token')).username,
                usernameToUpdate: usernameToUpdate,
                name: name,
                email: email,
                street: street,
                district: district,
                county: county,
                autarchy: autarchy,
                homePhone: homePhone,
                mobilePhone: mobilePhone,
                nif: nif,
                photo: photo
            })
        }).then(function (response) {
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
        return fetch("https://landit-app.appspot.com/rest/user/info", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: JSON.parse(localStorage.getItem('token')).username
            })
        }).then(function (response) {
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
        return fetch("https://landit-app.appspot.com/rest/parcel/listUser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: JSON.parse(localStorage.getItem('token')).username
            })
        }).then(function (response) {
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

    getParcelsByPosition(latMax, latMin, longMax, longMin) {
        return fetch("https://landit-app.appspot.com/rest/parcel/searchByPosition", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: JSON.parse(localStorage.getItem('token')).username,
                latMax: latMax,
                latMin: latMin,
                longMax: longMax,
                longMin: longMin
            })
        }).then(function (response) {
            if (!response.ok) {
                return response.text().then((text) => {
                    const error = new Error(text)
                    error.code = response.status;
                    throw error
                })
            }
            return response.text()
        }).then(function (text) {
            localStorage.setItem('parcelsSearch', text);
            return text;
        })
    }

    getParcelsByRegion(region, type) {
        return fetch("https://landit-app.appspot.com/rest/parcel/searchByRegion", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: JSON.parse(localStorage.getItem('token')).username,
                region: region,
                type: type  //type: 1 county, 2 district, 3 freg
            })
        }).then(function (response) {
            if (!response.ok) {
                return response.text().then((text) => {
                    const error = new Error(text)
                    error.code = response.status;
                    throw error
                })
            }
            return response.text()
        }).then(function (text) {
            localStorage.setItem('parcelsSearch', text);
            return text;
        })
    }

    getParcelsRep() {
        return fetch("https://landit-app.appspot.com/rest/parcel/listRep", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: JSON.parse(localStorage.getItem('token')).username
            })
        }).then(function (response) {
            if (!response.ok) {
                return response.text().then((text) => {
                    const error = new Error(text)
                    error.code = response.status;
                    throw error
                })
            }
            return response.text()
        }).then(function (text) {
            localStorage.setItem('parcelsRep', text);
            return text;
        })
    }

    listAllParcels() {
        return fetch("https://landit-app.appspot.com/rest/parcel/list", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(function (response) {
            if (!response.ok) {
                return response.text().then((text) => {
                    const error = new Error(text)
                    error.code = response.status;
                    throw error
                })
            }
            return response.text()
        }).then(function (text) {
            localStorage.setItem('allParcels', text);
            return text;
        })
    }

    verifyParcel(owner, parcelName, confirmation, reason) {
        return fetch("https://landit-app.appspot.com/rest/parcel/verify", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: JSON.parse(localStorage.getItem('token')).username,
                owner: owner,
                parcelName: parcelName,
                confirmation: confirmation,
                reason: reason
            })
        }).then(function (response) {
            if (!response.ok) {
                return response.text().then((text) => {
                    const error = new Error(text)
                    error.code = response.status;
                    throw error
                })
            }
            return response.text()
        }).then(function (text) {
            localStorage.setItem('allParcels', text);
            return text;
        })
    }

    listAllUsers() {
        return fetch("https://landit-app.appspot.com/rest/user/list", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(function (response) {
            if (!response.ok) {
                return response.text().then((text) => {
                    const error = new Error(text)
                    error.code = response.status;
                    throw error
                })
            }
            return response.text()
        }).then(function (text) {
            localStorage.setItem('allUsers', text);
            return text;
        })
    }

    listAllProps() {
        return fetch("https://landit-app.appspot.com/rest/user/showAllExceptSelf", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: JSON.parse(localStorage.getItem('token')).username
            })
        }).then(function (response) {
            if (!response.ok) {
                return response.text().then((text) => {
                    const error = new Error(text)
                    error.code = response.status;
                    throw error
                })
            }
            return response.text()
        }).then(function (text) {
            localStorage.setItem('allProps', text);
            return text;
        })
    }

    createForum(forumName, topic) {
        return fetch("https://landit-app.appspot.com/rest/forum/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: JSON.parse(localStorage.getItem('token')).username,
                forumName: forumName,
                topic: topic
            })
        }).then(function (response) {
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

    removeForum(owner, forumName) {
        return fetch("https://landit-app.appspot.com/rest/forum/removeForum", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: JSON.parse(localStorage.getItem('token')).username,
                owner: owner,
                name: forumName
            })
        }).then(function (response) {
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

    removeMessage(owner, forumName, msg, msgOwner) {
        return fetch("https://landit-app.appspot.com/rest/forum/removeMessage", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: JSON.parse(localStorage.getItem('token')).username,
                forumOwner: owner,
                forumName: forumName,
                msg: msg,
                msgOwner: msgOwner,
            })
        }).then(function (response) {
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

    listAllForums() {
        return fetch("https://landit-app.appspot.com/rest/forum/list", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(function (response) {
            if (!response.ok) {
                return response.text().then((text) => {
                    const error = new Error(text)
                    error.code = response.status;
                    throw error
                })
            }
            return response.text()
        }).then(function (text) {
            localStorage.setItem('forumsAll', text);
            return text;
        })
    }

    listUserForums() {
        return fetch("https://landit-app.appspot.com/rest/forum/listUser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: JSON.parse(localStorage.getItem('token')).username
            })
        }).then(function (response) {
            if (!response.ok) {
                return response.text().then((text) => {
                    const error = new Error(text)
                    error.code = response.status;
                    throw error
                })
            }
            return response.text()
        }).then(function (text) {
            localStorage.setItem('forumsUser', text);
            return text;
        })
    }

    listParcelForums() {
        return fetch("https://landit-app.appspot.com/rest/forum/listParcel", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: JSON.parse(localStorage.getItem('token')).username
            })
        }).then(function (response) {
            if (!response.ok) {
                return response.text().then((text) => {
                    const error = new Error(text)
                    error.code = response.status;
                    throw error
                })
            }
            return response.text()
        }).then(function (text) {
            localStorage.setItem('forumsParcel', text);
            return text;
        })
    }

    postMessage(message) {
        return fetch("https://landit-app.appspot.com/rest/forum/message", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: JSON.parse(localStorage.getItem('token')).username,
                owner: JSON.parse(localStorage.getItem('forum')).owner,
                forum: JSON.parse(localStorage.getItem('forum')).name,
                message: message
            })
        }).then(function (response) {
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

    listForumMessages() {
        return fetch("https://landit-app.appspot.com/rest/forum/listMessages", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: JSON.parse(localStorage.getItem('forum')).owner,
                name: JSON.parse(localStorage.getItem('forum')).name
            })
        }).then(function (response) {
            if (!response.ok) {
                return response.text().then((text) => {
                    const error = new Error(text)
                    error.code = response.status;
                    throw error
                })
            }
            return response.text()
        }).then(function (text) {
            localStorage.setItem("messages", text)
            return text;
        })
    }

    ownerInfo(name) {
        return fetch("https://landit-app.appspot.com/rest/parcel/ownerInfo", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: JSON.parse(localStorage.getItem('token')).username,
                name: name
            })
        }).then(function (response) {
            if (!response.ok) {
                return response.text().then((text) => {
                    const error = new Error(text)
                    error.code = response.status;
                    throw error
                })
            }
            return response.text()
        }).then(function (text) {
            localStorage.setItem("owner", text)
            return text;
        })
    }

    createSuperUser() {
        return fetch("https://landit-app.appspot.com/rest/startup/superuser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(function (response) {
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

    numberOfUsersStatistics() {
        return fetch("https://landit-app.appspot.com/rest/stats/users", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(function (response) {
            if (!response.ok) {
                return response.text().then((text) => {
                    const error = new Error(text)
                    error.code = response.status;
                    throw error
                })
            }
            return response.text()
        }).then(function (text) {
            localStorage.setItem('numberOfUsers', text)
            return text;
        })
    }

    numberOfParcelsStatistics() {
        return fetch("https://landit-app.appspot.com/rest/stats/parcels", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(function (response) {
            if (!response.ok) {
                return response.text().then((text) => {
                    const error = new Error(text)
                    error.code = response.status;
                    throw error
                })
            }
            return response.text()
        }).then(function (text) {
            localStorage.setItem('numberOfParcels', text)
            return text;
        })
    }

    numberOfForumsStatistics() {
        return fetch("https://landit-app.appspot.com/rest/stats/forums", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(function (response) {
            if (!response.ok) {
                return response.text().then((text) => {
                    const error = new Error(text)
                    error.code = response.status;
                    throw error
                })
            }
            return response.text()
        }).then(function (text) {
            localStorage.setItem('numberOfForums', text)
            return text;
        })
    }

    numberOfMessagesStatistics() {
        return fetch("https://landit-app.appspot.com/rest/stats/messages", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(function (response) {
            if (!response.ok) {
                return response.text().then((text) => {
                    const error = new Error(text)
                    error.code = response.status;
                    throw error
                })
            }
            return response.text()
        }).then(function (text) {
            localStorage.setItem('numberOfMessages', text)
            return text;
        })
    }

    averageParcelStatistics() {
        return fetch("https://landit-app.appspot.com/rest/stats/averageParcels", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(function (response) {
            if (!response.ok) {
                return response.text().then((text) => {
                    const error = new Error(text)
                    error.code = response.status;
                    throw error
                })
            }
            return response.text()
        }).then(function (text) {
            localStorage.setItem('averageParcels', text)
            return text;
        })
    }

    averageForumStatistics() {
        return fetch("https://landit-app.appspot.com/rest/stats/averageForums", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(function (response) {
            if (!response.ok) {
                return response.text().then((text) => {
                    const error = new Error(text)
                    error.code = response.status;
                    throw error
                })
            }
            return response.text()
        }).then(function (text) {
            localStorage.setItem('averageForums', text)
            return text;
        })
    }

    averageMessageStatistics() {
        return fetch("https://landit-app.appspot.com/rest/stats/averageMessages", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(function (response) {
            if (!response.ok) {
                return response.text().then((text) => {
                    const error = new Error(text)
                    error.code = response.status;
                    throw error
                })
            }
            return response.text()
        }).then(function (text) {
            localStorage.setItem('averageMessages', text)
            return text;
        })
    }

    userMostParcelsStatistics() {
        return fetch("https://landit-app.appspot.com/rest/stats/userMostParcels", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(function (response) {
            if (!response.ok) {
                return response.text().then((text) => {
                    const error = new Error(text)
                    error.code = response.status;
                    throw error
                })
            }
            return response.text()
        }).then(function (text) {
            localStorage.setItem('userMostParcels', text)
            return text;
        })
    }

    userMostForumsStatistics() {
        return fetch("https://landit-app.appspot.com/rest/stats/userMostForums", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(function (response) {
            if (!response.ok) {
                return response.text().then((text) => {
                    const error = new Error(text)
                    error.code = response.status;
                    throw error
                })
            }
            return response.text()
        }).then(function (text) {
            localStorage.setItem('userMostForums', text)
            return text;
        })
    }

    userMostMessagesStatistics() {
        return fetch("https://landit-app.appspot.com/rest/stats/userMostMessages", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(function (response) {
            if (!response.ok) {
                return response.text().then((text) => {
                    const error = new Error(text)
                    error.code = response.status;
                    throw error
                })
            }
            return response.text()
        }).then(function (text) {
            localStorage.setItem('userMostMessages', text)
            return text;
        })
    }

    listComRewards() {
        return fetch("https://landit-app.appspot.com/rest/reward/list", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: JSON.parse(localStorage.getItem('token')).username
            })
        }).then(function (response) {
            if (!response.ok) {
                return response.text().then((text) => {
                    const error = new Error(text)
                    error.code = response.status;
                    throw error
                })
            }
            return response.text()
        }).then(function (text) {
            localStorage.setItem('comRewards', text);
            return text;
        })
    }

    listUserRedeemedRewards() {
        return fetch("https://landit-app.appspot.com/rest/reward/listRedeemed", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: JSON.parse(localStorage.getItem('token')).username
            })
        }).then(function (response) {
            if (!response.ok) {
                return response.text().then((text) => {
                    const error = new Error(text)
                    error.code = response.status;
                    throw error
                })
            }
            return response.text()
        }).then(function (text) {
            localStorage.setItem('redeemedRewards', text);
            return text;
        })
    }

    listUserRedeemableRewards() {
        return fetch("https://landit-app.appspot.com/rest/reward/listRedeemable", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: JSON.parse(localStorage.getItem('token')).username
            })
        }).then(function (response) {
            if (!response.ok) {
                return response.text().then((text) => {
                    const error = new Error(text)
                    error.code = response.status;
                    throw error
                })
            }
            return response.text()
        }).then(function (text) {
            localStorage.setItem('redeemableRewards', text);
            return text;
        })
    }

    listAllRewards() {
        return fetch("https://landit-app.appspot.com/rest/reward/listAll", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(function (response) {
            if (!response.ok) {
                return response.text().then((text) => {
                    const error = new Error(text)
                    error.code = response.status;
                    throw error
                })
            }
            return response.text()
        }).then(function (text) {
            localStorage.setItem('allRewards', text);
            return text;
        })
    }

    redeemReward(owner, reward) {
        return fetch("https://landit-app.appspot.com/rest/reward/redeem", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: JSON.parse(localStorage.getItem('token')).username,
                owner: owner,
                reward: reward
            })
        }).then(function (response) {
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

    createReward(name, description, price) {
        return fetch("https://landit-app.appspot.com/rest/reward/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                description: description,
                owner: JSON.parse(localStorage.getItem('token')).username,
                price: price,
                timesRedeemed: "0"
            })
        }).then(function (response) {
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

    modifyReward(name, description, owner, price) {
        return fetch("https://landit-app.appspot.com/rest/reward/update", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: JSON.parse(localStorage.getItem('token')).username,
                name: name,
                description: description,
                owner: owner, 
                price: price,
            })
        }).then(function (response) {
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
        return fetch("https://landit-app.appspot.com/rest/user/logout", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: JSON.parse(localStorage.getItem('token')).username
            })
        }).then(function (response) {
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
            localStorage.removeItem('parcelsSearch')
            localStorage.removeItem('forumsUser')
            localStorage.removeItem('forumsAll')
            localStorage.removeItem('forum')
            localStorage.removeItem('messages')
            localStorage.removeItem('allUsers')
            localStorage.removeItem('allParcels')
            localStorage.removeItem('allRewards');
            localStorage.removeItem('redeemableRewards');
            localStorage.removeItem('redeemedRewards');
            localStorage.removeItem('comRewards');
            localStorage.removeItem('parcelsRep');
            localStorage.removeItem('rewards');
            return text;
        })
    }

}

const restCallsExport = new restCalls();
export default restCallsExport;