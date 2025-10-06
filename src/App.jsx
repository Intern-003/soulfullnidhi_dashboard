import { Routes, Route } from 'react-router-dom';
import Payoutrequest from './pages/Payoutrequest';
import Scheme from './pages/Scheme';
import Layout from "./components/Layout";
import Loadwallet from './pages/LoadWallet';
import Payinsettlement from './pages/PayinSettlement';
import LoginForm from './pages/LoginForm';
import { MemberOnboardForm } from './pages/MemberOnboardForm';
import { Member } from './pages/Member';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <>
    <Routes>
      <Route path="/login" element={<LoginForm />}></Route>
    </Routes>
    <Layout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/payout-request" element={<Payoutrequest />} />
          <Route path="/scheme" element={<Scheme />} />
          <Route path="/load-wallet" element={<Loadwallet />} />
          <Route path="/payin-settlement" element={<Payinsettlement />} />
          <Route path="/member-list" element={<Member />} />
          <Route path="/member-create" element={<MemberOnboardForm />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App
