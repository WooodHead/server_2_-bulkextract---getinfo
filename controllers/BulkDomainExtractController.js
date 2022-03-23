const response = require('express');
// const isValidDomain = require('is-valid-domain');
const email = require('node-email-extractor').default;
var validator = require("email-validator");


const rp = require('request-promise');
const cheerio = require('cheerio');
const ExtractEmail = require('extract-email');
const validatePhoneNumber = require('validate-phone-number-node-js');
const axios = require('axios');
const stringfind = require('extract-data-from-text');



const BulkDomainExtract = require('../models/BulkDomainExtract');
const BulkDomainExtractInfo = require('../models/BulkDomainExtractInfo');
const BulkDomainExtractEmails = require('../models/BulkDomainExtractEmails');
const BulkDomainExtractCount = require('../models/BulkDomainExtractCount');
const BulkDomainExtractCountForShow = require('../models/BulkDomainExtractCountForShow');



function validatephone(phone) {
  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if(regex.test(phone)){return true}else{return false}
}




function ValidateEmail(mail)
{
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    if(mail.slice(-3)==='jpg'){
      return false;
    }else if (mail.slice(-3)==='png') {
      return false;
    }else if (mail.slice(-3)==='gif') {
      return false;
    }else if (mail.slice(-3)==='css') {
      return false;
    }else if (mail.slice(-4)==='html') {
      return false;
    }else if (mail.slice(-11)==='example.com') {
      return false;
    }else if (mail.slice(-9)==='email.com') {
      return false;
    }else if (mail.slice(-9)==='sentry.io') {
      return false;
    }else if (mail.slice(-2)==='js') {
      return false;
    }else if (mail.slice(-4)==='jpeg') {
      return false;
    }else{
      return true;
    }
  }else {
    return false;
  }
}






async function extract(domain){


  try {

  //////////////////////////////////////



  // const options = {
  //   uri: `http://${domain}`,
  //   transform: function (body) {
  //     return cheerio.load(body);
  //   }
  // };



      const axiosdata = await axios.get(`http://${domain}`,{timeout:6000});
      // var axiosdata = await axios.get('https://qtonix.com');

      let $ = cheerio.load(axiosdata.data);


      var varEmails=[];
      var varPhones=[];


      const string = $.html();
      let resEmail = stringfind.emails(string)


      // ======== dont delete ========
      // let phone_numbers = [];
      // const regexp = new RegExp("\\+?\\(?\\d*\\)? ?\\(?\\d+\\)?\\d*([\\s./-]?\\d{2,})+","g");
      // let match;
      // while ((match = regexp.exec(string)) !== null) {
      //   if(validatePhoneNumber.validate(match[0])){
      //     // console.log(`${match[0]}`);
      //
      //     if(validatephone(match[0])){
      //
      //       var thref = match[0];
      //       var tdataarray=[thref];
      //       tdataarray.forEach(function(value){
      //         if (varPhones.indexOf(value)==-1) varPhones.push(value);
      //       });
      //
      //     }else{
      //
      //     }
      //   }else{
      //
      //   }
      // }
      // ======== dont delete ========




      //GET EMAILS (TEXT CONVERT)
      resEmail.forEach((item) => {
        var href = item
        var thref = href.toLowerCase();
        if(ValidateEmail(thref)){
          var tdataarray=[thref];
          tdataarray.forEach(function(value){
            if (varEmails.indexOf(value)==-1) varEmails.push(value);
          });
        }
      });



      //GET ALL EMAILS
      $('a[href^="mailto:"]').each((i, link) => {
        const href = link.attribs.href;
        var thref = href.substring(7).toLowerCase();
        if(ValidateEmail(thref)){
          var tdataarray=[thref];
          tdataarray.forEach(function(value){
            if (varEmails.indexOf(value)==-1) varEmails.push(value);
          });
        }
      });



      //GET ALL PHONE
      $('a[href^="tel:"]').each((i, link) => {
        const href = link.attribs.href;
        var thref = href.substring(4);
        var tdataarray=[thref];
        tdataarray.forEach(function(value){
          if (varPhones.indexOf(value)==-1) varPhones.push(value);
        });
      });


      var tmpData={
        response:true,
        page:domain,
        title:$('title').text(),
        facebook:$('a[href^="https://www.facebook.com/"]').attr("href")===undefined?$('a[href^="https://facebook.com/"]').attr("href"):$('a[href^="https://www.facebook.com/"]').attr("href"),
        instagram:$('a[href^="https://www.instagram.com/"]').attr("href")===undefined?$('a[href^="https://instagram.com/"]').attr("href"):$('a[href^="https://www.instagram.com/"]').attr("href"),
        twitter:$('a[href^="https://twitter.com/"]').attr("href"),
        linkedin:$('a[href^="https://www.linkedin.com/"]').attr("href")===undefined?$('a[href^="https://linkedin.com/"]').attr("href"):$('a[href^="https://www.linkedin.com/"]').attr("href"),
        googleplus:$('a[href^="https://plus.google.com/"]').attr("href"),
        youtube:$('a[href^="https://www.youtube.com/"]').attr("href")===undefined?$('a[href^="https://youtube.com/"]').attr("href"):$('a[href^="https://www.youtube.com/"]').attr("href"),
        whatsapp1:$('a[href^="https://chat.whatsapp.com/"]').attr("href"),
        whatsapp2:$('a[href^="https://wa.me/"]').attr("href"),
        email:varEmails,
        // tel:varPhones,
      }
      // console.log(tmpData)
      return tmpData;


    } catch (err) {
      var tmpData={
                response:false,
              }
              return tmpData;
    }




}










////////////////////////////////////////BACKUP////////////////////////////////////
// function extract(domain){
//
//   //////////////////////////////////////
//   const rp = require('request-promise');
//   const cheerio = require('cheerio');
//   const ExtractEmail = require('extract-email');
//   const validatePhoneNumber = require('validate-phone-number-node-js');
//
//
//   const options = {
//     uri: `http://${domain}`,
//     transform: function (body) {
//       return cheerio.load(body);
//     }
//   };
//
//   return(
//
//
//     rp(options)
//     .then(($) => {
//       // console.log($.html());
//       let dotwords = [".","[dot]","-dot-"];
//       let atwords = ["@","[at]","-at-"];
//       let resEmail = ExtractEmail.String($.html(),atwords,dotwords);
//
//       var varEmails=[];
//       var varPhones=[];
//
//
//       const string = $.html();
//
//       // ======== dont delete ========
//       // let phone_numbers = [];
//       // const regexp = new RegExp("\\+?\\(?\\d*\\)? ?\\(?\\d+\\)?\\d*([\\s./-]?\\d{2,})+","g");
//       // let match;
//       // while ((match = regexp.exec(string)) !== null) {
//       //   if(validatePhoneNumber.validate(match[0])){
//       //     // console.log(`${match[0]}`);
//       //
//       //     if(validatephone(match[0])){
//       //
//       //       var thref = match[0];
//       //       var tdataarray=[thref];
//       //       tdataarray.forEach(function(value){
//       //         if (varPhones.indexOf(value)==-1) varPhones.push(value);
//       //       });
//       //
//       //     }else{
//       //
//       //     }
//       //   }else{
//       //
//       //   }
//       // }
//       // ======== dont delete ========
//
//
//
//
//       //GET EMAILS (TEXT CONVERT)
//       resEmail.forEach((item, i) => {
//         var href = item.email
//         var thref = href.toLowerCase();
//         if(ValidateEmail(thref)){
//           var tdataarray=[thref];
//           tdataarray.forEach(function(value){
//             if (varEmails.indexOf(value)==-1) varEmails.push(value);
//           });
//         }
//       });
//
//
//
//       //GET ALL EMAILS
//       $('a[href^="mailto:"]').each((i, link) => {
//         const href = link.attribs.href;
//         var thref = href.substring(7).toLowerCase();
//         if(ValidateEmail(thref)){
//           var tdataarray=[thref];
//           tdataarray.forEach(function(value){
//             if (varEmails.indexOf(value)==-1) varEmails.push(value);
//           });
//         }
//       });
//
//
//
//       //GET ALL PHONE
//       $('a[href^="tel:"]').each((i, link) => {
//         const href = link.attribs.href;
//         var thref = href.substring(4);
//         var tdataarray=[thref];
//         tdataarray.forEach(function(value){
//           if (varPhones.indexOf(value)==-1) varPhones.push(value);
//         });
//       });
//
//
//       var tmpData={
//         response:true,
//         page:domain,
//         title:$('title').text(),
//         facebook:$('a[href^="https://www.facebook.com/"]').attr("href")===undefined?$('a[href^="https://facebook.com/"]').attr("href"):$('a[href^="https://www.facebook.com/"]').attr("href"),
//         instagram:$('a[href^="https://www.instagram.com/"]').attr("href")===undefined?$('a[href^="https://instagram.com/"]').attr("href"):$('a[href^="https://www.instagram.com/"]').attr("href"),
//         twitter:$('a[href^="https://twitter.com/"]').attr("href"),
//         linkedin:$('a[href^="https://www.linkedin.com/"]').attr("href")===undefined?$('a[href^="https://linkedin.com/"]').attr("href"):$('a[href^="https://www.linkedin.com/"]').attr("href"),
//         googleplus:$('a[href^="https://plus.google.com/"]').attr("href"),
//         youtube:$('a[href^="https://www.youtube.com/"]').attr("href")===undefined?$('a[href^="https://youtube.com/"]').attr("href"):$('a[href^="https://www.youtube.com/"]').attr("href"),
//         whatsapp1:$('a[href^="https://chat.whatsapp.com/"]').attr("href"),
//         whatsapp2:$('a[href^="https://wa.me/"]').attr("href"),
//         email:varEmails,
//         tel:varPhones,
//       }
//       // console.log(tmpData)
//       return tmpData;
//       }).catch((err) => {
//         var tmpData={
//           response:false,
//         }
//         return tmpData;
//       })
//
//   );
//
//
//
// }



const testDomainExtract = async (req,res,next) => {

  // const getMetaData = require('metadata-scraper');
  // const meta = await getMetaData('http://'+req.params.domain)
  // console.log(meta)

  // const sslChecker = require('ssl-checker');
  // sslChecker(req.params.domain, { method: "GET", port: 443 }).then(console.info);




    const main = await extract(req.params.domain)
    const main1 = await extract(req.params.domain+'/contact/')
    const main2 = await extract(req.params.domain+'/contactus/')
    const main4 = await extract(req.params.domain+'/contact-us/')
    const main4x = await extract(req.params.domain+'/contact-us')
    // const main5 = await extract(req.params.domain+'/contactus.html')
    // const main6 = await extract(req.params.domain+'/contact.html')
    // const main7 = await extract(req.params.domain+'/contact-us.html')
    // const main8 = await extract(req.params.domain+'/contactus.php')
    // const main9 = await extract(req.params.domain+'/contact-us.php')
    // const main3 = await extract(req.params.domain+'/contact.php')
    const main10 = await extract(req.params.domain+'/contactdetails')
    const main11 = await extract(req.params.domain+'/pages/about-us')
    const main12 = await extract(req.params.domain+'/pages/contact-us')








    var tmpfacebooks = [];
    var tmpinstagrams = [];
    var tmptwitters = [];
    var tmplinkedins = [];
    var tmpgooglepluss = [];
    var tmpyoutubes = [];
    var tmpwhatsapps = [];
    var tmpemails = [];
    var tmptelss = [];



    function updateDatas(main){
      //facebook
      if(main.facebook !== undefined){
        const gfblink = main.facebook;
        if (tmpfacebooks.indexOf(gfblink)==-1) tmpfacebooks.push(gfblink);
      }
      //instagram
      if(main.instagram !== undefined){
        const ginstagramlink = main.instagram;
        if (tmpinstagrams.indexOf(ginstagramlink)==-1) tmpinstagrams.push(ginstagramlink);
      }
      //twitter
      if(main.twitter !== undefined){
        const gtwitterlink = main.twitter;
        if (tmptwitters.indexOf(gtwitterlink)==-1) tmptwitters.push(gtwitterlink);
      }
      //linkedin
      if(main.linkedin !== undefined){
        const gtmplinkedinslink = main.linkedin;
        if (tmplinkedins.indexOf(gtmplinkedinslink)==-1) tmplinkedins.push(gtmplinkedinslink);
      }
      //googleplus
      if(main.googleplus !== undefined){
        const ggooglepluslink = main.googleplus;
        if (tmpgooglepluss.indexOf(ggooglepluslink)==-1) tmpgooglepluss.push(ggooglepluslink);
      }
      //youtube
      if(main.youtube !== undefined){
        const gyoutubelink = main.youtube;
        if (tmpyoutubes.indexOf(gyoutubelink)==-1) tmpyoutubes.push(gyoutubelink);
      }
      //whatsapp1
      if(main.whatsapp1 !== undefined){
        const gwhatsapp1link = main.whatsapp1;
        if (tmpwhatsapps.indexOf(gwhatsapp1link)==-1) tmpwhatsapps.push(gwhatsapp1link);
      }
      //whatsapp2
      if(main.whatsapp2 !== undefined){
        const gwhatsapp2link = main.whatsapp2;
        if (tmpwhatsapps.indexOf(gwhatsapp2link)==-1) tmpwhatsapps.push(gwhatsapp2link);
      }
      //email
      if(main.email !== undefined){
        const gemailslink = main.email;
        gemailslink.forEach(function(value){
          if (tmpemails.indexOf(value)==-1) tmpemails.push(value);
        });
      }
      //email
      if(main.tel !== undefined){
        const gtellink = main.tel;
        gtellink.forEach(function(value){
          if (tmptelss.indexOf(value)==-1) tmptelss.push(value);
        });
      }
    }


      if(main.response){
        updateDatas(main)
      }
      if(main1.response){
        updateDatas(main1)
      }
      if(main2.response){
        updateDatas(main2)
      }
      // if(main3.response){
      //   updateDatas(main3)
      // }
      if(main4.response){
        updateDatas(main4)
      }
      if(main4x.response){
        updateDatas(main4x)
      }
      // if(main5.response){
      //   updateDatas(main5)
      // }
      // if(main6.response){
      //   updateDatas(main6)
      // }
      // if(main7.response){
      //   updateDatas(main7)
      // }
      // if(main8.response){
      //   updateDatas(main8)
      // }
      // if(main9.response){
      //   updateDatas(main9)
      // }
      if(main10.response){
        updateDatas(main10)
      }
      if(main11.response){
        updateDatas(main11)
      }
      if(main12.response){
        updateDatas(main12)
      }



      if(main.response){
        res.json({
          response:true,
          domain:req.params.domain,
          // url:meta.url,
          // icons:meta.icon,
          title:main.title,
          facebook:tmpfacebooks,
          instagram:tmpinstagrams,
          twitter:tmptwitters,
          linkedin:tmplinkedins,
          googleplus:tmpgooglepluss,
          youtube:tmpyoutubes,
          whatsapp:tmpwhatsapps,
          email:tmpemails,
          tel:tmptelss
        })
      }else{
        res.json({
          response:false,
		  domain:req.params.domain,
        })
      }



}



const singledomainextract = async(req,res) => {

axios.get(`http://${req.params.domain}`,{timeout: 5000})
.then(axiosdata=>{

  let $ = cheerio.load(axiosdata.data);
  const string = $.html();

  let resEmail = stringfind.emails(string)

  var varEmails=[];

  //GET EMAILS (TEXT CONVERT)
  resEmail.forEach((item) => {
    var href = item
    var thref = href.toLowerCase();
    if(ValidateEmail(thref)){
      var tdataarray=[thref];
      tdataarray.forEach(function(value){
        if (varEmails.indexOf(value)==-1) varEmails.push(value);
      });
    }
  });
  //GET ALL EMAILS
  $('a[href^="mailto:"]').each((i, link) => {
    const href = link.attribs.href;
    var thref = href.substring(7).toLowerCase();
    if(ValidateEmail(thref)){
      var tdataarray=[thref];
      tdataarray.forEach(function(value){
        if (varEmails.indexOf(value)==-1) varEmails.push(value);
      });
    }
  });

  res.json({
    response:true,
    domain:req.params.domain,
    title:[],
    facebook:[],
    instagram:[],
    twitter:[],
    linkedin:[],
    googleplus:[],
    youtube:[],
    whatsapp:[],
    email:varEmails,
    tel:[]
  })

}).catch(err=>{
  res.json({
    response:false,
    domain:req.params.domain,

  })
})

}









// const websitesingledomainextract = (req,res) => {
//
//
//   res.json({
//     response:true
//   })
//
//
//
//   var mdatas = [];
//
//   var getdatas = req.body;
//
//   getdatas.forEach((item, i) => {
//     mdatas.push(item.domain);
//   });
//
//
//
//
//
//   var Crawler = require("crawler");
//   const stringfind = require('extract-data-from-text');
//   const email = require('node-email-extractor').default;
//
//   var c = new Crawler({
//       maxConnections : 30,
//       retries:0,
//       // This will be called for each crawled page
//       callback : function (error, res, done) {
//
//           // console.log(res.options.uri)
//
//           if(error){
//               console.log('error');
//
//               var ins = new BulkDomainExtract();
//                 ins.domainname = res.options.uri;
//                 ins.uuid = req.body[0].uuid;
//                 ins.userid = req.body[0].userid;
//                 ins.domainemails = 'NotFound';
//                 ins.isfoundemails = false
//                 ins.totalemails = 0;
//                 ins.isvaliddomain = false;
//                 ins.save((err,docas)=>{
//                   if(!err){
//                   }else{
//                   }
//                 })
//
//           }else{
//               var $ = res.$;
//               // $ is Cheerio by default
//               //a lean implementation of core jQuery designed specifically for the server
//               // console.log($("title").text());
//
//
//               // console.log($)
//
//               // console.log(req.body)
//
//
//               if(!$){
//                 console.log('error');
//
//                         var ins = new BulkDomainExtract();
//                           ins.domainname = res.options.uri;
//                           ins.uuid = req.body[0].uuid;
//                           ins.userid = req.body[0].userid;
//                           ins.domainemails = 'NotFound';
//                           ins.isfoundemails = false
//                           ins.totalemails = 0;
//                           ins.isvaliddomain = false;
//                           ins.save((err,docas)=>{
//                             if(!err){
//                             }else{
//                             }
//                           })
//
//
//               }else{
//                 const string = $.html();
//                 var data = email.text(string)
//                 // console.log(data.emails)
//
//
//
//                 resEmail=data.emails;
//
//                 var varEmails=[];
//
//                 //GET EMAILS (TEXT CONVERT)
//                 resEmail.forEach((item) => {
//                   var href = item
//                   var thref = href.toLowerCase();
//                   if(ValidateEmail(thref)){
//                     var tdataarray=[thref];
//                     tdataarray.forEach(function(value){
//                       if (varEmails.indexOf(value)==-1) varEmails.push(value);
//                     });
//                   }
//                 });
//                 //GET ALL EMAILS
//                 $('a[href^="mailto:"]').each((i, link) => {
//                   const href = link.attribs.href;
//                   var thref = href.substring(7).toLowerCase();
//                   if(ValidateEmail(thref)){
//                     var tdataarray=[thref];
//                     tdataarray.forEach(function(value){
//                       if (varEmails.indexOf(value)==-1) varEmails.push(value);
//                     });
//                   }
//                 });
//
//                 if(varEmails.length!==0){
//                   var ins = new BulkDomainExtract();
//                   ins.domainname = res.options.uri;
//                   ins.uuid = req.body[0].uuid;
//                   ins.userid = req.body[0].userid;
//                   ins.domainemails = varEmails;
//                   ins.isfoundemails = true
//                   ins.totalemails = varEmails.length;
//                   ins.isvaliddomain = true;
//                   ins.save((err,docas)=>{
//                     if(!err){
//                     }else{
//                     }
//                   })
//
//                 }else{
//                   var ins = new BulkDomainExtract();
//                   ins.domainname = res.options.uri;
//                   ins.uuid = req.body[0].uuid;
//                   ins.userid = req.body[0].userid;
//                   ins.domainemails = 'NotFound';
//                   ins.isfoundemails = false
//                   ins.totalemails = 0;
//                   ins.isvaliddomain = true;
//                   ins.save((err,docas)=>{
//                     if(!err){
//                     }else{
//                     }
//                   })
//                 }
//
//
//
//
//
//
//               }
//
//
//
//
//           }
//           done();
//       }
//   });
//
//
//
//
//
// var domains = mdatas;
//
// domains.forEach((item, i) => {
//   c.queue({
//       uri: 'http://'+item,
//       // this will override the 'preRequest' defined in crawler
//       preRequest: function(options, done) {
//           setTimeout(function() {
//           // console.log(options);
//           done();
//       }, 6000)
//       }
//   });
// });
//
//
//
//
//         getdatas.forEach((item, i) => {
//           var insx = new BulkDomainExtractCount();
//           insx.domain = item.domain;
//           insx.uuid = item.uuid;
//           insx.userid = item.userid;
//           insx.save((err,doc)=>{
//             if(!err){
//             }else{
//             }
//           })
//
//
//           var insx = new BulkDomainExtractCountForShow();
//           insx.domain = item.domain;
//           insx.uuid = item.uuid;
//           insx.userid = item.userid;
//           insx.save((err,doc)=>{
//             if(!err){
//             }else{
//             }
//           })
//         });
//
//
//
// }














const websitesingledomainextract = (req,res) => {

  //-------LOOP START-------//
  var array = req.body;
  var interval = 1500;
  // array.forEach(async (el, index) => {
  //     setTimeout(async () => {

  array.forEach(async (el, index) => {
      setTimeout(async () => {


        var insx = new BulkDomainExtractCount();
        insx.domain = el.domain;
        insx.uuid = el.uuid;
        insx.userid = el.userid;
        insx.save((err,doc)=>{
          if(!err){
          }else{
          }
        })


        var insx = new BulkDomainExtractCountForShow();
        insx.domain = el.domain;
        insx.uuid = el.uuid;
        insx.userid = el.userid;
        insx.save((err,doc)=>{
          if(!err){
          }else{
          }
        })


        axios.get('http://'+el.domain,{timeout: 1500})
        .then(axiosdata=>{

          let $ = cheerio.load(axiosdata.data);
          const string = $.html();

          // let resEmail = stringfind.emails(string)

          var varEmails=[];
          var varPhones=[];
          var varFacebooks = [];


          var data = email.text(string)
          resEmail=data.emails;

          //GET EMAILS (TEXT CONVERT)
          resEmail.forEach((item) => {
            var href = item
            var thref = href.toLowerCase();
            if(ValidateEmail(thref)){
              var tdataarray=[thref];
              tdataarray.forEach(function(value){
                if (varEmails.indexOf(value)==-1) varEmails.push(value);
              });
            }
          });
          // GET ALL EMAILS
          $('a[href^="mailto:"]').each((i, link) => {
            const href = link.attribs.href;
            var thref = href.substring(7).toLowerCase();
            if(ValidateEmail(thref)){
              var tdataarray=[thref];
              tdataarray.forEach(function(value){
                if (varEmails.indexOf(value)==-1) varEmails.push(value);
              });
            }
          });


          // GET ALL PHONE
          $('a[href^="tel:"]').each((i, link) => {
            const href = link.attribs.href;
            var thref = href.substring(4);
            var tdataarray=[thref];
            tdataarray.forEach(function(value){
              if (varPhones.indexOf(value)==-1) varPhones.push(value);
            });
          });


          // GET ALL FACEBOOK
          $('a[href^="https://www.facebook.com/"]').each((i, link) => {
            const href = link.attribs.href;
            var tdataarray=[href];
            tdataarray.forEach(function(value){
              if (varFacebooks.indexOf(value)==-1) varFacebooks.push(value);
            });
          });



          if(varEmails.length!==0){
            var ins = new BulkDomainExtract();
            ins.domainname = el.domain;
            ins.uuid = el.uuid;
            ins.userid = el.userid;
            ins.domainemails = varEmails;
            ins.domainphones = varPhones;
            ins.domainfacebook = varFacebooks;
            ins.isfoundemails = true
            ins.totalemails = varEmails.length;
            ins.domaintitle = $('title').text();
            ins.isvaliddomain = true;
            ins.save((err,docas)=>{
              if(!err){
              }else{
              }
            })

          }else{
            var ins = new BulkDomainExtract();
            ins.domainname = el.domain;
            ins.uuid = el.uuid;
            ins.userid = el.userid;
            ins.domainemails = 'NotFound';
            ins.isfoundemails = false
            ins.totalemails = 0;
            ins.isvaliddomain = true;
            ins.save((err,docas)=>{
              if(!err){
              }else{
              }
            })
          }




        }).catch(err=>{
          var ins = new BulkDomainExtract();
          ins.domainname = el.domain;
          ins.uuid = el.uuid;
          ins.userid = el.userid;
          ins.domainemails = 'NotFound';
          ins.isfoundemails = false
          ins.totalemails = 0;
          ins.isvaliddomain = false;
          ins.save((err,docas)=>{
            if(!err){
            }else{
            }
          })
          // var xds={
          //   response:false,
          //   domain:el.domain
          //
          // }
          // console.log(xds)





        })

      }, index * interval);
  })
  //-------LOOP START-------//


  res.json({
    response:true
  })
}



























































module.exports={testDomainExtract,singledomainextract,websitesingledomainextract};
