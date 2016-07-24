import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import solverApp from './reducers'
import { solverSega, selectionSega, keyboardHandler } from './sagas'
import App from './components/App'
import { SolverApi } from './lib'


const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  solverApp,
  applyMiddleware(sagaMiddleware)
)

const solver = new SolverApi()
sagaMiddleware.run(solverSega, solver)
sagaMiddleware.run(selectionSega, solver)
sagaMiddleware.run(keyboardHandler)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
