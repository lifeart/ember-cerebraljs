import SignalsObject from 'ember-cerebraljs/utils/signals';
import { module, test } from 'qunit';

module('Unit | Utility | signals', function() {

  // Replace this with your real tests.
  test('it return valid actions on getActions call', function(assert) {

    let actions = {
      foo() {
        return 'bar';
      },
      boo() {
        return 'baz';
      }
    }

    let result = SignalsObject.extend({
      actions
    }).create();

    assert.equal(result.getActions('foo')[0](), 'bar');
    assert.equal(result.getActions('boo')[0](), 'baz');
    assert.equal(result.getActions('foo', 'boo').map(a=>a()).join(','), 'bar,baz');
    assert.equal(result.getActions('boo', 'foo').map(a=>a()).join(','), 'baz,bar');
  });

  test('it return valid action by namespace', function(assert) {

    function getFn(name, index) {
      return {
        [name]() {
          return `${name}${index}`;
        }
      }
    }

    let actions = {
      foo: getFn('foo', 1),
      space: {
        foo: getFn('foo', 2),
        nested: {
          foo: getFn('foo', 3),
          'so-nested': {
            foo: getFn('foo', 4)
          },
          'so/nested': {
            foo: getFn('foo', 5)
          },
          'so.nested': {
            foo: getFn('foo', 6)
          },
          so: {
            nested: {
              foo: getFn('foo', 7)
            }
          }
        }
      },
      'no-space': {
        foo: getFn('foo', 0)
      }
    }

    let result = SignalsObject.extend({
      actions
    }).create();

    assert.equal(result.getActionFromNamespace('foo')(), 1);
    assert.equal(result.getActionFromNamespace('foo', 'space')(), 2);
    assert.equal(result.getActionFromNamespace('foo', 'space.no-space')(), 0);
    assert.equal(result.getActionFromNamespace('foo', 'space.nested')(), 3);
    assert.equal(result.getActionFromNamespace('foo', 'space.nested.so-nested')(), 4);
    assert.equal(result.getActionFromNamespace('foo', 'space.nested.so/nested')(), 5);
    assert.equal(result.getActionFromNamespace('foo', 'space.nested.so.nested')(), 6);
    assert.equal(result.getActionFromNamespace('nested.foo', 'space.nested.so')(), 7);
  });

  test('it return valid signal by namespace', function(assert) {

    function getFn(name, index) {
      return {
        [name]() {
          return `${name}${index}`;
        }
      }
    }

    let signals = {
      foo: getFn('foo', 1),
      space: {
        foo: getFn('foo', 2)
      },
      'no-space': {
        foo: getFn('foo', 0)
      }
    }

    let result = SignalsObject.extend({
      signals
    }).create();

    assert.equal(result.getActionFromNamespace('foo')(), 1);
  });

});