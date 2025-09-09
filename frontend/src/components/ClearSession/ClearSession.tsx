import React from 'react';

type ClearSessionProps = {
  children: React.ReactNode;
};

const ClearSession = ({ children }: ClearSessionProps) => {
  localStorage.clear();
  return <>{children}</>;
};

export default ClearSession;
