var fs = require('fs');
var express = require('express');
var router = express.Router();

var filendir = require('filendir');
var repo2Path = require("../repo2Path");

const spawn = require('child_process').spawn;
const exec = require('child_process').exec;

const db = require('.././db')

const mechanize = function(cid, sha, filter){
  const path = repo2Path(cid);
  const dockerImage = path.toLowerCase();
  const logsFolder = `./log/${path}/${sha}`

  var command = `mkdir -p ${logsFolder};\
  cd ./pen/${path};\
  git fetch origin;\
  git checkout ${sha};\
  docker build -t ${dockerImage} .`

  command = command + " && " + db.cIDs[cid].filters.map(function(fltr, ndx){
    return `docker attach $(docker run -i -d ${dockerImage} ${fltr.cmd}) &> ../../log/${path}/${sha}/${fltr.name}.log`
  }).join(' && ');

  console.log(command)
  exec(command , (error, stdout, stderr) => {
    filendir.writeFile(`${logsFolder}/mecha.cmd`, command, function(){})
    filendir.writeFile(`${logsFolder}/mecha.log`, stdout, function(){})
    filendir.writeFile(`${logsFolder}/mecha.err`, stderr, function(){})
  });

}

/* POST fakewebhook page. */
router.post('/', function(req, res) {
  const sha = req.body.sha.trim();
  if (sha != '') {
    mechanize(req.body.repo, sha, req.body.filter)
    res.redirect(`/log/${repo2Path(req.body.repo)}/${sha}/`)
  }

  res.send("wtf")
});

module.exports = router;
