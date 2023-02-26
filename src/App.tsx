import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import { store } from './store';

import CellList from './components/CellList/cell-list';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div>
          <CellList />
        </div>
      </Router>
    </Provider>
  );
};

export default App;
