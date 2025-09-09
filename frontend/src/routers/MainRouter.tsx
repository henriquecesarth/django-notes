import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Home from '../pages/Home/Home';
import NotFound from '../pages/NotFound/NotFound';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import ClearSession from '../components/ClearSession/ClearSession';

const MainRouter = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path='/login' element={<Login />} />
          <Route
            path='/logout'
            element={
              <ClearSession>
                <Navigate to='/login' />
              </ClearSession>
            }
          />
          <Route
            path='/register'
            element={
              <ClearSession>
                <Register />
              </ClearSession>
            }
          />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default MainRouter;
