var express = require('express');
var router = express.Router();
var repo2Path = require('../repo2Path.js')

const mechaConf = require('./../mechafile.json')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {mechaConf: mechaConf, repo2Path:repo2Path });
});

module.exports = router;
