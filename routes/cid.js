var express = require('express');
var router = express.Router();

var fs = require('fs');

const mechaConf = require('../mechafile.json')

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
   const filters = conf.filters.map(function(f){
     try {
        f.log = fs.readFileSync(`./log/${domain}/${repo}/${branch}/${sha}/${f.name}.out`) || "?"
      } catch (err) {
        f.log = err.toString()
      }

    try {
       f.exit = fs.readFileSync(`./log/${domain}/${repo}/${branch}/${sha}/${f.name}.exit`) || "?"
     } catch (err) {
       f.exit = err.toString()
     }


     return f
   })

   res.render('sha', {
     domain: domain,
     repo: repo,
     sha: sha,
     branch: branch,
     cmd: fs.readFileSync(`./log/${domain}/${repo}/${branch}/${sha}/integrate.pre.cmd`),
     stdout: fs.readFileSync(`./log/${domain}/${repo}/${branch}/${sha}/integrate.pre.out`),
     stderr: fs.readFileSync(`./log/${domain}/${repo}/${branch}/${sha}/integrate.pre.err`),
     filterResults: filters
   });
});


module.exports = router;
