import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { UserProvider } from '../context/UserContext';
import { TicketProvider } from '../context/TicketContext';
import ProtectedRoute from '../components/ProtectedRoute';
import Splash from '../pages/Splash';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
import Tickets from '../pages/Tickets';
import Flights from '../pages/Flights';
import Bookings from '../pages/Bookings';
import DebugUsers from '../pages/DebugUsers';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <TicketProvider>
            <Routes>
              <Route path="/" element={<Splash />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tickets"
                element={
                  <ProtectedRoute>
                    <Tickets />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/flights"
                element={
                  <ProtectedRoute>
                    <Flights />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute>
                    <Bookings />
                  </ProtectedRoute>
                }
              />
              {/* <Route
                path="/debug-users"
                element={
                  <ProtectedRoute>
                    <DebugUsers />
                  </ProtectedRoute>
                }
              /> */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </TicketProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;


