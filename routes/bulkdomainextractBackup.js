const express = require('express');
const router = express.Router();



const BulkDomainExtractController = require('../controllers/BulkDomainExtractController');




router.get('/testdomainextrat/:domain',BulkDomainExtractController.testDomainExtract);

router.get('/testnow/:domain',BulkDomainExtractController.testnow);






module.exports=router;
