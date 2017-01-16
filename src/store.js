import { compose, createStore, applyMiddleware } from 'redux';
import ReduxPromise from 'redux-promise';
import rootReducer from './reducer';

const middleware = applyMiddleware(
	ReduxPromise
);

const createStoreWithMiddleware = compose(
	middleware,
	window.devToolsExtension ? window.devToolsExtension() : f => f
);

const store = createStoreWithMiddleware(createStore)(rootReducer);

export default store;
