const response = require('express');
// const isValidDomain = require('is-valid-domain');
const email = require('node-email-extractor').default;
const axios = require('axios');




const BulkDomainExtract = require('../models/BulkDomainExtract');
const BulkDomainExtractInfo = require('../models/BulkDomainExtractInfo');
const BulkDomainExtractEmails = require('../models/BulkDomainExtractEmails');
const BulkDomainExtractCount = require('../models/BulkDomainExtractCount');
const BulkDomainExtractCountForShow = require('../models/BulkDomainExtractCountForShow');




// INDEX
const index = (req,res) => {
  res.json({
    response:true
  })
}


//TESTING
const testing = async (req,res) => {

  // var Scraper = require("email-crawler");
  // var emailscraper = new Scraper("https://giuliofashion.com");
  // // A level is how far removed (in  terms of link clicks) a page is from the root page (only follows same domain routes)
  // emailscraper.getLevels(3).then((emails) => {
  //   console.log(emails); // Here are the emails crawled from traveling two levels down this domain
  // })
  // .catch((e) => {
  //   console.log("error");
  // })
  //
  //
  // var findemail = await email.url('https://enquiries@giuliofashion.com')
  // console.log(findemail)

  // var extractor   =   require('email-extractor').Extractor;
  //
  //
  // // extractor("http://omaze.com",function(url,email){
  // //   console.log(url,email);
  // // });
  //
  // extractor("http://github.com",function(url,email){
  //     console.log(url,email);
  // });


  // var data = email.text(` `);
  //
  // console.log(data)


  // var findemail = await email.url('https://www.giuliofashion.com')
  // console.log(findemail)







  const GetSiteUrls = require( 'get-site-urls' );

GetSiteUrls( 'https://giuliofashion.com' )
    .then( links => console.log( links ) );
}


// VIEW DETAILS
const viewdetail = async (req,res) => {
  var domainextractinfo = await BulkDomainExtractInfo.findOne({uuid:req.params.uuid});
  var bulkdomainextract = await BulkDomainExtract.find({uuid:req.params.uuid});
  var bulkdomainextractemails = await BulkDomainExtractEmails.find({uuid:req.params.uuid});
  var bulkdomainextractcount = await BulkDomainExtractCount.find({uuid:req.params.uuid});



  res.json({
    response:true,
    domainextractinfo,
    bulkdomainextract,
    bulkdomainextractemails,
    bulkdomainextractcount
  })
}


// VIEW BY LIST
const viewlistbyuser = (req,res) => {

  BulkDomainExtractInfo.find({userid:req.params.userid})
  .then(response=>{
    res.json({
      response:true,
      data:response
    })
  })
  // res.json({
  //   response:true,
  //   id:req.params.userid
  // })
}



const bulkextractbyuser = (req,res) => {


  var insm = new BulkDomainExtractInfo();
  insm.listname = req.body[0].listname;
  insm.uuid = req.body[0].uuid;
  insm.username = req.body[0].username;
  insm.useremail = req.body[0].useremail;
  insm.userid = req.body[0].userid;
  insm.totaldomains = req.body.length;
  insm.totaldomainames = req.body;
  insm.isvaliddomain = true;
  insm.save((err,doc)=>{
    if(!err){
      res.json({
        response:true
      })
    }else{
    }
  })


  var datas = req.body;
  var interval = req.body[0].speed;

  datas.forEach(async(item, index) => {
      setTimeout(async () => {

        var domain = item.domain;



            var insx = new BulkDomainExtractCount();
            insx.domain = domain;
            insx.uuid = item.uuid;
            insx.userid = item.userid;
            insx.save((err,doc)=>{
              if(!err){
              }else{
              }
            })


			var insx = new BulkDomainExtractCountForShow();
            insx.domain = domain;
            insx.uuid = item.uuid;
            insx.userid = item.userid;
            insx.save((err,doc)=>{
              if(!err){
              }else{
              }
            })



            // const doc = await axios.get(`https://api.minelead.io/v1/search/?domain=${item.domain}&key=9aaee4205e0212de7200342960313b83`);
            // console.log(doc.data)



            const doc = await axios.get(`http://localhost:5004/api/bulkdomainextract/fetchdomain/quick/${item.domain}`);
            console.log(doc.data)





            // //if found emails
            // if(doc.data.status==='found'){
            //
            //   // var ins = new BulkDomainExtract();
            //   // ins.domainname = domain;
            //   // ins.uuid = item.uuid;
            //   // ins.username = item.username;
            //   // ins.useremail = item.useremail;
            //   // ins.userid = item.userid;
            //   // ins.domainname = item.domain;
            //   // ins.domainemails = doc.emails;
            //   // // ins.isfoundemails = doc.emails.length>0?true:false;
            //   // // ins.totalemails = doc.emails.length;
            //   // ins.isvaliddomain = true;
            //   // ins.save((err,docas)=>{
            //   //   if(!err){
            //   //   }else{
            //   //   }
            //   // })
            //   var ins = new BulkDomainExtract();
            //   ins.domainname = domain;
            //   ins.uuid = item.uuid;
            //   ins.username = item.username;
            //   ins.useremail = item.useremail;
            //   ins.userid = item.userid;
            //   ins.domainname = item.domain;
            //   ins.domainemails = doc.data.emails;
            //   ins.isfoundemails = true
            //   ins.totalemails = 0;
            //   ins.isvaliddomain = true;
            //   ins.save((err,docas)=>{
            //     if(!err){
            //     }else{
            //     }
            //   })
            //
            //
            //
            //   var tmpfemail = doc.data.emails;
            //   tmpfemail.forEach((feitem, i) => {
            //
            //       var ins = new BulkDomainExtractEmails();
            //       ins.domainname = domain;
            //       ins.uuid = item.uuid;
            //       ins.username = item.username;
            //       ins.useremail = item.useremail;
            //       ins.useruuid = item.useruuid;
            //       ins.domain = item.domain;
            //       ins.email = feitem.email;
            //       ins.emailverified = feitem.verified;
            //       ins.emailquality = feitem.quality;
            //       ins.save((err,docasd)=>{
            //         if(!err){
            //         }else{
            //         }
            //       })
            //
            //   });
            //
            //
            //
            //
            // }else{
            //
            //   var ins = new BulkDomainExtract();
            //   ins.domainname = domain;
            //   ins.uuid = item.uuid;
            //   ins.username = item.username;
            //   ins.useremail = item.useremail;
            //   ins.userid = item.userid;
            //   ins.domainname = item.domain;
            //   ins.isfoundemails = false
            //   ins.totalemails = 0;
            //   ins.isvaliddomain = true;
            //   ins.save((err,docas)=>{
            //     if(!err){
            //     }else{
            //     }
            //   })
            // }





            // if(doc.emails.length>0){
            //
            //   var tmpfemail = doc.emails;
            //   tmpfemail.forEach((feitem, i) => {
            //
            //     if(/^[a-z][a-z-_\.]+@([a-z]|[a-z]?[a-z-]+[a-z])\.[a-z]{2,10}(?:\.[a-z]{2,10})?$/.test(feitem)) {
            //
            //       var ins = new BulkDomainExtractEmails();
            //       ins.domainname = domain;
            //       ins.uuid = item.uuid;
            //       ins.username = item.username;
            //       ins.useremail = item.useremail;
            //       ins.useruuid = item.useruuid;
            //       ins.domain = item.domain;
            //       ins.email = feitem;
            //       ins.isvaliddomain = true;
            //       ins.save((err,docasd)=>{
            //         if(!err){
            //           // console.log('Inserted Found Emails Domain');
            //         }else{
            //           // console.log('Failed to insert Found Emails Domain');
            //         }
            //       })
            //     }else{
            //     }
            //
            //   });
            //
            // }else{
            // }














      }, index * interval);
  });


}




const deleteall = async (req,res) => {


  // var bdei = await BulkDomainExtractInfo.find({uuid:req.params.uuid}).distinct('_id');


  var bde = await BulkDomainExtract.find({uuid:req.params.uuid}).distinct('_id');
  var bdee = await BulkDomainExtractEmails.find({uuid:req.params.uuid}).distinct('_id');
  var bdec = await BulkDomainExtractCount.find({uuid:req.params.uuid}).distinct('_id');

  BulkDomainExtractInfo.findOneAndDelete({uuid:req.params.uuid})
  .then(dta=>{
    res.json({
      response:true,
      uuid:req.params.uuid,
      bdee
    })




    BulkDomainExtract.deleteMany({ _id: { $in: bde}}, function(err) {})
    BulkDomainExtractEmails.deleteMany({ _id: { $in: bdee}}, function(err) {})
    BulkDomainExtractCount.deleteMany({ _id: { $in: bdec}}, function(err) {})
  })










}


module.exports={index,bulkextractbyuser,viewlistbyuser,viewdetail,deleteall,testing};
