import React, { Component, Fragment } from 'react';

import Home from './components/home'
import Resume from './components/resume'
import Portfolio from './components/portfolio'
import Contact from './components/contact'
import './App.css';

class App extends Component {
   render() {
    return (
      <div className="App">
        <Fragment>
          <Home></Home>
          <Resume></Resume>
          <Portfolio></Portfolio>
          <Contact></Contact>
        </Fragment>
      </div>
    );
  }
}

export default App;
