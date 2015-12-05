var express = require('express');
var router = express.Router();

router.get('/:id', function(req, res, next) {
  var id = req.params.id;
  if (id == 1) {
    res.render('assignment_one', {
      title: 'Assignment 1'
    });
  } else if (id == 2) {
    res.render('assignment_two', {
      title: 'Assignment 2'
    });
  } else if (id == 3) {
    res.render('assignment_three', {
      title: 'Assignment 3'
    });
  } else {
    res.render('error', {
      message: 'Coming soon!'
    });
  }
});

module.exports = router;
