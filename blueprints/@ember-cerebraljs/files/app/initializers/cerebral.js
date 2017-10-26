import { Controller } from 'cerebral'
import Devtools from 'cerebral/devtools'
import BaobabModel from '@cerebral/baobab';
import signals from '../signals/application';
import state from '../states/application';

export function initialize(application) {

  const controller  = Controller({
    Model: new BaobabModel({}, {immutable: false}),
    devtools: new Devtools({
      host: '127.0.0.1:8585',
      reconnect: true
    }),
    signals,
    state
  });

  //howto?
  // cerebral.getSignal('onIncrease')(); 

  application.register('cerebral:main', controller, { instantiate: false });
  application.register('cerebral:signals', controller.module.signals, { instantiate: false });

  application.inject('component', 'cerebral', 'cerebral:main');
  application.inject('route', 'cerebral', 'cerebral:main');
  application.inject('component', 'signals', 'cerebral:signals');
  application.inject('route', 'signals', 'cerebral:signals');

}

export default {
  name: 'cerebral',
  initialize
};
