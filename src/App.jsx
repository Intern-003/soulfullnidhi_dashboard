// import { Header } from "./components/Header";
// import { Sidebar } from "./components/Sidebar";
import { Routes, Route } from 'react-router-dom';
import Payoutrequest from './pages/Payoutrequest';
import Scheme from './pages/Scheme';
import Layout from "./components/Layout";



function App() {
  return (
    <>
    {/* <Header />
    <Sidebar /> */}
    {/* <Layout> */}
      <div className="main-content h-screen">
        <Routes>
          <Route path="/payout-request" element={<Payoutrequest />} />
          <Route path="/Scheme" element={<Scheme />} />
        </Routes>
      </div>
      {/* </Layout> */}
    </>
  );
}

export default App
