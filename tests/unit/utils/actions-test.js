import ActionsObject from 'ember-cerebraljs/utils/actions';
import { module, test } from 'qunit';

module('Unit | Utility | actions', function() {

  // Replace this with your real tests.
  test('it works', function(assert) {
    let result = ActionsObject.extend({foo: 'bar'}).create();
    assert.ok(result.get('foo') === 'bar');
  });
});
