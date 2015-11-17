var express = require('express');
var router = express.Router();

router.get('/:id', function(req, res, next) {
  var id = req.params.id;
  if (id == 1) {
    res.render('assignment_one');
  } else {
    res.render('error', {
      message: 'Coming soon!'
    });
  }
});

module.exports = router;
