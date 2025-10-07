import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Table from "../components/Table";
import { SchemeModal } from "../components/SchemeModal";
import Toggle from "../components/Toggle";
import Button from "../components/Button";

const Scheme = () => {
  // ✅ States
  const [showModal, setShowModal] = useState(false);
  const [schemedata, setSchemeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Table Columns
  const schemecolumn = [
    { header: "SQ NO", accessor: "sqno" },
    { header: "Name", accessor: "name" },
    {
      header: "Status",
      accessor: "status",
      Cell: ({ value, row }) => (
        <Toggle
          defaultChecked={value === "Active"}
          onChange={(checked) => handleStatusToggle(row.sqno, checked)}
        />
      ),
    },
    { header: "Action", accessor: "action" },
  ];

  // ✅ Toggle Modal
  const handleModal = () => setShowModal((prev) => !prev);

  // ✅ Dummy Data (temporary until API is ready)
  const dummyData = [
    { name: "Yuvraj", status: "Active" },
    { name: "Akash", status: "Inactive" },
    { name: "Aman", status: "Pending" },
    { name: "Sahil", status: "Active" },
    { name: "Yuvraj", status: "Active" },
    { name: "Akash", status: "Inactive" },
    { name: "Aman", status: "Pending" },
    { name: "Sahil", status: "Active" },
  ];

  // ✅ Fetch Data (for now using dummy data)
  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        setLoading(true);

        // 🟢 WHEN API IS READY, UNCOMMENT BELOW:
        /*
        const response = await fetch("http://localhost:5000/api/schemes");
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        */

        // 🟣 TEMPORARY — simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // 🟢 Replace "data" with "dummyData" for now
        const data = dummyData;

        // ✅ Format data for table
        const formattedData = data.map((item, index) => ({
          sqno: index + 1,
          name: item.name,
          status: item.status,
          action: (
            <button
              onClick={() => handleEdit(item)}
              className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-md"
            >
              Edit
            </button>
          ),
        }));

        setSchemeData(formattedData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  // ✅ Edit button handler
  const handleEdit = (scheme) => {
    console.log("Editing:", scheme);
    setShowModal(true);
    // You can pass scheme data to modal here later
  };

  // ✅ Toggle status handler
  const handleStatusToggle = (sqno, checked) => {
    setSchemeData((prev) =>
      prev.map((item) =>
        item.sqno === sqno
          ? { ...item, status: checked ? "Active" : "Inactive" }
          : item
      )
    );
  };

  return (
    // <Layout>
    <div>
      {/* Header Section */}
      <div
        className="bg-gradient-to-t from-sky-500 to-indigo-500 flex justify-between items-center"
        style={{ margin: "0px  0px 20px 0px", padding: "10px" }}
      >
        <h4 className="font-bold text-white text-lg py-2">Scheme Manager</h4>

        {/* Add New Button */}
        {/* <button
          type="button"
          onClick={handleModal}
          className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 
            hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 
            shadow-lg font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          + Add New
        </button> */}
        <Button type="button" variant="AddNewBtn" onClick={handleModal}>ADD NEW</Button>

        {/* Modal */}
        <SchemeModal showModal={showModal} handleModal={handleModal} />
      </div>

      {/* Table / Loader / Error */}
      {loading ? (
        <div className="text-center py-6 text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center py-6 text-red-500">Error: {error}</div>
      ) : (
        <Table columns={schemecolumn} data={schemedata} />
      )}
    </div>
    // </Layout>
  );
};

export default Scheme;
