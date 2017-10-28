import Service from '@ember/service';
import { Controller } from 'cerebral'
import Devtools from 'cerebral/devtools'
import BaobabModel from '@cerebral/baobab';
import normalizeSignalName from '../utils/signal-normalizer';

export default Service.extend({
    devToolsEnabled: true, 
    devToolsHost: '127.0.0.1:8585',
    devToolsReconnect: true,
    setState() {
        console.error('unable to set state from service, use actions for it');
    },
    getState(path) {
        return this.get('cerebral').getState(path);
    },
    sendSignal(name,...props) {
      const signal = get(this,'cerebral').getSignal(normalizeSignalName(name));
      signal.apply(signal, props);
    },
    modelConfig() {
        return {immutable: false};
    },
    getNewModel() {
        return new BaobabModel({}, this.modelConfig());
    },
    createController() {
        const controller  = Controller({
            Model: this.getNewModel(),
            devtools: this.get('devToolsEnabled') ? new Devtools({
                host: this.get('devToolsHost'),
                reconnect: this.get('devToolsReconnect')
            }): undefined,
            state: this.get('state').getState(),
            signals: this.get('signals').getSignals()
        });
        return controller;
    },
    init() {
        this._super(...arguments);
        const controller = this.createController();
        this.set('cerebral',controller);
        this.set('signals',controller.module.signals);
    }
});
