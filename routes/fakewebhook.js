var fs = require('fs');
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const spawnSync = require('child_process').spawnSync;

var express = require('express');
var router = express.Router();

var mechaConf = JSON.parse(fs.readFileSync('./mechafile.json', 'utf8'));

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

  exec(preCommand , (error, stdout, stderr) => {
    filendir.writeFile(`${logsFolder}/integrate.pre.cmd`, `${preCommand}`, function(){})
    filendir.writeFile(`${logsFolder}/integrate.pre.out`, stdout, function(){})
    filendir.writeFile(`${logsFolder}/integrate.pre.err`, stderr, function(){})

    if (error != null){
      filendir.writeFile(`${logsFolder}/integrate.pre.exit`, error.toString(), function(){})
    } else {
      filendir.writeFile(`${logsFolder}/integrate.pre.exit`, 0, function(){})
    }

    const spawnedThreads = mechaConf.cIDs[cid].filters.map(function(fltr, ndx){
      const runArrayArgs = ['run', dockerImage].concat(fltr.cmd.split(' '));
      const dockerProcess = spawn('docker', runArrayArgs)
      dockerProcess.stdout.pipe(fs.createWriteStream(`${logsFolder}/integrate.attach.${fltr.name}.out`))
      dockerProcess.stderr.pipe(fs.createWriteStream(`${logsFolder}/integrate.attach.${fltr.name}.err`))
      dockerProcess.on('exit', (d2)=>{
        filendir.writeFile(`${logsFolder}/integrate.attach.${fltr.name}.exit`, d2.toString(), function(){})
        filendir.writeFile(`${logsFolder}/integrate.attach.${fltr.name}.cmd`, runArrayArgs.toString(), function(){})
      })
      return fltr
    });
  });
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
