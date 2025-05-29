import './App.css';
import Login from './components/Login';
import ImageUpload from './components/ImageUpload';
import { useState } from 'react';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="app">
      <header>Write On Sight</header>
      {loggedIn ? (
        <ImageUpload setLoggedIn={setLoggedIn} />
      ) : (
        <Login setLoggedIn={setLoggedIn} />
      )}
    </div>
  );
}

export default App;