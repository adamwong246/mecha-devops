var express = require('express');
var router = express.Router();

var fs = require('fs');

const db = require('.././db')

router.get('/:user/:repo/:sha', function(req, res) {
  console.log("sha logger")
  res.render('log', {
   params: req.params,
   logFiles: fs.readdirSync(`./log/${req.params.user}/${req.params.repo}/${req.params.sha}`).map(function(l){
    return `/log/${req.params.user}/${req.params.repo}/${req.params.sha}/${l}`
   })
  });

});

router.get('/:user/:repo', function(req, res) {
  res.render('log', {
   params: req.params,
   logFiles: fs.readdirSync(`./log/${req.params.user}/${req.params.repo}`).map(function(l){
    return `/log/${req.params.user}/${req.params.repo}/${l}`
   })
  });
});

module.exports = router;
