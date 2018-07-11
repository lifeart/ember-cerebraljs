import Service from '@ember/service';
import { getOwner } from '@ember/application';
import { Controller, Module, Provider } from 'cerebral';
import Devtools from 'cerebral/devtools';
import BaobabModel from '@cerebral/baobab';

export default Service.extend({
    devToolsEnabled: true, 
    devToolsHost: '127.0.0.1:8585',
    devToolsReconnect: true,
    modelConfig() {
        return {immutable: false};
    },
    getProviders() {
        return {
            ajax: Provider(getOwner(this).lookup('service:ajax') || {}),
            store: Provider(getOwner(this).lookup('service:ajax') || {})
        };
    },
    getNewModel() {
        return new BaobabModel({}, this.modelConfig());
    },
    createController() {
        const app = Module({
            providers: this.getProviders(),
            state: this.get('state').getState(),
            signals: this.get('signals').getSignals()
        });
        const controller  = Controller(app, {
            Model: this.getNewModel(),
            devtools: this.get('devToolsEnabled') ? new Devtools({
                host: this.get('devToolsHost'),
                reconnect: this.get('devToolsReconnect')
            }): undefined,
            throwToConsole: true,
            stateChanges: {}
        });
        return controller;
    },
    init() {
        this._super(...arguments);
        const controller = this.createController();
        this.set('cerebral', controller);
        this.set('signals', controller.module.signals);
    }
});
