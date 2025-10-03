import { Routes, Route } from 'react-router-dom';
import Payoutrequest from './pages/Payoutrequest';
import Scheme from './pages/Scheme';
import Layout from "./components/Layout";
import Loadwallet from './pages/LoadWallet';
import Payinsettlement from './pages/PayinSettlement';
import LoginForm from './pages/LoginForm';

function App() {
  return (
    <>
    <Routes>
      <Route path="/login" element={<LoginForm />}></Route>
    </Routes>
    <Layout>
      <div className="main-content h-screen">
        <Routes>
          <Route path="/payout-request" element={<Payoutrequest />} />
          <Route path="/scheme" element={<Scheme />} />
          <Route path="/load-wallet" element={<Loadwallet />} />
          <Route path="/payin-settlement" element={<Payinsettlement />} />
        </Routes>
      </div>
      </Layout>
    </>
  );
}

export default App
