import logo from './logo.svg';
import './App.css';
import PromptInput from './components/PromptInput';
import { BrowserRouter as Router , Routes , Route } from 'react-router-dom';
import AuthTabs from './pages/AuthPage';


function App() {
  return (
   <Router>
    <Routes>
      <Route path='/auth' element={<AuthTabs />}></Route>
      <Route path='/' element={<PromptInput />}></Route>
    </Routes>
   </Router>
  );
}

export default App;
