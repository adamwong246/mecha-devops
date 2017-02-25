var express = require('express');
var router = express.Router();

const db = require('.././db')

console.log("index")
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MechaDevops', db: db });
});

module.exports = router;
