import { BrowserRouter, Navigate, Route, Routes, NavLink } from 'react-router-dom';
import { routes } from '@/navigation/routes.jsx';
import { UserProvider } from '@/context/UserContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import ErrorBoundaryError from '@/components/ErrorBoundaryError';
import { createClient } from "@supabase/supabase-js";


//const supabase = createClient(process.env.ProjectUrl, process.env.AnonKey);

export function App() {



  return (
    <UserProvider>
      <BrowserRouter>
        <ErrorBoundary fallback={ErrorBoundaryError}>
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<route.Component />}
              />
            ))}
            <Route path="*" element={<Navigate to="/not_found" replace />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;