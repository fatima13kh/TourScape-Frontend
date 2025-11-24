import { Routes, Route, useNavigate } from 'react-router';
import { useContext } from 'react';
import { UserContext } from './contexts/UserContext';

import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import FavoritesList from './components/favorites/FavoritesList/FavoritesList';
import ToursList from './components/tours/ToursList/ToursList';
import TourForm from './components/TourForm/TourForm';
import { tourService } from './services/tourService';
import Companies from './components/Companies/Companies';
import CompanyDetail from './components/CompanyDetail/CompanyDetail';
import Tours from './components/Tours/Tours';
import TourDetail from './components/TourDetail/TourDetail';
import TourEdit from './components/TourEdit/TourEdit';
import Profile from './components/Profile/Profile';
import './App.css';

const App = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleAddTour = async (tourFormData) => {
    const newTour = await tourService.create(tourFormData);
    console.log('New tour created:', newTour);
    navigate('/');
  };

  return (
    <>
      <NavBar />

      <Routes>
        {/* Public routes */}
        <Route path='/sign-up' element={<SignUpForm />} />
        <Route path='/sign-in' element={<SignInForm />} />
        <Route path='/tours/new' element={<TourForm handleAddTour={handleAddTour} />} />
        
        {/* Companies routes */}
        <Route path='/companies' element={<Companies />} />
        <Route path='/companies/:companyId' element={<CompanyDetail />} />
        
        {/* Tours routes */}
        <Route path='/tours/:tourId' element={<TourDetail />} />
        
        {/* Conditional routes based on authentication */}
        {user ? (
          <>
            <Route path='/' element={<Dashboard/>}/>
            <Route path='/profile' element={<Profile />} />
            <Route path='/tours/:tourId/edit' element={<TourEdit />} />
            <Route path='/tours' element={<ToursList/>}/>
            <Route path='/favs' element={<FavoritesList/>}/>
            <Route path='/profile' element={<h1>{user.username}</h1>}/>
            <Route path='/orders' element={<h1>ORDERS</h1>}/>
          </>
        ) : (
          <Route path='/' element={<Landing/>}/>
        )}
        
        {/* Catch all route */}
        <Route path='*' element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </>
  );
};

export default App;