//During the test the env variable is set to test
// process.env.NODE_ENV = 'test';

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
              res.should.have.status(200);
              done();
            });
      });
  });
});
