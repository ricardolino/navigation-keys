import { combineReducers } from 'redux';

import { REGISTER_STAGE, REMOVE_STAGE, FETCH_DATA } from './actions';

function navigationReducer (state = [], action) {
    switch (action.type) {
        case REGISTER_STAGE:
            return [
                ...state,
                action.payload
            ]
        case REMOVE_STAGE:
            return (
                state.filter((element) => {
                    return (element !== action.payload);
                })
            )
        default:
            return state
    }
}

function dataReducer (state = [], action) {
    switch (action.type) {
        case FETCH_DATA:
            return [
                ...state,
                action.payload
            ]
        default:
            return state
    }
}


const rootReducer = combineReducers({
	stages: navigationReducer,
    data: dataReducer
});

export default rootReducer;