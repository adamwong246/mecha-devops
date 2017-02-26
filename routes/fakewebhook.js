var fs = require('fs');
var express = require('express');
var router = express.Router();

var filendir = require('filendir');

const spawn = require('child_process').spawn;
const exec = require('child_process').exec;

const db = require('.././db')

const mechanize = function(cid, sha, filter){
  const splitId = cid.split('#')
  const name = splitId[0]
  const branch = splitId[1];
  const folder = name.split('.git')[0]
  const dockerImage = folder.toLowerCase();
  const logsFolder = `./log/${folder}/${sha}`

  var command = `mkdir -p ${logsFolder};\
  cd pen/${folder.split('/')[1]};\
  git fetch origin;\
  git checkout ${sha};\
  docker build -t ${dockerImage} .`

  command = command + " && " + db.cIDs[cid].filters.map(function(fltr, ndx){
    return `docker attach $(docker run -i -d ${dockerImage} ${fltr.cmd}) &> ../../log/${folder}/${sha}/${fltr.name}.log`
  }).join(' && ');

  exec(command , (error, stdout, stderr) => {
    filendir.writeFile(`${logsFolder}/mecha.cmd`, command, function(){})
    filendir.writeFile(`${logsFolder}/mecha.log`, stdout, function(){})
    filendir.writeFile(`${logsFolder}/mecha.err`, stderr, function(){})
  });

}

/* POST fakewebhook page. */
router.post('/', function(req, res) {

  if (req.body.sha != '') {
    mechanize(req.body.repo, req.body.sha, req.body.filter)
    res.redirect(`/log/${req.body.repo.split('#')[0].split('.git')[0]}/${req.body.sha}/`)
  }

  res.send("wtf")
});

module.exports = router;
