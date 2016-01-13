var express = require('express');
var router = express.Router();

router.get('/:id/:part?', function(req, res, next) {
  var id   = req.params.id,
      part = req.params.part;

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
  } else if (id == 5 && part == 1) {
    res.render('assignment_5_1', {
      title: 'Assignment 5, Part 1'
    });
  } else if (id == 5 && part == 2) {
    res.render('assignment_5_2', {
      title: 'Assignment 5, Part 2'
    });
  } else if (id == 5) {
    res.render('assignment_5', {
      title: 'Assignment 5'
    });
  } else if (id == 6) {
    res.render('assignment_6', {
      title: 'Final project'
    });
  } else  {
    res.render('error', {
      message: 'Coming soon!'
    });
  }
});

module.exports = router;
