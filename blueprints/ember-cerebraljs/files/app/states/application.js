import { StateObject } from 'ember-cerebraljs';

const state = {
    current: {
        user: {
            age: 20,
            name: 'Developer'
        }
    }
};

export default StateObject.create({state});