import { combineReducers, createStore } from 'redux';
import { userReducer } from './users';

const reducers = combineReducers({
    userReducer
});

export default createStore(reducers);