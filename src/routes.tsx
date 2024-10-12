import { lazy } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import SuspenseWithLoader from "./components/ui/suspense-with-loader";
import MainAppShell from "./components/layout/main-application-shell";

const Index = lazy(() => import("@/pages/index"));
const LoginForm = lazy(() => import("@/pages/login"));
const Logout = lazy(() => import("@/pages/logout"));

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <SuspenseWithLoader>
              <LoginForm />
            </SuspenseWithLoader>
          }
        />
        <Route
          path="/logout"
          element={
            <SuspenseWithLoader>
              <Logout />
            </SuspenseWithLoader>
          }
        />
        <Route
          path="/"
          element={
            <SuspenseWithLoader>
              <MainAppShell />
            </SuspenseWithLoader>
          }
        >
          <Route index element={<Index />} />
        </Route>
        {/* <Route path="/tmp" element={<ApplicationShell />} /> */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
