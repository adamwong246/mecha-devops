var fs = require('fs');
const exec = require('child_process').exec;

var express = require('express');
var router = express.Router();

const mechaConf = require('../mechafile.json')

var filendir = require('filendir');
var repo2Path = require("../repo2Path");

const mechanize = function(cid, sha, filter){
  const path = repo2Path(cid);
  const dockerImage = path.toLowerCase();
  const logsFolder = `./log/${path}/${sha}`

  var command = `rm -rf ${logsFolder};\
  mkdir -p ${logsFolder};\
  cd ./pen/${path} &&\
  git fetch origin &&\
  git checkout ${sha} &&\
  docker build -t ${dockerImage} .`

  command = command + " && " + mechaConf.cIDs[cid].filters.map(function(fltr, ndx){
    return `docker attach $(docker run -i -d ${dockerImage} ${fltr.cmd}) &> ../../log/${path}/${sha}/${fltr.name}.out`
  }).join(' && ');

  console.log(command)
  exec(command , (error, stdout, stderr) => {
    filendir.writeFile(`${logsFolder}/mecha.integrate.cmd`, `${command}`, function(){})
    filendir.writeFile(`${logsFolder}/mecha.integrate.log.out`, stdout, function(){})
    filendir.writeFile(`${logsFolder}/mecha.integrate.log.err`, stderr, function(){})

    if (error != null){
      filendir.writeFile(`${logsFolder}/mecha.integrate.err`, error.toString(), function(){})
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
