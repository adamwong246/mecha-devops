const exec = require('child_process').exec;

var express = require('express');
var router = express.Router();

var fs = require('fs');

var mechaConf = JSON.parse(fs.readFileSync('./mechafile.json', 'utf8'));

const path2repo = require("../path2repo");
const repo2Path = require('../repo2Path');

router.get('/:domain/:repo/:branch', function(req, res) {
  const domain = req.params.domain;
  const repo = req.params.repo;
  const branch = req.params.branch;

  var cid2Return = mechaConf.cIDs[path2repo(domain, repo, branch)]

  cid2Return.filters = (cid2Return.filters || []).map(function(f){
    try {
      f.exit = fs.readFileSync(`./log/${domain}/${repo}/${branch}/${branch}/integrate/tests/${f.name}.exit`)
    } catch (err) {
      f.exit = err.toString()
    }
    return f
  })

  cid2Return.postHooks = (cid2Return.postHooks || []).map(function(f){
    try {
      f.exit = fs.readFileSync(`./log/${domain}/${repo}/${branch}/${branch}/deploy.dockerrun.${f.name}.exit`)
    } catch (err) {
      f.exit = err.toString()
    }
    return f
  })

  const builds = function(){
    try {
      return fs.readdirSync(`./log/${domain}/${repo}/${branch}`)
    } catch (err) {
      return []
    }
  }().map(function(sha){
    return {
      sha: sha,
      intExit: cid2Return.filters.map(function(f){
        try {
          return fs.readFileSync(`./log/${domain}/${repo}/${branch}/${sha}/integrate/${f.name}.exit`)
        } catch (err) {
          f.out = err.toString()
        }
        return f;
      }).every(function(e){
        return e == 0
      }),
      depExit: cid2Return.filters.map(function(f){
        try {
          return fs.readFileSync(`./log/${domain}/${repo}/${branch}/${sha}/deploy.${f.name}.exit`)
        } catch (err) {
          f.out = err.toString()
        }
        return f;
      }).every(function(e){
        return e == 0
      })

    }
  })

  res.render('cid', {
    params: req.params,
    cid: cid2Return,
    repo: path2repo(domain, repo, branch),
    builds: builds
  });
})

router.get('/:domain/:repo/:branch/:sha', function(req, res) {
  const domain = req.params.domain;
  const repo = req.params.repo;
  const branch = req.params.branch;
  const sha = req.params.sha;

  const conf = mechaConf.cIDs[path2repo(domain, repo, branch)]

  var locals = {
    domain: domain, repo: repo, branch: branch, sha: sha,
    conf: conf,
    filters: conf.filters.map(function(f){
      try {
        f.exit = fs.readFileSync(`./log/${domain}/${repo}/${branch}/${sha}/integrate/tests/${f.name}.exit`)
      } catch (err) {
        f.exit = err.toString()
      }
      return f;
    }),
    postHooks: conf.postHooks.map(function(f){
      try {
        f.exit = fs.readFileSync(`./log/${domain}/${repo}/${branch}/${sha}/deploy/deployHook/${f.name}.exit`)
      } catch (err) {
        f.exit = err.toString()
      }
      return f;
    }),
    'logs': {}
  }

  try {
    locals.integratePreExit = fs.readFileSync(`./log/${domain}/${repo}/${branch}/${sha}/integrate/pre.exit`)
  } catch (err) {
    locals.integratePreExit = err.toString()
  }

  res.render('sha', locals);
});


module.exports = router;
