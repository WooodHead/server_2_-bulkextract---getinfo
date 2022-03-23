const response = require('express');
const email = require('node-email-extractor').default;
var validator = require("email-validator");
const rp = require('request-promise');
const cheerio = require('cheerio');
const ExtractEmail = require('extract-email');
const validatePhoneNumber = require('validate-phone-number-node-js');
const axios = require('axios');

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



function checkemailtype(email){
  if (email.match(/\.(jpe?g|png|pdf|jpg|js|css|io|gif)$/)){
    return false;
  }else{
    return true;
  }
}

function extractEmails (htmldata)
{
    return htmldata.match(/([a-zA-Z0-9._+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
}



function extractdomain(domain) {
  return new Promise((Resolve, reject) => {


    // setTimeout(() => { process.exit(1); }, 2000);

    var varEmails=[];
    var varPhones=[];
    var varFacebooks=[];
    var varInstagrams=[];
    var varTwitters=[];
    var varLinkedins=[];
    var varGoogleplus=[];
    var varYoutube=[];
    var varWhatsapp=[];
    var varPrintRest=[];
    var varSkype=[];



    var varHTML=[];


    function setemail(emaildata){
      console.log(emaildata)
      var tdataarray=emaildata;
      if(tdataarray===null){

      }else{
        tdataarray.forEach(function(tvalue){

          var value = tvalue.toLowerCase();

          // if(checkemailtype(value)){
          //   if (varEmails.indexOf(value)==-1) varEmails.push(value);
          // }

          //NEW
          var value = tvalue.toLowerCase();

          if(value.substr(value.length-1)==='.'){
            var tmpas=value.slice(0, -1);
            if(checkemailtype(tmpas)){
              if (varEmails.indexOf(tmpas)==-1) varEmails.push(tmpas);
            }
          }else{
            if(checkemailtype(value)){
              if (varEmails.indexOf(value)==-1) varEmails.push(value);
            }
          }
          //NEW



        });
      }


    }


    var Crawler = require("crawler");
    var c = new Crawler({
        maxConnections : 11,
        // rateLimit: 500,
        retries:0,
        timeout:5000,
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
                  //emails
                  setemail(extractEmails($.html()));

                  //tels
                  $('a[href^="tel:"]').each((i, link) => {
                      // const href = link.attribs.href;
                      // var thref = href.substring(4);
                      var tdataarray=[link.attribs.href.substring(4)];
                      tdataarray.forEach(function(value){
                          if (varPhones.indexOf(value)==-1) varPhones.push(value);
                      });
                  });

                  //facebook
                  $('a[href^="https://www.facebook.com/"]').each((i, link) => {
                      // const href = link.attribs.href;
                      // var thref = href.substring(4);
                      var tdataarray=[link.attribs.href];
                      tdataarray.forEach(function(value){
                          if (varFacebooks.indexOf(value)==-1) varFacebooks.push(value);
                      });
                  });


                  //instagram
                  $('a[href^="https://www.instagram.com/"]').each((i, link) => {
                      var tdataarray=[link.attribs.href];
                      tdataarray.forEach(function(value){
                          if (varInstagrams.indexOf(value)==-1) varInstagrams.push(value);
                      });
                  });

                  //twitter
                  $('a[href^="https://twitter.com/"]').each((i, link) => {
                      var tdataarray=[link.attribs.href];
                      tdataarray.forEach(function(value){
                          if (varTwitters.indexOf(value)==-1) varTwitters.push(value);
                      });
                  });

                  //linkedin
                  $('a[href^="https://www.linkedin.com/"]').each((i, link) => {
                      var tdataarray=[link.attribs.href];
                      tdataarray.forEach(function(value){
                          if (varLinkedins.indexOf(value)==-1) varLinkedins.push(value);
                      });
                  });


                  //googleplus
                  $('a[href^="https://plus.google.com/"]').each((i, link) => {
                      var tdataarray=[link.attribs.href];
                      tdataarray.forEach(function(value){
                          if (varGoogleplus.indexOf(value)==-1) varGoogleplus.push(value);
                      });
                  });

                  //youtube
                  $('a[href^="https://www.youtube.com/"]').each((i, link) => {
                      var tdataarray=[link.attribs.href];
                      tdataarray.forEach(function(value){
                          if (varYoutube.indexOf(value)==-1) varYoutube.push(value);
                      });
                  });

                  //whatsapp1
                  $('a[href^="https://chat.whatsapp.com/"]').each((i, link) => {
                      var tdataarray=[link.attribs.href];
                      tdataarray.forEach(function(value){
                          if (varWhatsapp.indexOf(value)==-1) varWhatsapp.push(value);
                      });
                  });

                  //whatsapp2
                  $('a[href^="https://wa.me/"]').each((i, link) => {
                      var tdataarray=[link.attribs.href];
                      tdataarray.forEach(function(value){
                          if (varWhatsapp.indexOf(value)==-1) varWhatsapp.push(value);
                      });
                  });

                  //pinterest
                  $('a[href^="http://pinterest.com/"]').each((i, link) => {
                      var tdataarray=[link.attribs.href];
                      tdataarray.forEach(function(value){
                          if (varPrintRest.indexOf(value)==-1) varPrintRest.push(value);
                      });
                  });

                  //skype
                  $('a[href^="skype:"]').each((i, link) => {
                      var tdataarray=[link.attribs.href];
                      tdataarray.forEach(function(value){
                          if (varSkype.indexOf(value)==-1) varSkype.push(value);
                      });
                  });



                  // facebook:$('a[href^="https://www.facebook.com/"]').attr("href")===undefined?$('a[href^="https://facebook.com/"]').attr("href"):$('a[href^="https://www.facebook.com/"]').attr("href"),
                  // instagram:$('a[href^="https://www.instagram.com/"]').attr("href")===undefined?$('a[href^="https://instagram.com/"]').attr("href"):$('a[href^="https://www.instagram.com/"]').attr("href"),
                  // twitter:$('a[href^="https://twitter.com/"]').attr("href"),
                  // linkedin:$('a[href^="https://www.linkedin.com/"]').attr("href")===undefined?$('a[href^="https://linkedin.com/"]').attr("href"):$('a[href^="https://www.linkedin.com/"]').attr("href"),
                  // googleplus:$('a[href^="https://plus.google.com/"]').attr("href"),
                  // youtube:$('a[href^="https://www.youtube.com/"]').attr("href")===undefined?$('a[href^="https://youtube.com/"]').attr("href"):$('a[href^="https://www.youtube.com/"]').attr("href"),
                  // whatsapp1:$('a[href^="https://chat.whatsapp.com/"]').attr("href"),
                  // whatsapp2:$('a[href^="https://wa.me/"]').attr("href"),



                }




            }
            done();
        }
    });


    // Queue a list of URLs
    c.queue([
      'http://'+domain,
      'http://'+domain+'/contact-us/',
      'http://'+domain+'/contactus/',
      'http://'+domain+'/contact/',
      'http://'+domain+'/pages/contact-us/',
      'http://'+domain+'/pages/contactus/',
      'http://'+domain+'/pages/contact/',
      'http://'+domain+'/about-us/',
      'http://'+domain+'/aboutus/',
   ]);


    c.on('drain',function(){
          var dataas={
            response:true,
            domain:domain,
            status:varEmails.length===0?'Not Found':'Found',
            emails:varEmails,
            tel:varPhones,
            facebook:varFacebooks,
            instagram:varInstagrams,
            twitter:varTwitters,
            linkedin:varLinkedins,
            googleplus:varGoogleplus,
            youtube:varYoutube,
            whatsapp:varWhatsapp,
            printrest:varPrintRest,
            skype:varSkype
          }
          Resolve(dataas)
    });
  })
}


// Exporting check function
module.exports = {
  extractdomain: extractdomain
};
