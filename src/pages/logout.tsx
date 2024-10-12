import useAuth from "@/hooks/useAuth";
import React from "react";

const Logout = () => {
  const { logout } = useAuth();
  React.useEffect(() => {
    logout();
  }, [logout]);
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <p>Logging you out...</p>
    </div>
  );
};

export default Logout;
