var db = require('../config/connection')
var collection = require('../config/collection')
const bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb')

module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then(async (result) => {
                console.log(result);
                let user = await db.get().collection(collection.USER_COLLECTION).findOne({ _id:new ObjectId(result.insertedId) })
                resolve(user)
            })
        })
    },

    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false;
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ username: userData.username })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        console.log('success');
                        response.user = user;
                        response.status = true;
                        resolve(response);
                    } else {
                        console.log('failed');
                        resolve({ status: false });
                    }
                })
            } else {
                console.log('failed');
                resolve({ status: false });
            }
        })
    },


    checkUsername: (user) => {
        let registerd = db.get().collection(collection.USER_COLLECTION).findOne({ username: user});
        return registerd;
    },

    checkEmail: (user) => {
        let registerd = db.get().collection(collection.USER_COLLECTION).findOne({ email: user});
        return registerd;
    }


}