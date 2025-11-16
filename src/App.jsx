// src/App.jsx

import { Routes, Route } from 'react-router'; // Import React Router

import NavBar from './components/NavBar/NavBar';
// Import the SignUpForm component
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import FavoritesList from './components/favorites/FavoritesList/FavoritesList';
import FavoriteButton from './components/favorites/FavoriteButton/FavoriteButton';
import { useContext } from 'react';
import { UserContext } from './contexts/UserContext';

const App = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <NavBar />

      <Routes>
        {
          user ?
          <>
            <Route path='/' element={<Dashboard/>}/>
            <Route path='/products' element={<h1>Producs</h1>}/>
            <Route path='/favs' element={<FavoritesList/>}/>
            <Route path='/profile' element={<h1>{user.username}</h1>}/>
            <Route path='/orders' element={<h1>ORDERS</h1>}/>
            <Route path='/test-tour' element={
              <main>
                <h1>Test Tour</h1>
                <p>This is a test tour page to test the FavoriteButton component</p>
                <FavoriteButton tourId="691a0aaeefb51079e5dc1fad" />
              </main>
            }/>
          </>
            :
            <Route path='/' element={<Landing/>}/>
        }
        <Route path='/sign-up' element={<SignUpForm />} />
        <Route path='/sign-in' element={<SignInForm />} />
      </Routes>
    </>
  );
};

export default App;

