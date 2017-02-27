const repo2Path = function(string){
  const domain = string.split(':')[0].replace('.', '_');
  const repo = string.split(':')[1].split('#')[0].split('.git')[0].replace('/', '_');
  const branch = string.split(':')[1].split('#')[1];
  return `${domain}/${repo}/${branch}`
};

module.exports = repo2Path;
