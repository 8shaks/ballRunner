import React from 'react';
import { Provider } from 'react-redux'
import store from './store.js'
export default ({ element }) => (
    <Provider store={store}>{element}</Provider>
)