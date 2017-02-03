var express = require('express');
var router = express.Router();
var pgp = require('pg-promise')();
var db = pgp('postgres://postgres:postgres@localhost:5432/comt');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'The U.S. Integrated Ocean Observing System (IOOS)' });
});

/* GET region map page. */
router.get('/regions', function(req, res, next) {
  res.render('regions', { title: 'The U.S. Integrated Ocean Observing System (IOOS) | Regions Map' });
});

/* GET contact us page. */
router.get('/contact-us', function(req, res, next) {
  res.render('contact-us', { title: 'The U.S. Integrated Ocean Observing System (IOOS) | Contact Us' });
});

/* GET comt projects page. */
router.get('/comt-projects', function(req, res, next) {
  db.many('SELECT id, title, team as "Project Team", overview as "Project Overview and Results", ' +
  'model_desc as "Model Descriptions", sub_project_desc as "Sub-Project Descriptions", ' +
  'pubs as "Publications" FROM projects ORDER BY id ASC', [true])
  .then(function (data) {
    res.render('comt-projects', {
      title: 'The U.S. Integrated Ocean Observing System (IOOS) | Coastal and Ocean Modeling Testbed Projects',
      projects: data });
  })
  .catch(function (error) {
    console.log('ERROR:', error);
  });
});

module.exports = router;
