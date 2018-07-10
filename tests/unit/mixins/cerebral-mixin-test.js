import EmberObject from '@ember/object';
import CerebralMixinMixin from 'ember-cerebraljs/mixins/cerebral-mixin';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Mixin | cerebral mixin', function(hooks) {
  setupTest(hooks);

  let mockedState = {
    select() {
      return {
        on() {},
        off() {}
      }
    }
  };

  let cerebralServiceStub = EmberObject.create({
    cerebral: EmberObject.create({
      getSignal() {

      },
      getState() {
        return mockedState;
      },
      getModel() {
        return {
          state: mockedState
        }
      }
    })
  });

  let CerebralMixinObject = EmberObject.extend(CerebralMixinMixin);

  CerebralMixinObject.reopen({
    cerebraljs: cerebralServiceStub
  });


  test('it can be initalized', function(assert) {
    let subject = CerebralMixinObject.create();
    assert.ok(subject);
  });

  test('it must return array in `props` property', function(assert){
    let subject = CerebralMixinObject.create();
    assert.equal(Array.isArray(subject.get('props')), true);
  });

  test('cerebralProps() must return object with props', function(assert){
    let subject = CerebralMixinObject.create({props:['foo','bar:baz']});
    let props = subject.cerebralProps();
    assert.equal(Object.keys(props).length, 2);
    assert.equal(props['foo'], 'foo');
    assert.equal(props['bar'], 'baz');
  });
});
