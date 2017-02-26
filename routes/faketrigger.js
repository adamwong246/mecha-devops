var fs = require('fs');
const exec = require('child_process').exec;

var express = require('express');
var router = express.Router();

const db = require('.././db')

var filendir = require('filendir');
var repo2Path = require("../repo2Path");

const mechanize = function(cid, sha, filter){
  const path = repo2Path(cid);
  const logsFolder = `./log/${path}/${sha}`

  var command = `git fetch origin &&\
  git checkout ${sha}`

  command = command + " && " + db.cIDs[cid].hook

  console.log(command)
  exec(command , (error, stdout, stderr) => {
    filendir.writeFile(`${logsFolder}/mecha.deploy.cmd`, `${command}`, function(){})
    filendir.writeFile(`${logsFolder}/mecha.deploy.log.out`, stdout, function(){})
    filendir.writeFile(`${logsFolder}/mecha.deploy.log.err`, stderr, function(){})

    if (error != null){
      filendir.writeFile(`${logsFolder}/mecha.deploy.err`, error.toString(), function(){})
      console.log(`build for ${sha} failed`);
    } else {
      console.log(`build for ${sha} succeeded!`);
    }

  });
}

/* POST fakewebhook page. */
router.post('/', function(req, res) {
 const sha = req.body.sha.trim();
 if (sha != '') {
   mechanize(req.body.repo, sha, req.body.filter)
   res.redirect(`/log/${repo2Path(req.body.repo)}/${sha}/`)
 }

 res.send("you need to specify a SHA");
});

module.exports = router;
