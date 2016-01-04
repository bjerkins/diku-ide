var express = require('express');
var router = express.Router();

router.get('/:id', function(req, res, next) {
  var id = req.params.id;
  if (id == 1) {
    res.render('assignment_1', {
      title: 'Assignment 1'
    });
  } else if (id == 2) {
    res.render('assignment_2', {
      title: 'Assignment 2'
    });
  } else if (id == 3) {
    res.render('assignment_3', {
      title: 'Assignment 3'
    });
  } else if (id == 4) {
    res.render('assignment_4', {
      title: 'Assignment 4'
    });
  } else if (id == 5) {
    res.render('assignment_5', {
      title: 'Assignment 5'
    });
  } else {
    res.render('error', {
      message: 'Coming soon!'
    });
  }
});

module.exports = router;
