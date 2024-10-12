import { lazy } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import SuspenseWithLoader from "./components/ui/suspense-with-loader";

const Index = lazy(() => import("@/pages/index"));

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <SuspenseWithLoader>
              <Index />
            </SuspenseWithLoader>
          }
        ></Route>
        {/* <Route path="/tmp" element={<ApplicationShell />} /> */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
