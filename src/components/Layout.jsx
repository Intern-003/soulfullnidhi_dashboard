import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gray-100 relative">

      {/* Sidebar fixed on the left */}
      <div className="w-65 min-h-screen fixed z-20">
        <Sidebar />
      </div>

      {/* Main content wrapper */}
      <div className="flex-1 ml-61 flex flex-col">

        {/* Header positioned behind sidebar */}
        <div className="sticky top-0 z-10 p-0 m-0">
          <Header />
        </div>

        {/* Centered page content */}
        <main className="flex-1 flex justify-center items-start px-6 py-6 mt-6 mb-6">
          <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-5xl border-2">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};

export default Layout;
