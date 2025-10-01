import React from "react";
import Layout from "../components/Layout";
import Table from "../components/Table";

const Scheme = () => {
  const schemecolumn = [
    { header: "SQ NO", accessor: "sqno" },
    { header: "Name", accessor: "name" },
    { header: "Status", accessor: "status" },
    { header: "Action", accessor: "action" },
  ];
  const schemedata = [
    { sqno: "1", name: "yuvraj", status: "active", action: "edit" },
    { sqno: "2", name: "Akash", status: "active", action: "edit" },
    { sqno: "3", name: "Aman", status: "active", action: "edit" },
    { sqno: "4", name: "Sahil", status: "active", action: "edit" },
  ];
  return (
    // <Layout>

    <div>
      <div
        className="bg-blue-500 flex justify-between item-center"
        style={{ margin: "0px  0px 20px 0px", padding: "10px" }}>
        <h4 className="font-bold text-white text-lg py-2">Scheme manager</h4>
        <button
          type="button"
          class="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
           + Add New
        </button>
      </div>
      <Table columns={schemecolumn} data={schemedata} />
    </div>
    // </Layout>
  );
};

export default Scheme;
