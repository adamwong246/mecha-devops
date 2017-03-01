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

  res.render('cid', {
   params: req.params,
   cid: mechaConf.cIDs[path2repo(domain, repo, branch)],
   repo: path2repo(domain, repo, branch),
   repo2Path: repo2Path,
   path2repo: path2repo,
   builds: function(){
     try {
       return fs.readdirSync(`./log/${domain}/${repo}/${branch}`)
     } catch (err) {
       return []
     }
   }()
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
          f.exit = fs.readFileSync(`./log/${domain}/${repo}/${branch}/${sha}/integrate.dockerrun.${f.name}.exit`)
        } catch (err) {
          f.exit = err.toString()
        }

        try {
           f.cmd = fs.readFileSync(`./log/${domain}/${repo}/${branch}/${sha}/integrate.dockerrun.${f.name}.cmd`)
         } catch (err) {
           f.cmd = err.toString()
         }

        return f;
      }),
     'logs': {}
   }

   locals.steps = ['pre', 'dockerrun'];
   locals.logTypes = ['exit', 'cmd', 'out', 'err'];

   locals.steps.forEach(function(a){
     locals['logs'][a] = {};
     locals.logTypes.forEach(function(b){
       try {
         locals['logs'][a][b] =  fs.readFileSync(`./log/${domain}/${repo}/${branch}/${sha}/integrate.${a}.${b}`)
       } catch (err) {
         locals['logs'][a][b] =  err.toString()
       }
     })
   })


   res.render('sha', locals);
});


module.exports = router;
