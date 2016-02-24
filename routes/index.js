var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'The U.S. Integrated Ocean Observing System (IOOS)' });
});

module.exports = router;
