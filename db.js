const db = {
  token: "token",
  cIDs:
    {"gitub.com:adamwong246/testPros.git#master": {
      "filters" : [
        { "name": "lint", "cmd": "npm run lint"},
        { "name": "test", "cmd": "npm run test"}
      ],
      "hook": "convox deploy"
    }}
};

module.exports = db;
