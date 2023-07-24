var db=require('../config/connection')
var collection=require('../config/collection')
const bcrypt=require('bcrypt')
const { ObjectId } = require('mongodb');

module.exports={
      findUsers:async()=>{
        let users=await db.get().collection(collection.USER_COLLECTION).find({}).toArray()
        return users
      },
      deleteUser: async (id) => {
        await db.get().collection(collection.USER_COLLECTION).deleteOne({_id:new ObjectId(id)});
        return;
      }
      ,
      getUserById: async (id) => {
        let user = await db.get().collection(collection.USER_COLLECTION).findOne({ _id:new  ObjectId(id) });
        return user;
    },

    updateUser: async (id, user) => {
        await db.get().collection(collection.USER_COLLECTION).updateOne({ _id:new ObjectId(id) }, { $set: { name: user.name, email: user.email, username: user.username } });
        return;
    },

    searchUser: async (char) => {
        char = '^' + char;
        let user = await db.get().collection(collection.USER_COLLECTION).find({ $or: [{ name: { $regex: char, $options: "i" } }, { email: { $regex: char, $options: "i" } }] }).toArray()
        return user;
    },
}
