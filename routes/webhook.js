var fs = require('fs');
const exec = require('child_process').exec;

var express = require('express');
var router = express.Router();

const mechaConf = require('../mechafile.json')
//
// var filendir = require('filendir');
// var repo2Path = require("../repo2Path");
//
// const mechanize = function(cid, sha, filter){
//   const path = repo2Path(cid);
//   const dockerImage = path.toLowerCase();
//   const logsFolder = `./log/${path}/${sha}`
//
//   var command = `rm -rf ${logsFolder};\
//   mkdir -p ${logsFolder};\
//   cd ./pen/${path} &&\
//   git fetch origin &&\
//   git checkout master &&\
//   docker build -t ${dockerImage} .`
//
//   command = command + " && " + mechaConf.cIDs[cid].filters.map(function(fltr, ndx){
//     return `docker attach $(docker run -i -d ${dockerImage} ${fltr.cmd}) &> ../../log/${path}/${sha}/${fltr.name}.log`
//   }).join(' && ');
//
//   exec(command , (error, stdout, stderr) => {
//     filendir.writeFile(`${logsFolder}/mecha.cmd`, command, function(){})
//     filendir.writeFile(`${logsFolder}/mecha.stdout`, stdout, function(){})
//     filendir.writeFile(`${logsFolder}/mecha.stderr`, stderr, function(){})
//     if (error != null){
//       filendir.writeFile(`${logsFolder}/mecha.err`, error.toString(), function(){})
//     }
//   });
// }

/* POST webhook page. */
router.post('/', function(req, res) {
  console.log('hello webhook')
  res.send('hello world');
});

module.exports = router;
