import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-calendar/dist/Calendar.css';

import {Routes, Route, Link} from 'react-router-dom';
import First from './components/login_join_find/First';
import Main from './components/main/Main';
import Cal_main from './components/cal/Cal_main';
import Graph from './components/cal/Graph'
import Cal_Detail from './components/cal/Cal_Detail';

function App() {
  return (
    <div className='App'>
      <h1>
        <Link to='/'></Link>
      </h1>
      <Routes>
        {/* first */}
        <Route path='/' element={<First/>}></Route>

        <Route path='/main' element={<Main/>}></Route>


        <Route path='/Cal_main' element={<Cal_main/>}></Route>
        <Route path='/Cal_Detail' element={<Cal_Detail/>}></Route>
      </Routes>
    </div>
  )
}

export default App;
