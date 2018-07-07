import Service from '@ember/service';
import { Controller } from 'cerebral'
import Devtools from 'cerebral/devtools'
import BaobabModel from '@cerebral/baobab';
import { inject } from '@ember/service';
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
    store: inject(),
    ajax: inject(),
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
            provide('store', this.get('store')),
            provide('ajax', this.get('ajax')),
            provide('rsvp', rsvp)
        ];
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
            signals: this.get('signals').getSignals(),
            providers: this.getProviders()
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
