import logger from 'ember-cerebraljs/utils/logger';
import { module, test } from 'qunit';

module('Unit | Utility | logger', function() {

  // Replace this with your real tests.
  test('it works', function(assert) {
    let result = logger();
    assert.ok('error' in result);
  });
});
