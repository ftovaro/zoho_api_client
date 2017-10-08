var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Searcher' });
});
router.get('/submit', function(req, res, next) {
  res.render('submit', { title: 'Searcher' });
});

module.exports = router;
