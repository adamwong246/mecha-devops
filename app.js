var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var fakewebhook = require('./routes/fakewebhook');
var log = require('./routes/log');

var app = express();

const db = require('./db')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/fakewebhook', fakewebhook);
app.use('/log', log);


express.static.mime.define({'text/plain': ['cmd', 'log', 'err']});
app.use('/log', express.static(path.join(__dirname, 'log')));

// app.post('/webhook',function(e, q, r, n) {
//    if token does not match
//      respond "Token unrecongnized"
//      break
//   else
//     respond "I recognize your webhook"
//
//     cIDs.forEach(function(cid, ndx){
//       if (res.cIds == cid){
//         if isPrCreation(res)
//           github-messsage-pr(res.PR) "I recieved your PR request. Waiting for initial reviewers or just say \"no reviewers\" "
//         else
//           if isPrUpdate(res)
//             if isPrNewReviewer(res)
//               inform reviewer
//             else
//               if isPrReviewDone(res)
//                 github message pr "all reviewers approved. Now running tests..."
//                   for each step,
//                     mechanize(cid, sha, step)
//
//                   inform locker of results, providing "button" if successfull
//       } else {
//         not one of my repos
//       }
//    })
//
//

// TODO git-backed self hosting
// if the the 'data' changes, persist the file
// if the source file changes, update the database

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
