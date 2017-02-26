const exec = require('child_process').exec;

const mechaConf = require('./../mechafile.json')
const repo2path = require('./../repo2path')

Object.keys(mechaConf.cIDs).forEach(function(cID){
  const path = repo2path(cID);
  const url = cID.split('#')[0]
  const command = `rm -rf pen/**; git clone git@${url} ./pen/${path}`

  console.log(command)

  exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }

  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
  });

})
