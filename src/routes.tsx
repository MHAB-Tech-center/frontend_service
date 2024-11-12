import { lazy } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import SuspenseWithLoader from "./components/ui/suspense-with-loader";
import MainAppShell from "./components/layout/main-application-shell";

const Index = lazy(() => import("@/pages/index"));
const LoginForm = lazy(() => import("@/pages/login"));
const Logout = lazy(() => import("@/pages/logout"));
const Report = lazy(() => import("@/pages/report"));
const Reports = lazy(() => import("@/pages/inspection"));
const Inspectors = lazy(() => import("@/pages/inspectors"));
const Roles = lazy(() => import("@/pages/roles"));
const RMBRegister = lazy(() => import("@/pages/rmb-register"));
const RMBStaff = lazy(() => import("@/pages/rmb-staff"));
const RedirectInvitedInspectorToApp = lazy(
  () => import("@/pages/invited-inspector-to-app")
);

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
          path="/register"
          element={
            <SuspenseWithLoader>
              <RMBRegister />
            </SuspenseWithLoader>
          }
        />
        <Route
          path="/invite-inspector"
          element={
            <SuspenseWithLoader>
              <RedirectInvitedInspectorToApp />
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
          <Route path="/report" element={<Reports />} />
          <Route path="/report/:id" element={<Report />} />
          <Route path="/inspectors" element={<Inspectors />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/rmb-staff" element={<RMBStaff />} />
        </Route>
        {/* <Route path="/tmp" element={<ApplicationShell />} /> */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
