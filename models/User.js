const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name:{
    type:String
  },
  email:{
    type:String
  },
  password:{
    type:String
  },
  company:{
    type:String
  },
  contact:{
    type:String
  },
  city:{
    type:String
  }
},{timestamps:true})

const User = mongoose.model('User',UserSchema);
module.exports=User;
