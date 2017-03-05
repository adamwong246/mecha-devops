var express = require('express');
var router = express.Router();

router.post('/:domain/:repo/:branch/:target/:task', function(req, res) {
 res.send('hi')
})

module.exports = router;
