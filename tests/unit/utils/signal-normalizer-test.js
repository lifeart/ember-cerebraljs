import signalNormalizer from 'ember-cerebraljs/utils/signal-normalizer';
import { module, test } from 'qunit';

module('Unit | Utility | signal-normalizer', function() {

  // Replace this with your real tests.
  test('it works', function(assert) {
    assert.equal(signalNormalizer('foo.bar'), 'foo/bar');
    assert.equal(signalNormalizer('foo..bar'), 'foo//bar');
    assert.equal(signalNormalizer('foo'), 'foo');
    assert.equal(signalNormalizer('Foo.Bar'), 'Foo/Bar');
  });
});