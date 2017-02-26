var express = require('express');
var router = express.Router();

var fs = require('fs');

const db = require('.././db')

var repo2Path = require("../repo2Path");

router.get('/:repo/:sha', function(req, res) {
  const repo = req.params.repo;
  res.render('log', {
   params: req.params,
   logFiles: fs.readdirSync(`./log/${repo2Path(repo)}/${req.params.sha}`).map(function(l){
    return `/log/${repo2Path(repo)}/${req.params.sha}/${l}`
   })
  });

});

router.get('/:repo', function(req, res) {
  const repo = req.params.repo;
  res.render('log', {
   params: req.params,
   logFiles: fs.readdirSync(`./log/${repo2Path(repo)}`).map(function(l){
    return `/log/${repo2Path(repo)}/${l}`
   })
  });
});

module.exports = router;
