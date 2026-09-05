const assert = require('node:assert/strict');
const {
  parsePointsScored,
  parseStandalonePercent,
  averagePercentages
} = require('./content.js');

const capturedSummary = [
  'Points Scored',
  '80%',
  '16 / 20',
  'Points Scored',
  'Test Settings'
].join('\n');

assert.equal(parsePointsScored(capturedSummary), 80);
assert.equal(parsePointsScored('Total Correct 16 Total Incorrect 4'), null);

assert.equal(parseStandalonePercent('83%'), 83);
assert.equal(parseStandalonePercent(' 28% '), 28);
assert.equal(parseStandalonePercent('13 sec'), null);
assert.equal(parseStandalonePercent('101%'), null);

assert.equal(averagePercentages(['83%', '28%', '77%']), 62.7);
assert.equal(averagePercentages(['83%', 'not scored', '77%']), 80);
assert.equal(averagePercentages([]), null);

console.log('content parser tests passed');

const { isFindShortcut } = require('./find-unblock.js');

assert.equal(isFindShortcut({ key: 'f', ctrlKey: true }), true);
assert.equal(isFindShortcut({ key: 'F', metaKey: true }), true);
assert.equal(isFindShortcut({ key: 'g', ctrlKey: true }), true);
assert.equal(isFindShortcut({ key: 'F3' }), true);
assert.equal(isFindShortcut({ keyCode: 70, ctrlKey: true }), true);
assert.equal(isFindShortcut({ key: 'f' }), false);
assert.equal(isFindShortcut({ key: 'f', ctrlKey: true, altKey: true }), false);
assert.equal(isFindShortcut({ key: 's', ctrlKey: true }), false);
assert.equal(isFindShortcut(null), false);

console.log('find-unblock tests passed');
