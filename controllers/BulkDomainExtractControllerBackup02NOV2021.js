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



      const axiosdata = await axios.get(`http://${domain}`,{timeout:2000});
      // var axiosdata = await axios.get('https://qtonix.com');

      let $ = cheerio.load(axiosdata.data);


      var varEmails=[];
      var varPhones=[];


      const string = $.html();
      let resEmail = m.emails(string)


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




    const main = await extract(req.params.domain+'/')
    // const main1 = await extract(req.params.domain+'/contact/')
    // const main2 = await extract(req.params.domain+'/contactus/')
    // const main4 = await extract(req.params.domain+'/contact-us/')
    // const main4x = await extract(req.params.domain+'/contact-us')
    // const main5 = await extract(req.params.domain+'/contactus.html')
    // const main6 = await extract(req.params.domain+'/contact.html')
    // const main7 = await extract(req.params.domain+'/contact-us.html')
    // const main8 = await extract(req.params.domain+'/contactus.php')
    // const main9 = await extract(req.params.domain+'/contact-us.php')
    // const main3 = await extract(req.params.domain+'/contact.php')
    // const main10 = await extract(req.params.domain+'/contactdetails')
    const main11 = await extract(req.params.domain+'/pages/about-us')
    // const main12 = await extract(req.params.domain+'/pages/contact-us')








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
      // if(main1.response){
      //   updateDatas(main1)
      // }
      // if(main2.response){
      //   updateDatas(main2)
      // }
      // if(main3.response){
      //   updateDatas(main3)
      // }
      // if(main4.response){
      //   updateDatas(main4)
      // }
      // if(main4x.response){
      //   updateDatas(main4x)
      // }
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
      // if(main10.response){
      //   updateDatas(main10)
      // }
      if(main11.response){
        updateDatas(main11)
      }
      // if(main12.response){
      //   updateDatas(main12)
      // }



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



const testnow =(req,res) => {
  const scrape = require('website-scraper');
  const options = {
    urls: ['http://www.qtonix.com/'],
    directory: '/path/to/save/'
  };

  scrape(options).then((result) => {

    console.log(result)
  });
}



module.exports={testDomainExtract,testnow};
