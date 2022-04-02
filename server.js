const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const result = require('dotenv').config();
var timeout = require('connect-timeout')

// const BulkDomainExtract = require('./routes/bulkdomainextract');


// ===DATABASE CONNECTION===
mongoose.connect(process.env.MONGODB, {useNewUrlParser: true, useUnifiedTopology:true});


const db = mongoose.connection;
db.on('error',(err)=>{
    console.log('Failed to connect.')
    console.log(err);
});
db.once('open',()=>{
    console.log('Successfully Connected.');
})
// ===DATABASE CONNECTION===



const app = express();


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({
 extended: true,
 limit: '100mb',
 parameterLimit: 100000
 }))

app.use(bodyParser.json({
 limit: '100mb',
 parameterLimit: 100000
}))

app.use(morgan('dev'));
//app.use(bodyParser.urlencoded({extended:true}));
//app.use(bodyParser.json());
app.use(cors())



app.get('/',(req,res)=>{
  res.send('<h1>SERVER_2_BULK_EXTRACT_GETINFO</h1>');
})


app.get('/extract/:domain',(req,res)=>{

  const DomainData = require('./models/DomainData');
  const DomainDataTemp = require('./models/DomainDataTemp');


  DomainData.findOne({domain:req.params.domain})
  .then(resdata=>{
    if(resdata===null){


      const promise = require("./scraper.js")
      promise.extractdomain(req.params.domain).then((response) => {
        // console.log(response)
        res.json({
          response
        })

      }).catch((err) => {
        // console.log(err)
      })


    }else{
      console.log(resdata)
      res.json({
        response:resdata
      })
    }
  })

  // function checkemailtype(email){
  //   if (email.match(/\.(jpe?g|png|pdf|jpg|js|css|io|gif)$/)){
  //     return false;
  //   }else{
  //     return true;
  //   }
  // }
  //
  //
  // console.log(checkemailtype('miss-gladys-sym-choon-head-shot-280px_140x@2x.gif'))


  //============= INSERT TEMP DATA =============
  DomainData.findOne({domain:req.params.domain})
  .then(resasa=>{
    if(resasa===null){
      DomainDataTemp.findOne({domain:req.params.domain})
      .then(responseas=>{
        if(responseas===null){
          var datatemp={
            domain:req.params.domain,
            status:'pending'
          };
          DomainDataTemp.create(datatemp);
        }
      })
    }
  })

  // process.exit(1);
})


//*** MANUAL UPDATE DOMAIN ***
app.get('/manualemailupdate',(req,res)=>{
    const DomainData = require('./models/DomainData');

    var domainname='qtonix.com';

    var mytmpdata={
      response:true,
      status:'Found',
      emails:['hr@qtonix.com','info@qtonix.com','sales@qtonix.com','adam@qtonix.com','david@qtonix.com'],
      tel:['+1-315-510-5120','+91-93488-78088','+44-11-5888-1166'],
      facebook:['https://www.facebook.com/qtonix'],
      instagram:[],
      twitter:['https://twitter.com/SeoCompany_USA'],
      linkedin:['https://www.linkedin.com/company/qtonix-software-pvt-ltd-/'],
      googleplus:[],
      youtube:['https://www.youtube.com/embed/DkdHczrTrsk'],
      whatsapp:[],
      printrest:[],
      skype:[],
    }

    // DomainData.findOneAndUpdate({domain: 'gritandtonic.com'}, {$set:{emails:emailstemp,status:'Found'}}, (err, doc) => {
    DomainData.findOneAndUpdate({domain: domainname}, {$set:mytmpdata}, (err, doc) => {
      if (err) {
        res.json({
          response:false
        })
      }else{
        res.json({
          response:true,
          message:'success'
        })
      }
    });
})


//*** MANUAL INSERT DOMAIN ***
app.get('/manualinsert',(req,res)=>{
    const DomainData = require('./models/DomainData');

    var domainname='flowerhornfishstoreindia.com';

    var mytmpdata={
      response:true,
      domain:domainname,
      status:'Found',
      emails:['flowerhornfishstoreindia@gmail.com'],
      tel:['+918847849963'],
      facebook:[''],
      instagram:[],
      twitter:[''],
      linkedin:[''],
      googleplus:[],
      youtube:[''],
      whatsapp:['https://chat.whatsapp.com/CS1xIHpkDmkD6bSGXplXgj'],
      printrest:[],
      skype:[]
    }

    console.log(mytmpdata)
    // DomainData.findOneAndUpdate({domain: 'gritandtonic.com'}, {$set:{emails:emailstemp,status:'Found'}}, (err, doc) => {
    DomainData.create(mytmpdata)
    .then(responseaasa=>{
      res.json({
        response:true
      })
    })

})








// app.get('/manualupdatedomaindata', async (req,res)=>{
//
//   const promise = require("./scraper.js");
//   const DomainData = require('./models/DomainData');
//   const DomainDataTemp = require('./models/DomainDataTemp');
//
//   var datas = await DomainDataTemp.find({}).limit(50);
//   var dataslength=datas.length;
//
//   var count=0;
//
//
//
//
//   function extractdata(datas[count].domain){
//
//     promise.extractdomain(domain).then((response) => {
//
//       console.log(response);
//
//       varcount=count+1;
//       extractdata(datas[count].domain)
//
//     }).catch((err) => {
//
//     })
//
//   }
//
//
//
//
//
//
//
// })






const PORT = process.env.PORT || 5002;

//app.listen(PORT, ()=>{
 //   console.log(`Server is running on ${PORT}`)
//})


app.listen(process.env.PORT || 5002, function(){
  console.log("USER Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

// app.use('/api/bulkdomainextract',BulkDomainExtract);
