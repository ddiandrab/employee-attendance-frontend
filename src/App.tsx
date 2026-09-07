import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import {
  AuthProvider,
} from './auth/auth.context';

import {
  ProtectedRoute,
} from './auth/protected-route';

import {
  LoginPage,
} from './pages/LoginPage';

import {
  DashboardPage,
} from './pages/DashboardPage';

import {
  EmployeesPage,
} from './pages/EmployeesPage';
import { ProfilePage } from './pages/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          <Route
            path="/login"
            element={<LoginPage />}
          />

          {/* Authenticated routes */}
          <Route
            element={
              <ProtectedRoute />
            }
          >
            <Route
              path="/dashboard"
              element={
                <DashboardPage />
              }
            />
            <Route
              path="/profile"
              element={
                <ProfilePage />
              }
            />
          </Route>

          {/* HR + Admin */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={[
                  'ADMIN',
                  'HR',
                ]}
              />
            }
          >
            <Route
              path="/employees"
              element={
                <EmployeesPage />
              }
            />
          </Route>

          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;