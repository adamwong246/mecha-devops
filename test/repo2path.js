let chai = require('chai');
let should = chai.should();
let expect = chai.expect;

repo2Path = require('../repo2Path.js')

describe('repo 2 path', () => {
  it('should parse repo 2 path', (done) => {
    expect(repo2Path("github.com:adamwong246/testPros.git#master"))
    .to.equal('github_com/adamwong246_testPros/master');
    done();
  });

});
