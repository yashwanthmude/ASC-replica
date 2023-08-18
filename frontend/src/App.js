import './App.css';
import {BrowserRouter , Route ,Routes} from 'react-router-dom';
import Login from './components/login';
import Course from './components/course';
import Registration from './components/registration';
import Instructor from './components/instructor';
import Running from './components/running';
import Home from './components/home'
import Running_dept from './components/running_dept';
function App() {
  
  return (
    <div className="App">
        <div className="container">
          <BrowserRouter>
            <Routes>
              <Route path='/login' element={<Login/>}/>
              <Route path='/home' element={<Home/>}/>
              <Route path='/home/registration' element={<Registration/>}/>
              <Route path='/instructor/:instructor_id'element={<Instructor/>}/>
              <Route path='/course/running' element={<Running/>}/>
              <Route path='/course/:course_id' element={<Course/>} />
              <Route path='/course/running/:dept_name' element={<Running_dept/>}/>
               
                        
            </Routes>
          </BrowserRouter>
        </div>
    </div>
  );
}
  
export default App;