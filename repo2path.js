const repo2Path = function(string){
  return string.replace(/[^a-z0-9]/gi, '_').toLowerCase();
};

module.exports = repo2Path;
