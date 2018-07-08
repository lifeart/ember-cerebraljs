import StateObject from 'dummy/utils/states';
import { module, test } from 'qunit';

module('Unit | Utility | states', function() {

  // Replace this with your real tests.
  test('it works', function(assert) {
    let result = StateObject.create();
    assert.ok(Object.keys(result.getState()).length === 0);
  });

  test('it must return state object on getState', function(assert) {
    const state =  {
      foo: 'bar',
      items: [],
      enabled: false
    };

    let result = StateObject.extend({
      state
    }).create();

    assert.deepEqual(result.getState(), state);
  })
});
