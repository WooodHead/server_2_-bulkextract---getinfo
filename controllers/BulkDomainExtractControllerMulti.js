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
// var Crawler = require("simplecrawler");


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





const websitemultidomainextract = async (req,res) => {


  res.json({
    response:true
  })


  //-------LOOP START-------//
  var array = req.body;
  var interval = 700;
  // array.forEach(async (el, index) => {
  //     setTimeout(async () => {

  array.forEach(async (el, index) => {
      setTimeout( async () => {



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




        var domain = el.domain;


        var varEmails=[];


        function setemail(emaildata){
          var tdataarray=emaildata;
          tdataarray.forEach(function(value){
            if(ValidateEmail(value)){
              if (varEmails.indexOf(value)==-1) varEmails.push(value);
            }
          });
        }




        var Crawler = require("crawler");
        const Agent = require('socks5-https-client/lib/Agent');


        var c = new Crawler({
            maxConnections : 12,
            // rateLimit: 500,
            retries:0,
            timeout:3000,

            // agentClass: Agent, //adding socks5 https agent
            // method: 'GET',
            // strictSSL: true,
            // agentOptions: {
            //     socksHost: 'localhost',
            //     socksPort: 5004
            // },

            headers: {
              'User-Agent': 'Mozilla/5.0', // default header
            },
            // This will be called for each crawled page
            callback : function (error, res, done) {
                if(error){
                    console.log('error');
                }else{
                      var $ = res.$;
                      if(!$){

                      }else{

                        // var data = email.text($.html())
                        // console.log(data)
                        //
                        // if(data.emails.length>50){
                        //
                        // }else{
                        //   setemail(data.emails);
                        // }
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

                      }

                }
                done();
            }
        });

        // Queue just one URL, with default callback
        // c.queue('http://www.qtonix.com');

        // Queue a list of URLs
        c.queue([
          'http://'+domain,
          'http://'+domain+'/contact-us',
          'http://'+domain+'/contactus',
          'http://'+domain+'/contactus.html',
          'http://'+domain+'/contactus.php',
          'http://'+domain+'/contact.aspx',



          'http://'+domain+'/pages/contact-us',
          'http://'+domain+'/pages/contactus',
          'http://'+domain+'/pages/contact',


          'http://'+domain+'/pages/about-us',
          'http://'+domain+'/about-us',
          'http://'+domain+'/aboutus',


          'http://'+domain+'/policies/refund-policy',


      ]);






        // c.queue({
        //     uri: 'http://'+domain,
        //     preRequest: function(options, done) {
        //         setTimeout(function() {
        //         // console.log(options);
        //         done();
        //     }, 2000)
        //     }
        // });
        // c.queue({
        //     uri: 'http://'+domain+'/contact-us',
        //     preRequest: function(options, done) {
        //         setTimeout(function() {
        //         // console.log(options);
        //         done();
        //     }, 2000)
        //     }
        // });
        // c.queue({
        //     uri: 'http://'+domain+'/contactus',
        //     preRequest: function(options, done) {
        //         setTimeout(function() {
        //         // console.log(options);
        //         done();
        //     }, 2000)
        //     }
        // });
        // c.queue({
        //     uri: 'http://'+domain+'/contactus.html',
        //     preRequest: function(options, done) {
        //         setTimeout(function() {
        //         // console.log(options);
        //         done();
        //     }, 2000)
        //     }
        // });
        // c.queue({
        //     uri: 'http://'+domain+'/contactus.php',
        //     preRequest: function(options, done) {
        //         setTimeout(function() {
        //         // console.log(options);
        //         done();
        //     }, 2000)
        //     }
        // });
        // c.queue({
        //     uri: 'http://'+domain+'/contact.aspx',
        //     preRequest: function(options, done) {
        //         setTimeout(function() {
        //         // console.log(options);
        //         done();
        //     }, 2000)
        //     }
        // });
        // c.queue({
        //     uri: 'http://'+domain+'/pages/contact-us',
        //     preRequest: function(options, done) {
        //         setTimeout(function() {
        //         // console.log(options);
        //         done();
        //     }, 2000)
        //     }
        // });
        // c.queue({
        //     uri: 'http://'+domain+'/pages/contactus',
        //     preRequest: function(options, done) {
        //         setTimeout(function() {
        //         // console.log(options);
        //         done();
        //     }, 2000)
        //     }
        // });
        // c.queue({
        //     uri: 'http://'+domain+'/Contact_Us.aspx',
        //     preRequest: function(options, done) {
        //         setTimeout(function() {
        //         // console.log(options);
        //         done();
        //     }, 2000)
        //     }
        // });
        // c.queue({
        //     uri: 'http://'+domain+'/contact_us.aspx',
        //     preRequest: function(options, done) {
        //         setTimeout(function() {
        //         // console.log(options);
        //         done();
        //     }, 2000)
        //     }
        // });
        // c.queue({
        //     uri: 'http://'+domain+'/contactus.aspx',
        //     preRequest: function(options, done) {
        //         setTimeout(function() {
        //         // console.log(options);
        //         done();
        //     }, 2000)
        //     }
        // });


      c.on('drain',function(){
            console.log(varEmails)


            if(varEmails.length!==0){
              var ins = new BulkDomainExtract();
              ins.domainname = el.domain;
              ins.uuid = el.uuid;
              ins.userid = el.userid;
              ins.domainemails = varEmails;
              // ins.domainphones = varPhones;
              // ins.domainfacebook = varFacebooks;
              ins.isfoundemails = true
              ins.totalemails = varEmails.length;
              // ins.domaintitle = $('title').text();
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
      });

      }, index * interval);
  })
  //-------LOOP START-------//


  //
  // res.json({
  //   response:true
  // })

}








// const fetchdomain = async (req,res) => {
//
//
//
//   var domain = req.params.domain;
//   var varHtml=[];
//
//
//   //backup
//   var Crawler = require("crawler");
//
//   var c = new Crawler({
//       maxConnections : 11,
//       retries:0,
//       timeout:3000,
//       headers: {
//         'User-Agent': 'Mozilla/5.0', // default header
//       },
//       // This will be called for each crawled page
//       callback : function (error, res, done) {
//           if(error){
//               console.log('error');
//           }else{
//               var $ = res.$;
//               if(!$){
//               }else{
//                 var data = $.html()
//
//                 var tdata=[data]
//
//                 varHtml.push(tdata)
//               }
//
//           }
//           done();
//       }
//   });
//
//
//
//   // Queue just one URL, with default callback
//   // c.queue('http://www.qtonix.com');
//
//   // Queue a list of URLs
//   c.queue([
//     'http://'+req.params.domain,
//     'http://'+req.params.domain+'/contact-us',
//     'http://'+req.params.domain+'/contactus',
//     'http://'+req.params.domain+'/contact',
//     'http://'+req.params.domain+'/contactus.html',
//     'http://'+req.params.domain+'/contactus.php',
//     'http://'+req.params.domain+'/pages/contact-us',
//     'http://'+req.params.domain+'/pages/contactus',
//     'http://'+req.params.domain+'/pages/contact',
//     'http://'+req.params.domain+'/pages/about-us',
//     'http://'+req.params.domain+'/about-us',
//     'http://'+req.params.domain+'/aboutus',
//     'http://'+req.params.domain+'/policies/refund-policy',
// ]);
//
//
// c.on('drain',function(){
//       res.json({
//         response:true,
//         domain:req.params.domain,
//         html:varHtml,
//       })
// });
//
// }









///////////// dont delete total backup
const fetchdomain = async (req,res) => {



  var domain = req.params.domain;


  var varEmails=[];
  var varPhones=[]


  function setemail(emaildata){
    console.log(emaildata)
    var tdataarray=emaildata;
    tdataarray.forEach(function(value){
      if(ValidateEmail(value)){
        if (varEmails.indexOf(value)==-1) varEmails.push(value);
      }
    });

  }






  ////////// backup simple crawller ////////////
  var Crawler = require("simplecrawler");
  var cheerio = require("cheerio");

  var crawler = new Crawler("http://"+req.params.domain);


  // crawler.downloadUnsupported = false;
  // crawler.decodeResponses = true;
  crawler.maxDepth = 2;
  crawler.timeout = 7000;

  crawler.addFetchCondition(function(queueItem) {
      return !queueItem.path.match(/\.(zip|jpe?g|png|mp4|gif|css|js|jpg)$/i);
  });

  crawler.on("crawlstart", function() {
      console.log("crawlstart");
  });

  crawler.on('fetchcomplete', function(item, responseBuffer, response) {
            // [Do stuff with the scraped page]
            // console.log(responseBuffer);
            let $ = cheerio.load(responseBuffer);
            const string = $.html();
            console.log(string)
            // var data = email.text($.html())
            // // console.log(data)
            // setemail(data.emails)


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

  });


  crawler.on("fetcherror", function(queueItem, response) {
    console.log('fetch error')
  });


  crawler.on("complete", function() {
      console.log("complete");
      // crawler.stop()
      // mystopfunc()

              res.json({
                response:true,
                domain:req.params.domain,
                status:varEmails.length===0?'Not Found':'Found',
                emails:varEmails
              })
  });

  crawler.start();



  //
  // function mystopfunc(){
  //         res.json({
  //           response:true,
  //           domain:req.params.domain,
  //           status:varEmails.length===0?'Not Found':'Found',
  //           emails:varEmails
  //         })
  // }



// setTimeout(() => {
//   crawler.stop()
//   mystopfunc()
//
// }, 15000)
//////////// backup simple crawller ////////////















//   //backup
//   var Crawler = require("crawler");
//
//
//   var c = new Crawler({
//       maxConnections : 11,
//       // rateLimit: 500,
//       retries:0,
//       timeout:3000,
//
//       // agentClass: Agent, //adding socks5 https agent
//       // method: 'GET',
//       // strictSSL: true,
//       // agentOptions: {
//       //     socksHost: 'localhost',
//       //     socksPort: 5004
//       // },
//
//       headers: {
//         'User-Agent': 'Mozilla/5.0', // default header
//       },
//       // This will be called for each crawled page
//       callback : function (error, res, done) {
//           if(error){
//               console.log('error');
//           }else{
//               var $ = res.$;
//               // // $ is Cheerio by default
//               // //a lean implementation of core jQuery designed specifically for the server
//               // // console.log($("title").text());
//               // // console.log($.html());
//               //
//               // var data = email.text($.html())
//               // console.log(data)
//               // setemail(data.emails);
//
//               if(!$){
//
//               }else{
//                 var data = email.text($.html())
//                 // console.log(data)
//                 setemail(data.emails, );
//                 // console.log(data.emails)
//
//                 // if(data.emails.length>50){
//                 //
//                 // }else{
//                 //   setemail(data.emails);
//                 // }
//
//                 $('a[href^="tel:"]').each((i, link) => {
//                   const href = link.attribs.href;
//                   var thref = href.substring(4);
//                   console.log(thref)
//
//                   // var tdataarray=[thref];
//                   // tdataarray.forEach(function(value){
//                   //   if (varPhones.indexOf(value)==-1) varPhones.push(value);
//                   // });
//                 });
//
//
//                 //phones
//
//
//
//               }
//
//
//           }
//           done();
//       }
//   });
//
//
//
//   // Queue just one URL, with default callback
//   // c.queue('http://www.qtonix.com');
//
//   // Queue a list of URLs
//   c.queue([
//     'http://'+req.params.domain,
//     'http://'+req.params.domain+'/contact-us',
//     'http://'+req.params.domain+'/contactus',
//     'http://'+req.params.domain+'/contact',
//     'http://'+req.params.domain+'/contactus.html',
//     'http://'+req.params.domain+'/contactus.php',
//     'http://'+req.params.domain+'/pages/contact-us',
//     'http://'+req.params.domain+'/pages/contactus',
//     'http://'+req.params.domain+'/pages/contact',
//     'http://'+req.params.domain+'/pages/about-us',
//     'http://'+req.params.domain+'/about-us',
//     'http://'+req.params.domain+'/aboutus',
//     'http://'+req.params.domain+'/policies/refund-policy',
// ]);
//
//
// c.on('drain',function(){
//       console.log(varEmails)
//       res.json({
//         response:true,
//         domain:req.params.domain,
//         status:varEmails.length===0?'Not Found':'Found',
//         emails:varEmails
//       })
// });
//
//
// c.queue({uri: 'http://'+req.params.domain,preRequest: (options, done) => { setTimeout(() => {  done(); }, 2000);}});
// c.queue({uri: 'http://'+req.params.domain+'/contact-us',preRequest: (options, done) => { setTimeout(() => {  done(); }, 2000);}});
// c.queue({uri: 'http://'+req.params.domain+'/contactus',preRequest: (options, done) => { setTimeout(() => {  done(); }, 2000);}});
// c.queue({uri: 'http://'+req.params.domain+'/contactus.html',preRequest: (options, done) => { setTimeout(() => {  done(); }, 2000);}});
// c.queue({uri: 'http://'+req.params.domain+'/contactus.php',preRequest: (options, done) => { setTimeout(() => {  done(); }, 2000);}});
// c.queue({uri: 'http://'+req.params.domain+'/pages/contact-us',preRequest: (options, done) => { setTimeout(() => {  done(); }, 2000);}});
// c.queue({uri: 'http://'+req.params.domain+'/pages/contactus',preRequest: (options, done) => { setTimeout(() => {  done(); }, 2000);}});
// c.queue({uri: 'http://'+req.params.domain+'/pages/contact',preRequest: (options, done) => { setTimeout(() => {  done(); }, 2000);}});
// c.queue({uri: 'http://'+req.params.domain+'/pages/about-us',preRequest: (options, done) => { setTimeout(() => {  done(); }, 2000);}});
// c.queue({uri: 'http://'+req.params.domain+'/about-us',preRequest: (options, done) => { setTimeout(() => {  done(); }, 2000);}});
// c.queue({uri: 'http://'+req.params.domain+'/aboutus',preRequest: (options, done) => { setTimeout(() => {  done(); }, 2000);}});
//
//
// backup











// try {
//
//
//   setTimeout(function() {
//       var Crawler = require("crawler");
//       var c = new Crawler({
//           maxConnections : 11,
//           // rateLimit: 500,
//           retries:0,
//           timeout:9000,
//           headers: {
//             'User-Agent': 'Mozilla/5.0', // default header
//           },
//           // This will be called for each crawled page
//           callback : function (error, res, done) {
//               if(error){
//                   console.log('error');
//               }else{
//                   var $ = res.$;
//                   if(!$){
//                   }else{
//                     var data = email.text($.html())
//                     // console.log(data)
//                     setemail(data.emails, );
//                     // console.log(data.emails)
//
//                     // if(data.emails.length>50){
//                     //
//                     // }else{
//                     //   setemail(data.emails);
//                     // }
//
//
//                     $('a[href^="mailto:"]').each((i, link) => {
//                       const href = link.attribs.href;
//                       var thref = href.substring(7).toLowerCase();
//                       if(ValidateEmail(thref)){
//                         var tdataarray=[thref];
//                         tdataarray.forEach(function(value){
//                           if (varEmails.indexOf(value)==-1) varEmails.push(value);
//                         });
//                       }
//                     });
//
//
//                     $('a[href^="tel:"]').each((i, link) => {
//                       const href = link.attribs.href;
//                       var thref = href.substring(4);
//                       var tdataarray=[thref];
//                       tdataarray.forEach(function(value){
//                         if (varPhones.indexOf(value)==-1) varPhones.push(value);
//                       });
//                     });
//
//
//                     //phones
//
//
//
//                   }
//
//
//               }
//               done();
//           }
//       });
//
//
//
//       // Queue just one URL, with default callback
//       // c.queue('http://www.qtonix.com');
//
//       // Queue a list of URLs
//       c.queue([
//         'http://'+req.params.domain,
//         'http://'+req.params.domain+'/contact-us/',
//         'http://'+req.params.domain+'/contactus/',
//         'http://'+req.params.domain+'/contact/',
//         'http://'+req.params.domain+'/contactus.html',
//         'http://'+req.params.domain+'/contactus.php',
//         'http://'+req.params.domain+'/pages/contact-us/',
//         'http://'+req.params.domain+'/pages/contactus/',
//         'http://'+req.params.domain+'/pages/contact/',
//         'http://'+req.params.domain+'/pages/about-us/',
//         'http://'+req.params.domain+'/about-us/',
//         'http://'+req.params.domain+'/aboutus/',
//
//         'http://'+req.params.domain+'/policies/refund-policy/',
//         'http://'+req.params.domain+'/pages/returns/',
//         'http://'+req.params.domain+'/pages/policies/',
//
//
//
//
//
//     ]);
//
//
//     c.on('drain',function(){
//           console.log(varEmails)
//           res.json({
//             response:true,
//             // domain:req.params.domain,
//             status:varEmails.length===0?'Not Found':'Found',
//             emails:varEmails,
//             tel:varPhones
//           })
//     });
//
//
//     // c.queue({uri: 'http://'+req.params.domain,preRequest: (options, done) => { setTimeout(() => {  done(); }, 2000);}});
//     // c.queue({uri: 'http://'+req.params.domain+'/contact-us',preRequest: (options, done) => { setTimeout(() => {  done(); }, 2000);}});
//     // c.queue({uri: 'http://'+req.params.domain+'/contactus',preRequest: (options, done) => { setTimeout(() => {  done(); }, 2000);}});
//     // c.queue({uri: 'http://'+req.params.domain+'/contactus.html',preRequest: (options, done) => { setTimeout(() => {  done(); }, 2000);}});
//     // c.queue({uri: 'http://'+req.params.domain+'/contactus.php',preRequest: (options, done) => { setTimeout(() => {  done(); }, 2000);}});
//     // c.queue({uri: 'http://'+req.params.domain+'/pages/contact-us',preRequest: (options, done) => { setTimeout(() => {  done(); }, 2000);}});
//     // c.queue({uri: 'http://'+req.params.domain+'/pages/contactus',preRequest: (options, done) => { setTimeout(() => {  done(); }, 2000);}});
//     // c.queue({uri: 'http://'+req.params.domain+'/pages/contact',preRequest: (options, done) => { setTimeout(() => {  done(); }, 2000);}});
//     // c.queue({uri: 'http://'+req.params.domain+'/pages/about-us',preRequest: (options, done) => { setTimeout(() => {  done(); }, 2000);}});
//     // c.queue({uri: 'http://'+req.params.domain+'/about-us',preRequest: (options, done) => { setTimeout(() => {  done(); }, 2000);}});
//     // c.queue({uri: 'http://'+req.params.domain+'/aboutus',preRequest: (options, done) => { setTimeout(() => {  done(); }, 2000);}});
//
//
//
//   }, 1000);
//
//
// } catch (err) {
//   alert( "won't work" );
//
//   res.json({
//     response:false,
//   })
// }






}












module.exports={websitemultidomainextract,fetchdomain};
