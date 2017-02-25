const db = {
  token: "token",
  cIDs:
    {"adamwong246/testPros.git#master": {
      "filters" : [
        { "name": "lint", "cmd": "npm run lint"},
        { "name": "test", "cmd": "npm run test"}
      ],
      "hook": "convox deploy",
      "logs": {
        "sha1": {
          "somethingLikeLint": "..."
        }
      }
    }}
};

module.exports = db;
