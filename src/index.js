import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import solverApp from './reducers'
import solverSega from './sagas'
import App from './components/App'

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  solverApp,
  applyMiddleware(sagaMiddleware)
)

sagaMiddleware.run(solverSega)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
