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




const pupextract = async (req,res) => {




  const promise = require("../scraper.js")

  // Promise handling
  promise.extractdomain(req.params.domain).then((response) => {
    console.log(response)
    res.json({
      response
    })
  }).catch((err) => {
    console.log(err)
  })



  // var varEmails=[];
  //
  //
  // const urls = [
  //   'http://qtonix.com',
  //   'http://qtonix.com/contact',
  //   'http://qtonix.com/contactus',
  //   'http://qtonix.com/contact-us',
  //
  // ]
  //
  // for (let i = 0; i < urls.length; i++) {
  //     const url = urls[i];
  //         const browser = await puppeteer.launch();
  //         const [page] = await browser.pages();
  //
  //     await page.goto(`${url}`);
  //     await page.waitForNavigation({ waitUntil: 'networkidle2' });
  //     const data = await page.evaluate(() => document.querySelector('*').outerHTML);
  //
  //         // console.log(data);
  //         let $ = cheerio.load(data);
  //         var datas = email.text(data)
  //         resEmail=datas.emails;
  //
  //
  //         resEmail.forEach((item) => {
  //           var href = item
  //           var thref = href.toLowerCase();
  //           if(ValidateEmail(thref)){
  //             var tdataarray=[thref];
  //             tdataarray.forEach(function(value){
  //               if (varEmails.indexOf(value)==-1) varEmails.push(value);
  //             });
  //           }
  //         });
  // }
  //
  //     res.json({
  //       response:true,
  //       data:varEmails
  //     })

}












module.exports={pupextract};
