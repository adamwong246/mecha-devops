function sum(a, b) {
  return a + b;
}
test('adds 1 + 2 to equal 3', function() {
  return expect(sum(1, 2)).toBe(3);
});

// POST /trigger/:repo/?token=token
//   branch change?
//     for last commit
//       responds with devops message
//       rebuilds log
//       responds with devops results
//
//   pr create || update?
//     for last commit
//       responds with pr message
//       rebuilds log
//       responds with pr results
