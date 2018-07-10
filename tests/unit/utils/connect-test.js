import connect from 'ember-cerebraljs/utils/connect';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';


module('Unit | Utility | connect', function(hooks) {
  setupTest(hooks);
  // Replace this with your real tests.
  test('it works', function(assert) {
    let result = connect();
    assert.ok(result);
  });
});
