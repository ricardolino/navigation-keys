import { combineReducers } from 'redux';

import { REGISTER_STAGE } from './actions'

function navigationReducer (state = [], action) {
    switch (action.type) {
        case REGISTER_STAGE:
            return [
                ...state,
                action.reference
            ]
        default:
            return state
    }
}


const rootReducer = combineReducers({
	stages: navigationReducer
});

export default rootReducer;