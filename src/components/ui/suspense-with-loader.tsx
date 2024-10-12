import React, { Suspense } from "react";

interface Props {
  children: React.ReactNode;
}

const SuspenseWithLoader = ({ children }: Props) => {
  return <Suspense fallback={<SuspenseLoader />}>{children}</Suspense>;
};

export default SuspenseWithLoader;

export const SuspenseLoader = () => (
  <div className="flex items-center justify-center w-full h-full">
    <span className="text-gray-400">Loading...</span>
  </div>
);
