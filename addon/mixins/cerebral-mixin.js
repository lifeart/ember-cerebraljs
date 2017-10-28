import Mixin from '@ember/object/mixin';
import {
  computed,
  get,
  set
} from '@ember/object';
import {
  inject
} from '@ember/service';
import normalizeSignalName from '../utils/signal-normalizer';
export default Mixin.create({
  cerebraljs: inject(),
  props: computed(function (params) {
    return false;
  }),
  init() {
    set(this,'cerebral', get(this, 'cerebraljs').get('cerebral'));
    this.bindProps(this.cerebralProps());
    this.subscribePropsToCerebralUpdates(this.cerebralProps());
    this._super(...arguments);
  },
  cerebralProps() {
    const propsObject = {};
    this.get('props').forEach((propName) => {
      const [key, value = key] = propName.split(':');
      propsObject[key] = value;
    });
    return propsObject;
  },
  bindProps(cerebralProps) {
    const cerebral = get(this, 'cerebral');
    this._eachInObject(cerebralProps, (prop, path) => {
      set(this, prop, computed(() => {
        const pathName = path || prop;
        const result = cerebral.getState(pathName);
        if (typeof result === 'undefined') {
          console.error(`Unable to get state for property "${prop}" by path "${pathName}"`, this, cerebral);
        }
        return result;
      }).readOnly());
    });
  },
  _eachInObject(el, fn) {
    Object.keys(el).forEach((key) => {
      fn(key, el[key]);
    });
  },

  subscribePropsToCerebralUpdates(cerebralProps) {
    this.cerebralConnection('on', cerebralProps);
  },

  unsubscribePropsToCerebralUpdates(cerebralProps) {
    this.cerebralConnection('off', cerebralProps);
  },

  cerebralConnection(method, cerebralProps) {
    this._eachInObject(this.cursorsByProp(cerebralProps), (prop, cursor) => {
      cursor[method]('update', this.broadcastProptertyChanged(prop));
    });
  },

  cursorsByProp(cerebralProps) {
    const cerebral = get(this, 'cerebral');
    const memo = {};
    const state = cerebral.getModel().state;
    this._eachInObject(cerebralProps, (prop, path) => {
      memo[prop] = state.select.apply(state, path.split('.'));
    });
    return memo;
  },

  broadcastProptertyChanged(prop) {
    return () => {
      this.notifyPropertyChange(prop);
    };
  },

  sendSignal(name, ...props) {
    const signal = get(this, 'cerebral').getSignal(normalizeSignalName(name));
    if (!signal) {
      console.error(`Unable to find signal "${name}"`, props, this);
      return;
    }
    signal.apply(signal, props);
  },

  didDestroyElement() {
    this._super(...arguments);
    this.unsubscribePropsToCerebralUpdates(this.cerebralProps());
  }
});
