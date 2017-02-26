var express = require('express');
var router = express.Router();

const mechaConf = require('./../mechafile.json')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {mechaConf: mechaConf });
});

module.exports = router;
