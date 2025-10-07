import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen flex bg-gray-100 relative">
      <div className="w-65 min-h-screen fixed z-20">
        <Sidebar />
      </div>

      <div className="flex-1 ml-62 flex flex-col min-h-screen">
        <div className="sticky top-0 z-20 bg-white">
          <Header />
        </div>

        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="bg-white shadow-md rounded-lg w-full max-w-5xl border-2 mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
