var fs = require('fs');
const exec = require('child_process').exec;

var express = require('express');
var router = express.Router();

const mechaConf = require('../mechafile.json')

var filendir = require('filendir');
var repo2Path = require("../repo2Path");

const mechanize = function(cid, sha, filter){
  const path = repo2Path(cid);
  const dockerImage = path.toLowerCase().replace('/', '-');
  const logsFolder = `./log/${path}/${sha}`

  var preCommand = `rm -rf ${logsFolder};\
  mkdir -p ${logsFolder};\
  cd ./pen/${path} &&\
  git fetch origin &&\
  git checkout ${sha} &&\
  docker build -t ${dockerImage} .`

  // command = command + " && " + mechaConf.cIDs[cid].filters.map(function(fltr, ndx){
  //   return `docker attach $(docker run -i -d ${dockerImage} ${fltr.cmd}) &> ../../../../log/${path}/${sha}/${fltr.name}.out && echo $? > ../../../../log/${path}/${sha}/${fltr.name}.exit`
  // }).join(' && ');

  console.log(preCommand)
  exec(preCommand , (error, stdout, stderr) => {
    filendir.writeFile(`${logsFolder}/integrate.pre.cmd`, `${preCommand}`, function(){})
    filendir.writeFile(`${logsFolder}/integrate.pre.out`, stdout, function(){})
    filendir.writeFile(`${logsFolder}/integrate.pre.err`, stderr, function(){})

    if (error != null){
      filendir.writeFile(`${logsFolder}/integrate.pre.exit`, error.toString(), function(){})
    } else {
      filendir.writeFile(`${logsFolder}/integrate.pre.exit`, 0, function(){})
    }

  });
}

/* POST fakewebhook page. */
router.post('/', function(req, res) {
  console.log(req.body)
  const sha = req.body.sha.trim();
  if (sha != '') {
    mechanize(req.body.repo, sha)
    res.redirect(`/log/${repo2Path(req.body.repo)}/${sha}/`)
  }

  res.send("you need to specify a SHA");
});

module.exports = router;
