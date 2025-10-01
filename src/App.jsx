import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Routes, Route } from 'react-router-dom';
import Payoutrequest from './pages/Payoutrequest';
import Loadwallet from './pages/LoadWallet';
import Payinsettlement from './pages/PayinSettlement';

function App() {
  return (
    <>
    <Header />
    <Sidebar />
      <div className="main-content h-screen">
        <Routes>
          <Route path="/payout-request" element={<Payoutrequest />} />
          <Route path="/load-wallet" element={<Loadwallet />} />
          <Route path="/payin-settlement" element={<Payinsettlement />} />
        </Routes>
      </div>
    </>
  );
}

export default App
