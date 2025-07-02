import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminPanel from './pages/AdminPenal'; 
import VacationPanel from './pages/VacationPanel';
import ClassesPanel from './pages/ClassesPenal';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import RequestOTP from './pages/RequestOTP';
import VerifyOTP from './pages/VerifyOTP';
import UserManagementPanel from './pages/UserManagementPenal';
import VacationViewer from './pages/VacationViewer'; 
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
        <Route path="/request-otp" element={<RequestOTP />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />    

        <Route path="/admin-panel" element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminPanel />
          </PrivateRoute>
        } />

        <Route path="/admin-panel/vacation" element={
          <PrivateRoute allowedRoles={['admin']}>
            <VacationPanel />
          </PrivateRoute>
        } />

        <Route path="/admin-panel/classes" element={
          <PrivateRoute allowedRoles={['admin']}>
            <ClassesPanel />
          </PrivateRoute>
        } />


        <Route path="/admin-panel/user" element={
          <PrivateRoute allowedRoles={['admin']}>
            <UserManagementPanel />
          </PrivateRoute>
        } />

        <Route path="/vacations" element={
          <PrivateRoute allowedRoles={['student', 'teacher']}>
            <VacationViewer />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
