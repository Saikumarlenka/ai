import logo from './logo.svg';
import './App.css';
import PromptInput from './components/PromptInput';
import { BrowserRouter as Router , Routes , Route } from 'react-router-dom';
import HomePage from './pages/HomePage';



function App() {
  return (
   <Router>
    <Routes>
      {/* <Route path='/auth' element={<AuthTabs />}></Route> */}
      <Route path='/ai' element={<HomePage />}></Route>
    </Routes>
   </Router>
  );
}

export default App;
