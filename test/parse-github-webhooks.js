let chai = require('chai');
let should = chai.should();
let expect = chai.expect;

function parseGhWbhkPayloadCID(payload){
  const repo = payload.repository.full_name
  const baseBranch = payload.pull_request.base.ref

  cid = `github.com:${repo}.git#${baseBranch}`
  return cid
}

function parseGhWbhkPayloadSH(payload){
  return payload.pull_request.head.sha
}

const ghWbhkPullReqeust = require('./gh-wbhk-pull_request.json')

describe('gh payload parse', () => {
  it('should parse out the CID', (done) => {
    expect(parseGhWbhkPayloadCID(ghWbhkPullReqeust)).to.equal('github.com:adamwong246/testPros.git#master');
    done();
  });

  it('should parse out the SHA', (done) => {
    expect(parseGhWbhkPayloadSH(ghWbhkPullReqeust)).to.equal('1a56b10617ebc87e1c242d8654fcb384ef07e00b');
    done();
  });
});
