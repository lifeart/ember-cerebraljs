import Mixin from '@ember/object/mixin';
import { computed, get, set } from '@ember/object';

export default Mixin.create({
  props: [],
  
  init() {
    this.bindProps(this.cerebralProps());
    this.subscribePropsToCerebralUpdates(this.cerebralProps());
    this._super(...arguments);
  },

  cerebralProps() {
    const propsObject = {};
    this.get('props').forEach((propName)=>{
        const [key, value = key] = propName.split(':');
        propsObject[key] = value;
    });
    return propsObject;
  },

  bindProps(cerebralProps) {
    const cerebral = get(this,'cerebral');
    this._eachInObject(cerebralProps, (prop, path) => {
      set(this, prop, computed(() => {
        return cerebral.getModel().get(path || prop);
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
      cursor[method].call(prop, 'update', this.broadcastProptertyChanged(prop));
    });
  },

  cursorsByProp(cerebralProps) {
    const cerebral = get(this, 'cerebral');
    const memo = {};
    this._eachInObject(cerebralProps, (prop, path) => {
      memo[prop] = cerebral.getModel().state.select(path);
    });
    return memo;
  },

  broadcastProptertyChanged(prop) {
    return () => {
      this.notifyPropertyChange(prop);
    };
  },

  sendSignal(name,...props) {
      const signal = get(this,'cerebral').getSignal(name);
      signal.apply(signal, props);
  },

  didDestroyElement() {
    this._super(...arguments);
    this.unsubscribePropsToCerebralUpdates(this.cerebralProps());
  }
});