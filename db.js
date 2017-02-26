const db = {
  token: "token",
  cIDs:
    {
      "github.com:adamwong246/testPros.git#master": {
        "filters" : [
          { "name": "lint", "cmd": "npm run lint"},
          { "name": "test", "cmd": "npm run test"}
        ],
        "hook": "echo DEPLOY!"
      },
      "github.com:adamwong246/dotfiles.git#master": {
        "filters" : [
          { "name": "foo", "cmd": "echo foo"}
        ],
        "hook": "echo FOO!"
      }
    }
};

module.exports = db;
