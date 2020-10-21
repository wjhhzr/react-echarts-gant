import React from 'react';
import {BrowserRouter as Router,Route} from 'react-router-dom'
import Demo from './demo'

// 入口文件
function App() {
  return (
    <div>
        <Router>
          {/* demo */}
          <Route path='/' exact component={Demo}/>
        </Router>
    </div>
  );
}

export default App;
