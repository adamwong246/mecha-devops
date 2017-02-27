let chai = require('chai');
let should = chai.should();
let expect = chai.expect;

path2repo = require('../path2repo.js')

describe('path 2 repo', () => {
  it('should parse the repo from path', (done) => {
    expect(path2repo("github_com", "adamwong246_testPros", "master"))
    .to.equal('github.com:adamwong246/testPros.git#master');
    done();
  });

});
