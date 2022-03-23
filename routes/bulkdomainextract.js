const express = require('express');
const router = express.Router();



const BulkDomainExtractController = require('../controllers/BulkDomainExtractController');
const BulkDomainExtractControllerMulti = require('../controllers/BulkDomainExtractControllerMulti');

const BulkDomainExtractControllerBackup = require('../controllers/BulkDomainExtractControllerBackup');
const DomainExtractPuppeteerController = require('../controllers/DomainExtractPuppeteerController');







router.get('/testdomainextrat/:domain',BulkDomainExtractController.testDomainExtract);
router.get('/singledomainextract/:domain',BulkDomainExtractController.singledomainextract);
router.get('/fetchdomain/quick/:domain',BulkDomainExtractControllerMulti.fetchdomain);
router.post('/websitesingledomainextract',BulkDomainExtractController.websitesingledomainextract);
router.post('/websitemultidomainextract',BulkDomainExtractControllerMulti.websitemultidomainextract);
router.post('/bulkmultiextract',BulkDomainExtractControllerBackup.bulkextractbyuser);
router.get('/pupextract/:domain',DomainExtractPuppeteerController.pupextract);




module.exports=router;
