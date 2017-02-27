var express = require('express');
var router = express.Router();

var fs = require('fs');

const mechaConf = require('../mechafile.json')

var repo2Path = require("../repo2Path");

router.get('/:domain/:repo/:branch/:sha', function(req, res) {
  const domain = req.params.domain;
  const repo = req.params.repo;
  const branch = req.params.branch;
  const sha = req.params.sha;
  res.render('log', {
   params: req.params,
   logFiles: fs.readdirSync(`./log/${domain}/${repo}/${branch}/${sha}`).map(function(l){
    return `/log/${domain}/${repo}/${branch}/${sha}/${l}`
   })
  });
});

router.get('/:domain/:repo/:branch', function(req, res) {
  const domain = req.params.domain;
  const repo = req.params.repo;
  const branch = req.params.branch;
  res.render('log', {
   params: req.params,
   logFiles: fs.readdirSync(`./log/${domain}/${repo}/${branch}`).map(function(l){
    return `/log/${domain}/${repo}/${branch}/${l}`
   })
  });
});

module.exports = router;
