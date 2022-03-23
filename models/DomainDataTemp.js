const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DomainDataTempSchema = new Schema({
  domain:{
    type:String
  },
  status:{
    type:String
  }
},{timestamps:true})

const DomainDataTemp = mongoose.model('DomainDataTemp',DomainDataTempSchema);
module.exports=DomainDataTemp;
