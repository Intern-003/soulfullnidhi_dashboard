import { Routes, Route } from "react-router-dom";
import Scheme from "./pages/Scheme";
import Layout from "./components/Layout";
import Loadwallet from "./pages/LoadWallet";
import Payinsettlement from "./pages/PayinSettlement";
import Payoutrequest from "./pages/Payoutrequest";

import LoginForm from "./pages/LoginForm";
import { MemberOnboardForm } from "./pages/MemberOnboardForm";
import { Member } from "./pages/Member";
import { Dashboard } from "./pages/Dashboard";
import UpiStatement from "./pages/UpiStatement";
import PayoutStatement from "./pages/PayoutStatement";
import { ViewComplain } from "./pages/ViewComplain";
import Payinrequest from "./pages/payinRequest";
import OnboardBank from "./pages/OnboardBank";
import Payindoc from "./pages/payindoc";
import Acc_upi_setlement from "./pages/Acc_upi_setlement";
import Acc_topup_settlement from "./pages/Acc_topup_settlement";
import PayoutDoc from "./pages/PayoutDoc";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginForm />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/payout-request" element={<Payoutrequest />} />
          <Route path="/payin-request" element={<Payinrequest />} />
          <Route path="/scheme" element={<Scheme />} />
          <Route path="/load-wallet" element={<Loadwallet />} />
          <Route path="/payin-settlement" element={<Payinsettlement />} />
          <Route path="/member-list" element={<Member />} />
          <Route path="/member-create" element={<MemberOnboardForm />} />
          <Route path="/upi-statement" element={<UpiStatement />} />
          <Route path="/payout-statement" element={<PayoutStatement />} />
          <Route path="/view-complain" element={<ViewComplain />} />
          <Route path="/onboard-bank" element={< OnboardBank/>} />  
          <Route path ="/payin-doc" element={ < Payindoc/> }/>
          <Route path="/payout-doc" element={<PayoutDoc/>} />
          <Route path="/topup-settlement" element={< Acc_topup_settlement/>} />
          <Route path="/account upi settlement" element={< Acc_upi_setlement/>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
