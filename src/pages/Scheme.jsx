import { useState, useEffect } from "react";
import Table from "../components/Table";
import { SchemeModal } from "../components/SchemeModal";
import Toggle from "../components/Toggle";
import Button from "../components/Button";
import { useGet } from "../hooks/useGet"; // <-- import your hook
import { usePost } from "../hooks/usePost";
import { TOGGLE_STATUSES } from "../constants/Constants"

const Scheme = () => {
  const [showModal, setShowModal] = useState(false);
  const [schemedata, setSchemeData] = useState([]);
  const [editData, setEditData] = useState(null);
  const StatusToggle = ({ id, value, sqno, onToggle }) => {
    const handleChange = (checked) => {
      if (onToggle) onToggle(id, sqno, checked);
    };

    return (
      <Toggle defaultChecked={value === "Active"} onChange={handleChange} />
    );
  };

  // ✅ Use your hook to fetch schemes
  const { data, loading, error, refetch } = useGet("/get-scheme"); // replace endpoint with your actual API endpoint
  const { execute: updateStatus } = usePost("/update-scheme-status");

  // ✅ Format data whenever "data" changes
  useEffect(() => {
    if (data?.data) {
      const formattedData = data.data.map((item, index) => ({
        id: item.id,
        sqno: index + 1,
        name: item.name,
        status: item.status ? "Active" : "Inactive",
        action: (
          <Button
            onClick={() => handleEdit(item)}
            className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-md"
          >
            Edit
          </Button>
        ),
      }));
      setSchemeData(formattedData);
    }
  }, [data]);

  const handleModal = () => {
    setShowModal((prev) => !prev);
    if (showModal) setEditData(null);
  };

  const handleEdit = (scheme) => {
    console.log("Editing:", scheme);
    setEditData(scheme);
    setShowModal(true);
  };

  const handleStatusToggle = async (id, sqno, checked) => {
    const res = await updateStatus({ scheme_id: id, status: checked });
    if (res) {
      setSchemeData((prev) =>
        prev.map((item) =>
          item.sqno === sqno
            ? { ...item, status: checked ? "Active" : "Inactive" }
            : item
        )
      );
    }
  };

  const schemecolumn = [
    { header: "SQ NO", accessor: "sqno" },
    { header: "Name", accessor: "name" },
    {
      header: "Status",
      accessor: "status",
      Cell: ({ value, row }) => (
        <StatusToggle
          value={value}
          sqno={row.sqno}
          id={row.id}
          onToggle={handleStatusToggle}
        />
      ),
    },
    { header: "Action", accessor: "action" },
  ];

  return (
    <div>
      <div
        className="bg-gradient-to-t from-sky-500 to-indigo-500 flex justify-between items-center"
        style={{ margin: "0 0 20px 0", padding: "10px" }}
      >
        <h4 className="font-bold text-white text-lg py-2">Scheme Manager</h4>
        <Button
          className="cursor-pointer"
          type="button"
          variant="AddNewBtn"
          onClick={handleModal}
        >
          ADD NEW
        </Button>
        <SchemeModal
          showModal={showModal}
          handleModal={handleModal}
          editData={editData}
          refreshTable={refetch}
        />
      </div>

      {loading ? (
        <div className="text-center py-6 text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center py-6 text-red-500">Error: {error}</div>
      ) : (
        <Table
          columns={schemecolumn}
          data={schemedata}
          showDateFilter={false}
          endPoint="/delete-scheme"
          refreshTable={refetch}
          statusList={TOGGLE_STATUSES}
        />
      )}
    </div>
  );
};

export default Scheme;
