import EmberObject from '@ember/object';
import CerebralMixinMixin from 'ember-cerebraljs/mixins/cerebral-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | cerebral mixin', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let CerebralMixinObject = EmberObject.extend(CerebralMixinMixin);
    let subject = CerebralMixinObject.create();
    assert.ok(subject);
  });
});
