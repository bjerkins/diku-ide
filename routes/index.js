var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'IDE 2015', 
    current: 'home'
  });
});

module.exports = router;
