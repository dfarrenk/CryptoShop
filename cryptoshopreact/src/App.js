import React, { Component } from 'react';
import NavNewUser from './components/navNewUser/navNewUser.js';
import ReceiveBitcoin from './components/ReceiveBitcoin/receive.js';

import Realtime from './components/RealTimePrices/realtime.js';
// import './App.css';

class App extends Component {
  render() {
    return (
      <div>
      <header>
      <NavNewUser />
      </header>
      <p className="App-intro">
      To get started, edit <code>src/App.js</code> and save to reload.
      </p>
      
      </div>
      );
  }
}

export default App;
