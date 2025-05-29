import { Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from '@/components';
import { Dashboard, Login, NotFound, Register } from '@/view';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
