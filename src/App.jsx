import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Routes, Route } from 'react-router-dom';
import Payoutrequest from './pages/Payoutrequest';

function App() {
  return (
    <>
    <Header />
    <Sidebar />
      <div className="main-content h-screen">
        <Routes>
          <Route path="/payout-request" element={<Payoutrequest />} />
        </Routes>
      </div>
    </>
  );
}

export default App
