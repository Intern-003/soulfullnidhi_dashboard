// import { Header } from "./components/Header";
// import { Sidebar } from "./components/Sidebar";
import { Routes, Route } from 'react-router-dom';
import Payoutrequest from './pages/Payoutrequest';
import Scheme from './pages/Scheme';
import Layout from "./components/Layout";
import Loadwallet from './pages/LoadWallet';
import Payinsettlement from './pages/PayinSettlement';

function App() {
  return (
    <>
    {/* <Header />
    <Sidebar /> */}
    <Layout>
      <div className="main-content h-screen">
        <Routes>
          <Route path="/payout-request" element={<Payoutrequest />} />
<<<<<<< HEAD
          <Route path="/Scheme" element={<Scheme />} />
          <Route path="/load-wallet" element={<Loadwallet />} />
          <Route path="/payin-settlement" element={<Payinsettlement />} />
=======
          <Route path="/scheme" element={<Scheme />} />
>>>>>>> dc9983c7dfb9343eaca0238bc27df3a6a246319a
        </Routes>
      </div>
      </Layout>
    </>
  );
}

export default App
