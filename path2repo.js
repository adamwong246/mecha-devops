const path2repo = function(domain, repo, branch){
  return `${domain.replace('_', '.')}:${repo.replace('_', '/')}.git#${branch}`
};

module.exports = path2repo;
