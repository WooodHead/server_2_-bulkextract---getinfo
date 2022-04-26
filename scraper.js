const response = require("express");
const email = require("node-email-extractor").default;
var validator = require("email-validator");
const rp = require("request-promise");
const cheerio = require("cheerio");
const ExtractEmail = require("extract-email");
const validatePhoneNumber = require("validate-phone-number-node-js");
const axios = require("axios");
var findEmails = require('find-emails-in-string');



function validatephone(phone) {
  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (regex.test(phone)) {
    return true;
  } else {
    return false;
  }
}

function ValidateEmail(mail) {
  // if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    if (mail.slice(-3) === "jpg") {
      return false;
      if (mail.slice(-4) === "jpeg") {
        return false;
        if (mail.slice(-3) === "png") {
          return false;
    // } else if (mail.slice(-4) === "jpeg") {
    //   return false;
    // } else if (mail.slice(-3) === "png") {
    //   return false;
    // } else if (mail.slice(-3) === "gif") {
    //   return false;
    // } else if (mail.slice(-3) === "css") {
    //   return false;
    // } else if (mail.slice(-4) === "html") {
    //   return false;
    } else if (mail.slice(-11) === "example.com") {
      return false;
    } else if (mail.slice(-9) === "email.com") {
      return false;
    } else if (mail.slice(-9) === "sentry.io") {
      return false;
    } else if (mail.slice(-12) === "wixpress.com") {
      return false;

    // } else if (mail.slice(-2) === "js") {
    //   return false;
    // } else if (mail.slice(-4) === "jpeg") {
    //   return false;
    } else {
      return true;
    }
  // } else {
  //   return false;
  // }
}

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function checkemailtype(email) {
  if (email.match(/\.(jpe?g|png|pdf|jpg|webp|html|htm|js|css|io|gif)$/)) {
    return false;
  } else {
    if (ValidateEmail(email)) {
      return true;
    } else {
      return false;
    }
  }
}

function cfDecodeEmail(encodedString) {
  var email = "",
    r = parseInt(encodedString.substr(0, 2), 16),
    n,
    i;
  for (n = 2; encodedString.length - n; n += 2) {
    i = parseInt(encodedString.substr(n, 2), 16) ^ r;
    email += String.fromCharCode(i);
  }
  return email;
}

function extractEmails(htmldata) {
  return htmldata.match(
    /([a-zA-Z0-9._+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi
  );
}

function extractdomain(domain, extracttype, extractphone, extractsocial) {
  return new Promise((Resolve, reject) => {
    // setTimeout(() => { process.exit(1); }, 2000);

    var varEmails = [];
    var varPhones = [];
    var varFacebooks = [];
    var varInstagrams = [];
    var varTwitters = [];
    var varLinkedins = [];
    var varGoogleplus = [];
    var varYoutube = [];
    var varWhatsapp = [];
    var varPrintRest = [];
    var varSkype = [];

    var varHTML = [];

    function setemail(emaildata) {
      // console.log(emaildata)
      var tdataarray = emaildata;
      if (tdataarray === null) {
      } else {
        tdataarray.forEach(function (tvalue) {
          var value = tvalue.toLowerCase();

          // if(checkemailtype(value)){
          //   if (varEmails.indexOf(value)==-1) varEmails.push(value);
          // }

          //NEW
          var value = tvalue.toLowerCase();

          if (value.substr(value.length - 1) === ".") {
            var tmpas = value.slice(0, -1);
            if (checkemailtype(tmpas)) {
              if (varEmails.indexOf(tmpas) == -1) varEmails.push(tmpas);
            }
          } else {
            if (checkemailtype(value)) {
              if (varEmails.indexOf(value) == -1) varEmails.push(value);
            }
          }
          //NEW
        });
      }
    }

    var Crawler = require("crawler");
    var c = new Crawler({
      maxConnections: 20,
      // rateLimit: 500,
      // encoding:null,
      // jQuery:false,
      retries: 0,
      timeout: 7000,
      headers: {
        "User-Agent": "Mozilla/5.0", // default header
      },
      // This will be called for each crawled page
      callback: function (error, res, done) {
        if (error) {
          console.log("error");
        } else {
          var $ = res.$;
          if (!$) {
          } else {
            //emails
            // setemail(extractEmails($.html()));
            // console.log($.html())

            // console.log(extractEmails($.html()))





            if (typeof $.html() === 'string') {
              const ExtractEmail = require('extract-email');
              let dotwords = [".","[dot]","-dot-"];
              let atwords = ["@","[at]","-at-"];
              let res = ExtractEmail.String($.html(),atwords,dotwords);
              if(res.length>0){
                res.forEach((item, i) => {

                  if(ValidateEmail(item.email)){
                    if (varEmails.indexOf(item.email) == -1)
                      varEmails.push(item.email);
                  }


                });
              }


              //emails
              $("a[data-cfemail]").each((i, link) => {
                var result = Object.entries(link.attribs);
                // console.log(cfDecodeEmail(result[2][1]))
                if (varEmails.indexOf(cfDecodeEmail(result[2][1])) == -1)
                  varEmails.push(cfDecodeEmail(result[2][1]));

                console.log(link.attribs);
              });

              $("span").each(function () {
                var result = $(this).attr("data-cfemail");
                if (result !== undefined) {
                  if (varEmails.indexOf(cfDecodeEmail(result)) == -1)
                    varEmails.push(cfDecodeEmail(result));
                }
              });

              if (extractphone === "yes") {
                //tels
                $('a[href^="tel:"]').each((i, link) => {
                  // const href = link.attribs.href;
                  // var thref = href.substring(4);


                  var tdataarray = [link.attribs.href.substring(4)];
                  tdataarray.forEach(function (value) {
                    if (varPhones.indexOf(value) == -1) varPhones.push(value);
                  });
                });
              }

              if (extractsocial === "yes") {
                //facebook
                $('a[href^="https://www.facebook.com/"]').each((i, link) => {
                  // const href = link.attribs.href;
                  // var thref = href.substring(4);
                  var tdataarray = [link.attribs.href];
                  tdataarray.forEach(function (value) {
                    if (varFacebooks.indexOf(value) == -1)
                      varFacebooks.push(value);
                  });
                });
                $('a[href^="http://www.facebook.com/"]').each((i, link) => {
                  // const href = link.attribs.href;
                  // var thref = href.substring(4);
                  var tdataarray = [link.attribs.href];
                  tdataarray.forEach(function (value) {
                    if (varFacebooks.indexOf(value) == -1)
                      varFacebooks.push(value);
                  });
                });
                $('a[href^="https://facebook.com/"]').each((i, link) => {
                  // const href = link.attribs.href;
                  // var thref = href.substring(4);
                  var tdataarray = [link.attribs.href];
                  tdataarray.forEach(function (value) {
                    if (varFacebooks.indexOf(value) == -1)
                      varFacebooks.push(value);
                  });
                });

                //instagram
                $('a[href^="https://www.instagram.com/"]').each((i, link) => {
                  var tdataarray = [link.attribs.href];
                  tdataarray.forEach(function (value) {
                    if (varInstagrams.indexOf(value) == -1)
                      varInstagrams.push(value);
                  });
                });
                $('a[href^="https://instagram.com/"]').each((i, link) => {
                  var tdataarray = [link.attribs.href];
                  tdataarray.forEach(function (value) {
                    if (varInstagrams.indexOf(value) == -1)
                      varInstagrams.push(value);
                  });
                });

                //twitter
                $('a[href^="https://twitter.com/"]').each((i, link) => {
                  var tdataarray = [link.attribs.href];
                  tdataarray.forEach(function (value) {
                    if (varTwitters.indexOf(value) == -1) varTwitters.push(value);
                  });
                });
                $('a[href^="https://www.twitter.com/"]').each((i, link) => {
                  var tdataarray = [link.attribs.href];
                  tdataarray.forEach(function (value) {
                    if (varTwitters.indexOf(value) == -1) varTwitters.push(value);
                  });
                });


                //linkedin
                $('a[href^="https://www.linkedin.com/"]').each((i, link) => {
                  var tdataarray = [link.attribs.href];
                  tdataarray.forEach(function (value) {
                    if (varLinkedins.indexOf(value) == -1)
                      varLinkedins.push(value);
                  });
                });
                $('a[href^="https://linkedin.com/"]').each((i, link) => {
                  var tdataarray = [link.attribs.href];
                  tdataarray.forEach(function (value) {
                    if (varLinkedins.indexOf(value) == -1)
                      varLinkedins.push(value);
                  });
                });

                //googleplus
                $('a[href^="https://plus.google.com/"]').each((i, link) => {
                  var tdataarray = [link.attribs.href];
                  tdataarray.forEach(function (value) {
                    if (varGoogleplus.indexOf(value) == -1)
                      varGoogleplus.push(value);
                  });
                });

                //youtube
                $('a[href^="https://www.youtube.com/"]').each((i, link) => {
                  var tdataarray = [link.attribs.href];
                  tdataarray.forEach(function (value) {
                    if (varYoutube.indexOf(value) == -1) varYoutube.push(value);
                  });
                });
                $('a[href^="https://youtube.com/"]').each((i, link) => {
                  var tdataarray = [link.attribs.href];
                  tdataarray.forEach(function (value) {
                    if (varYoutube.indexOf(value) == -1) varYoutube.push(value);
                  });
                });
                $('a[href^="https://youtu.be/"]').each((i, link) => {
                  var tdataarray = [link.attribs.href];
                  tdataarray.forEach(function (value) {
                    if (varYoutube.indexOf(value) == -1) varYoutube.push(value);
                  });
                });

                //tiktok
                // https://www.tiktok.com/@lashify?lang=en

                //yelp
                // https://visiondental.com/

                //snapchat
                // $('a[href^="https://www.snapchat.com/"]').each((i, link) => {
                //     var tdataarray=[link.attribs.href];
                //     tdataarray.forEach(function(value){
                //         if (varYoutube.indexOf(value)==-1) varYoutube.push(value);
                //     });
                // });
                // $('a[href^="https://snapchat.com/"]').each((i, link) => {
                //     var tdataarray=[link.attribs.href];
                //     tdataarray.forEach(function(value){
                //         if (varYoutube.indexOf(value)==-1) varYoutube.push(value);
                //     });
                // });
                // https://bitarinstitute.com/

                //whatsapp1
                $('a[href^="https://chat.whatsapp.com/"]').each((i, link) => {
                  var tdataarray = [link.attribs.href];
                  tdataarray.forEach(function (value) {
                    if (varWhatsapp.indexOf(value) == -1) varWhatsapp.push(value);
                  });
                });

                //whatsapp2
                $('a[href^="https://wa.me/"]').each((i, link) => {
                  var tdataarray = [link.attribs.href];
                  tdataarray.forEach(function (value) {
                    if (varWhatsapp.indexOf(value) == -1) varWhatsapp.push(value);
                  });
                });

                $('a[href^="//wa.me/"]').each((i, link) => {
                  var tdataarray = [link.attribs.href];
                  tdataarray.forEach(function (value) {
                    if (varWhatsapp.indexOf(value) == -1) varWhatsapp.push(value);
                  });
                });

                //pinterest
                $('a[href^="http://pinterest.com/"]').each((i, link) => {
                  var tdataarray = [link.attribs.href];
                  tdataarray.forEach(function (value) {
                    if (varPrintRest.indexOf(value) == -1)
                      varPrintRest.push(value);
                  });
                });

                //skype
                $('a[href^="skype:"]').each((i, link) => {
                  var tdataarray = [link.attribs.href];
                  tdataarray.forEach(function (value) {
                    if (varSkype.indexOf(value) == -1) varSkype.push(value);
                  });
                });
              }



            }else{

            }




          }
        }
        done();
      },
    });

    if (extracttype === "basic") {
      // Queue a list of URLs
      c.queue(["http://" + domain]);
    }

    if (extracttype === "normal") {
      // Queue a list of URLs
      c.queue([
        "http://" + domain,
        // "http://" + domain + "/contact-us/",
        // "http://" + domain + "/contactus/",
        // "http://" + domain + "/contact/",
        // "http://" + domain + "/pages/contact-us/",
        // "http://" + domain + "/pages/contactus/",
        // "http://" + domain + "/pages/contact/",
      ]);
    }

    if (extracttype === "deep") {
      // Queue a list of URLs
      // c.queue([
      //   'http://'+domain,
      //   'http://'+domain+'/contact-us/',
      //   'http://'+domain+'/contact-us.html/',
      //   'http://'+domain+'/contactus.html/',
      //   'http://'+domain+'/contactus/',
      //   'http://'+domain+'/contact/',
      //   'http://'+domain+'/pages/contact-us/',
      //   'http://'+domain+'/pages/contactus/',
      //   'http://'+domain+'/pages/contact/',
      //   'http://'+domain+'/about-us/',
      //   'http://'+domain+'/aboutus/',
      //   'http://'+domain+'/about/',
      //   'http://'+domain+'/privacy/',
      // ]);

      c.queue([{ uri: "http://" + domain, jQuery: true }]);
      c.queue([{ uri: "http://" + domain + "/contact-us/", jQuery: true }]);
      c.queue([{ uri: "http://" + domain + "/contact-us.html/", jQuery: true }]);
      c.queue([{ uri: "http://" + domain + "/contactus/", jQuery: true }]);
      c.queue([{ uri: "http://" + domain + "/contact/", jQuery: true }]);
      c.queue([{ uri: "http://" + domain + "/contact-us.php", jQuery: true }]);
      c.queue([{ uri: "http://" + domain + "/contact-us.php", jQuery: true }]);
      c.queue([{ uri: "http://" + domain + "/contactus.php", jQuery: true }]);
      c.queue([{ uri: "http://" + domain + "/contact.php", jQuery: true }]);
      c.queue([{ uri: "http://" + domain + "/pages/contact-us/", jQuery: true }]);
      c.queue([{ uri: "http://" + domain + "/pages/contactus/", jQuery: true }]);
      c.queue([{ uri: "http://" + domain + "/pages/contact/", jQuery: true }]);
      // c.queue([{ uri: "http://" + domain + "/about-us/", jQuery: true }]);
      // c.queue([{ uri: "http://" + domain + "/aboutus/", jQuery: true }]);
      // c.queue([{ uri: "http://" + domain + "/about/", jQuery: true }]);
      // c.queue([{ uri: "http://" + domain + "/privacy/", jQuery: true }]);

      //  c.queue({
      // uri: 'http://'+domain,
      // jQuery: false,
      // });
    }

    c.on("drain", function () {
      var dataas = {
        response: true,
        domain: domain,
        status: varEmails.length === 0 ? "Not Found" : "Found",
        emails: varEmails,
        tel: varPhones,
        facebook: varFacebooks,
        instagram: varInstagrams,
        twitter: varTwitters,
        linkedin: varLinkedins,
        googleplus: varGoogleplus,
        youtube: varYoutube,
        whatsapp: varWhatsapp,
        printrest: varPrintRest,
        skype: varSkype,
      };
      Resolve(dataas);
    });
  });
}

// Exporting check function
module.exports = {
  extractdomain: extractdomain,
};
