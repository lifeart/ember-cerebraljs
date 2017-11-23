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
    this._propertyPathConnections = {};
    set(this, 'cerebral', get(this, 'cerebraljs').get('cerebral'));
    this._bindProps(this.cerebralProps());
    this._subscribePropsToCerebralUpdates(this.cerebralProps());
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
  createCerebralHandlerFor(propertyName) {
    return function (target, key) {
      this.disconnectPathFromProperty(false, propertyName);
      this.connectPathToProperty(this.get(key), propertyName);
      this.notifyPropertyChange(propertyName);
    }.bind(this);
  },
  _bindProps(cerebralProps) {
    const cerebral = get(this, 'cerebral');

    this._eachInObject(cerebralProps, (prop, path) => {

      let pathName = path || prop;
      let hasBindedProperty = false;
      let bindedProperty = false;

      if (pathName.startsWith('@')) {
        bindedProperty = pathName.replace('@', '');
        pathName = this.get(bindedProperty);
        hasBindedProperty = true;
      }

      set(this, prop, computed(() => {
        let result;
        if (hasBindedProperty) {
          let statePath = this.get(bindedProperty);
          result = statePath ? cerebral.getState(statePath) : `@${bindedProperty}`;
        } else {
          result = cerebral.getState(pathName);
        }
        if (typeof result === 'undefined') {
          if (hasBindedProperty) {
            console.error(`Unable to get state for property "${prop}" by binded as property "${bindedProperty}" path "${this.get(bindedProperty)}"`, this, cerebral);
          } else {
            console.error(`Unable to get state for property "${prop}" by path "${pathName}"`, this, cerebral);
          }
        }
        return result;
      }).readOnly());

      if (hasBindedProperty) {
        let handlerName = `${bindedProperty}@BindingDidChange`;
        this[handlerName] = this.createCerebralHandlerFor(prop);
        this.addObserver(bindedProperty, this, handlerName);
        if (this.get(bindedProperty)) {
          this.connectPathToProperty(this.get(bindedProperty), prop);
        }
      }

    });
  },
  _eachInObject(el, fn) {
    Object.keys(el).forEach((key) => {
      fn(key, el[key]);
    });
  },

  _subscribePropsToCerebralUpdates(cerebralProps) {
    this._cerebralConnection('on', cerebralProps);
  },

  _unsubscribePropsToCerebralUpdates(cerebralProps) {
    this._cerebralConnection('off', cerebralProps);
  },

  _propertyBroadcaster(cursor, method, prop) {
    cursor[method]('update', this._broadcastProptertyChanged(prop));
  },

  _cerebralConnection(method, cerebralProps) {
    this._eachInObject(this.cursorsByProp(cerebralProps), (prop, cursor) => {
      this._propertyBroadcaster(cursor, method, prop);
    });
  },

  cursorByPath(path) {
    const cerebral = get(this, 'cerebral');
    const state = cerebral.getModel().state;
    return state.select.apply(state, path.split('.'));
  },

  connectPathToProperty(path, prop) {
    this._propertyPathConnections[prop] = path;
    let cursor = this.cursorByPath(path);
    this._propertyBroadcaster(cursor, 'on', prop);
  },

  disconnectPathFromProperty(path, prop) {
    if (!path) {
      path = this._propertyPathConnections[prop] || false;
    }
    if (!path) {
      return;
    }
    let cursor = this.cursorByPath(path);
    this._propertyBroadcaster(cursor, 'off', prop);
  },

  cursorsByProp(cerebralProps) {
    const memo = {};
    this._eachInObject(cerebralProps, (prop, path) => {
      if (!path.startsWith('@')) {
        memo[prop] = this.cursorByPath(path);
      }
    });
    return memo;
  },

  _broadcastProptertyChanged(prop) {
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
    this._unsubscribePropsToCerebralUpdates(this.cerebralProps());
  }
});