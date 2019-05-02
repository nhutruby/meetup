import {combineReducers, compose, createStore, applyMiddleware} from 'redux';
import sagaMiddleware from '../saga';
import AppReducer from '../../app/AppReducer';

const staticReducers = {
  AppReducer,
};

function createReducer (asyncReducers) {
  return combineReducers ({
    ...staticReducers,
    ...asyncReducers,
  });
}
// Configure the store
export default function configureStore () {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore (
    createReducer (),
    composeEnhancers (applyMiddleware (sagaMiddleware))
  );

  // Add a dictionary to keep track of the registered async reducers
  store.asyncReducers = {};

  // Create an inject reducer function
  // This function adds the async reducer, and creates a new combined reducer
  store.injectReducer = (key, asyncReducer) => {
    store.asyncReducers[key] = asyncReducer;
    store.replaceReducer (createReducer (store.asyncReducers));
  };

  // Return the modified store
  return store;
}
