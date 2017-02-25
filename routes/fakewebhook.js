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

  var command = `cd ./pen/${folder.split('/')[1]};\
  git pull origin master;\
  docker build -t ${dockerImage} .`;


  command = command + " && " + db.cIDs[cid].filters.map(function(fltr, ndx){
    return `mkdir -p ./log/${folder}/${sha} && docker attach $(docker run -i -d ${dockerImage} ${fltr.cmd}) &> ./log/${folder}/${sha}/${fltr.name}.log`
  }).join(' && ');

  exec(command , (error, stdout, stderr) => {
    console.log(command)
    filendir.writeFile(`./log/${folder}/${sha}/mechalog`, `${command}\n${stdout}${stderr}`, function(){})
    // filendir.writeFile(`./log/${folder}/${sha}/.err.log`, `${command}\n${stderr}`, function(){})
    //
    // if (error) {
    //   console.error(`exec error: ${error}`);
    //   return;
    // }
  });

  return true
  //
  //
  // // const ls = spawn('ls', ['-lh', '/usr']);
  // //
  // // ls.stdout.on('data', (data) => {
  // //   console.log(`stdout: ${data}`);
  // // });
  // //
  // // ls.stderr.on('data', (data) => {
  // //   console.log(`stderr: ${data}`);
  // // });
  // //
  // // ls.on('close', (code) => {
  // //   console.log(`child process exited with code ${code}`);
  // // });
  // //
  // // const commands = [
  // //   {cmd: 'cd ./pen', args: {}},
  // //   {cmd: 'git clone ' + cid, args: {}},
  // // ]
  //
  // // const command = db[cid].filters where name == filter .cmd
  // // const outputFile = db[cid].logs[sha][filter]
  // //
  // // git clone cid
  // // git merge sha
  // // docker build cid .
  // // return docker attach(docker run command) > outputFile
}

// // /* GET fakewebhook page. */
router.get('/', function(req, res, next) {
  res.send('got');
});

/* POST fakewebhook page. */
router.post('/', function(req, res) {
  res.send('you posted ' + JSON.stringify(req.body));
  // res.send(fs.readFileSync('./log/'+req.repo))
  mechanize(req.body.repo, req.body.sha, req.body.filter)
});

module.exports = router;
