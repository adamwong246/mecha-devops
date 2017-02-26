let chai = require('chai');
let should = chai.should();
let chaiHttp = require('chai-http');
let app = require('../app');

chai.use(chaiHttp);

describe('Routes', () => {
  describe('GET /', () => {
      it('should respond with 200', (done) => {
        chai.request(app)
            .get('/')
            .end((err, res) => {
              res.should.have.status(200);
              done();
            });
      });
  });

  describe('POST /webhook', () => {
      it('should respond with 200', (done) => {
        chai.request(app)
            .post('/webhook')
            .end((err, res) => {
              // console.log(res)
              res.should.have.status(200);
              res.should.be.html;
              done();
            });
      });
  });

  describe('POST /trigger', () => {
      it('should respond with 200', (done) => {
        chai.request(app)
            .post('/trigger')
            .end((err, res) => {
              // console.log(res)
              res.should.have.status(200);
              res.should.be.html;
              done();
            });
      });
  });

  describe('POST /fakewebhook', () => {
      it('should respond with 200', (done) => {
        chai.request(app)
            .post('/fakewebhook')
            .end((err, res) => {
              // console.log(res)
              res.should.have.status(200);
              res.should.be.html;
              done();
            });
      });
  });

  describe('POST /faketrigger', () => {
      it('should respond with 200', (done) => {
        chai.request(app)
            .post('/faketrigger')
            .end((err, res) => {
              // console.log(res)
              res.should.have.status(200);
              res.should.be.html;
              done();
            });
      });
  });

});
