var fs = require('fs');
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const spawnSync = require('child_process').spawnSync;
var express = require('express');
var router = express.Router();
var mechaConf = JSON.parse(fs.readFileSync('./mechafile.json', 'utf8'));
var filendir = require('filendir');
var repo2Path = require("../repo2Path");

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

const mechanize = function(cid, sha, filter){
  const path = repo2Path(cid);
  const dockerImage = path.toLowerCase().replace('/', '-') + ":" + sha
  const logsFolder = `./log/${path}/${sha}`
  var preCommand = `rm -rf ${logsFolder};\
  mkdir -p ${logsFolder}/integrate/tests;\
  cd ./pen/${path} &&\
  git fetch origin &&\
  git checkout ${sha} &&\
  docker build -t ${dockerImage} . `
  const preProcess = exec(preCommand , (error, stdout, stderr) => {
    filendir.writeFile(`${logsFolder}/integrate/pre.cmd`, `${preCommand}`, function(){})
    filendir.writeFile(`${logsFolder}/integrate/pre.out`, stdout, function(){})
    filendir.writeFile(`${logsFolder}/integrate/pre.err`, stderr, function(){})
    if (error != null){
      filendir.writeFile(`${logsFolder}/integrate/pre.exit`, error.toString(), function(){})
    } else {
      filendir.writeFile(`${logsFolder}/integrate/pre.exit`, 0, function(){});
      mechaConf.cIDs[cid].filters.forEach(function(fltr, ndx){
        const runArrayArgs = ['run', '-d', '-p', `${getRandomInt(0, 45032)}:8080`, dockerImage].concat(fltr.cmd.split(' '));
        console.log(runArrayArgs)
        const dockerRunProc = spawn('docker', runArrayArgs);
        // dockerRunProc.stderr.pipe(fs.createWriteStream(`${logsFolder}/integrate/tests/${fltr.name}.err`))

        dockerRunProc.stdout.on('data', (d2)=>{
          filendir.writeFile(`${logsFolder}/integrate/tests/${fltr.name}.run.dpid`, d2.toString(), function(){});

          // const dockerAttachProc = spawn('docker', ['attach', d2.toString()]);
          // dockerAttachProc.stdout.on('data', (data) => {
          //   console.log(data.toString());
          // });
          //
          // dockerAttachProc.stderr.on('data', (data) => {
          //   console.log(`grep stderr: ${data}`);
          // });
          //
          // dockerAttachProc.on('close', (code) => {
          //   if (code !== 0) {
          //     console.log(`grep process exited with code ${code}`);
          //   }
          // });

          // dockerRunProc.on('close', (code, signal) => {
          //   // console.log(`grep process exited with code ${code}, ${signal}`);
          //
          //
          //
          // });
        });
        return fltr
      });
    }
  });
  filendir.writeFile(`${logsFolder}/integrate/pre.pid`, preProcess.pid, function(){})
}

/* POST fakewebhook page. */
router.post('/', function(req, res) {
  const sha = req.body.sha.trim();
  const repo = req.body.repo
  if (sha != '') {
    mechanize(repo, sha)
    res.redirect(`/cid/${repo2Path(repo)}/${sha}/`)
  } else {
      res.send("you need to specify a SHA");
  }
});

module.exports = router;
