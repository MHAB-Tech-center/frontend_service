import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const RedirectInvitedInspectorToApp = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    if (email) {
      window.location.href = `rmb-dmim://signup?email=${email}`;
    } else {
      window.location.href = `/`;
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-8" />
      <h1 className="text-2xl font-semibold text-center mb-4">
        Redirecting to app...
      </h1>
      <p className="text-gray-600 text-center">
        Please wait while we redirect you to the mobile application
      </p>
    </div>
  );
};

export default RedirectInvitedInspectorToApp;
