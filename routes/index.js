var fs = require('fs');

var express = require('express');
var router = express.Router();
var repo2Path = require('../repo2Path.js')
var path2repo = require('../path2repo.js')

const mechaConf = require('./../mechafile.json')

/* GET home page. */
router.get('/', function(req, res, next) {

  var cIDs = Object.keys(mechaConf.cIDs).map(function(cidK){
    var cid2Return = mechaConf.cIDs[cidK];

    cid2Return.name = cidK

    const domain = cidK.split(':')[0].replace('.', '_');
    const repo = cidK.split(':')[1].split('#')[0].split('.git')[0].replace('/', '_');
    const branch = cidK.split(':')[1].split('#')[1];

    cid2Return.branch = branch
    cid2Return.integrationResult = (cid2Return.filters || []).map(function(f){
      try {
        return fs.readFileSync(`./log/${domain}/${repo}/${branch}/${branch}/integrate.dockerrun.${f.name}.exit`)
      } catch (err) {
        f.out = err.toString()
      }
      return f;
    }).every(function(e){
      return e == 0
    })

    cid2Return.deploymentResult = (cid2Return.postHooks || []).map(function(f){
      try {
        return fs.readFileSync(`./log/${domain}/${repo}/${branch}/${branch}/deploy.dockerrun.${f.name}.exit`)
      } catch (err) {
        f.out = err.toString()
      }
    }).every(function(e){
      return e == 0
    });

    return cid2Return;
  })

  res.render('index', {cIDs: cIDs, repo2Path:repo2Path });
});

module.exports = router;
