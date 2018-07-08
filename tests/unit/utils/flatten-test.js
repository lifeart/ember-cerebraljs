import flatten from 'dummy/utils/flatten';
import { module, test } from 'qunit';

module('Unit | Utility | flatten', function() {


  // Replace this with your real tests.
  test('it can create flat objects', function(assert) {
    let result = flatten({
      a: 'b',
      b: {
        c: 'd',
        h: {
          i: {
            g: {
              k: {
                l: {
                  m: {
                    n: {
                      o: 42
                    }
                  }
                }
              }
            }
          }
        },
        e: 1,
        f: [
          1,
          2
        ]
      }
    }, {
      delimiter: '.',
      maxDepth: 10
    });
    assert.equal(result['a'], 'b');
    assert.equal(result['b.c'], 'd');
    assert.equal(result['b.e'], 1);
    assert.equal(result['b.e.f.0'], 1);
    assert.equal(result['b.e.f.0'], 2);
    assert.equal(result['b.e.h.i.g.k.l.m.n.o'], 2);
  });

});
