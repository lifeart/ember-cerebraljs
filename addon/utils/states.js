import EmberObject from '@ember/object';

const StateObject = EmberObject.extend({
    getState() {
        return this.get('state') || {};
    }
});

export default StateObject;