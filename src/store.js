import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducer';

const createStoreWithMiddleware = applyMiddleware()(createStore);
const store = createStoreWithMiddleware(rootReducer);

export default store;