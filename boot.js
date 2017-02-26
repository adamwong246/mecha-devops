const db = require('./db')
const exec = require('child_process').exec;

Object.keys(db.cIDs).forEach(function(cID){

  // const id = Object.keys(cID)[0]
  const splitId = cID.split('#')
  const name = splitId[0]
  const branch = splitId[1];
  const folder = name.split('/')[1].split('.git')[0]

  const url = "git@github.com:"+name
  const conf = cID[url]

  const command = 'cd ./pen;\
  git clone ' + url + ';\
  cd ' + folder + ';\
  ';

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
