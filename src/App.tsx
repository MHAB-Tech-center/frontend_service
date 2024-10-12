import { ToastContainer } from "react-toastify";
import { RecoilRoot } from "recoil";
import ErrorBoundary from "./components/ui/errorboundary";
import { AuthProvider } from "./hooks/useAuth";
import AppRoutes from "./routes";
import { Anchor, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "react-toastify/dist/ReactToastify.css";
import "@mantine/dates/styles.css";

function App() {
  return (
    <RecoilRoot>
      <ToastContainer />
      <ErrorBoundary>
        <AuthProvider>
          <MantineProvider
            theme={{
              components: {
                Anchor: Anchor.extend({
                  defaultProps: {
                    underline: "never",
                  },
                }),
              },
            }}
            defaultColorScheme="light"
          >
            <AppRoutes />
          </MantineProvider>
        </AuthProvider>
      </ErrorBoundary>
    </RecoilRoot>
  );
}

export default App;
