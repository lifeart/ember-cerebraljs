import Service from '@ember/service';
import { getOwner } from '@ember/application';
import { Controller, Module } from 'cerebral';
import Devtools from 'cerebral/devtools';
import BaobabModel from '@cerebral/baobab';
import rsvp from 'rsvp';

const provide  = function(name, provider) {
    const f = (context) => {
        context[name] = provider;
        return context;
    }
    Object.defineProperty(f, 'name', {value: `${name}Provider`, writable: false});
    return f;
}

export default Service.extend({
    devToolsEnabled: true, 
    devToolsHost: '127.0.0.1:8585',
    devToolsReconnect: true,
    modelConfig() {
        return {immutable: false};
    },
    getProviders() {
        return [
            (function() {
                const f = (context) => {
                    context['args'] = context.props ? context.props.args : [];
                    return context;
                }
                Object.defineProperty(f, 'name', {value: `argsProvider`, writable: false});
                return f;
            })(),
            provide('store', getOwner(this).lookup('service:store')),
            provide('ajax', getOwner(this).lookup('service:ajax')),
            provide('rsvp', rsvp)
        ];
    },
    getNewModel() {
        return new BaobabModel({}, this.modelConfig());
    },
    createController() {
        const app = Module({
            state: this.get('state').getState(),
            signals: this.get('signals').getSignals(),
            providers: this.getProviders()
        });
        const controller  = Controller(app, {
            Model: this.getNewModel(),
            devtools: this.get('devToolsEnabled') ? new Devtools({
                host: this.get('devToolsHost'),
                reconnect: this.get('devToolsReconnect')
            }): undefined,
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
