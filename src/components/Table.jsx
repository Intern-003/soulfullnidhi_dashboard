import { useState, useMemo, useEffect, useRef } from "react";
import Button from "./Button";
import { ConfirmModal } from "./ConfirmModal";
import { usePost } from "../hooks/usePost";
import { useToast } from "../contexts/ToastContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CustomSelect } from "./CustomSelect";


const Table = ({
  columns,
  data,
  showSearch = true,
  showPagination = true,
  showExport = true,
  showStatusFilter = true,
  showDeleteColumn = true,
  showDateFilter = true,
  showSelectUserFilter = false,
  endPoint = "", // ✅ Make sure each page passes the correct endpoint
  refreshTable,
  setData,
  statusList,
}) => {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [recordId, setRecordId] = useState(null);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [openExport, setOpenExport] = useState(false);
  const exportRef = useRef(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectData, setSelectData] = useState([]);
  const [selectedMerchant, setSelectedMerchant] = useState(null);

  useEffect(() => {
    const dataForSelect = Array.from(
      new Map(
        data?.map((item) => [
          item.user_id,
          { value: item.user_id, label: item.merchant_details },
        ])
      ).values()
    );
    setSelectData(dataForSelect);
  }, [data]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportRef.current && !exportRef.current.contains(event.target)) {
        setOpenExport(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Open modal and set recordId
  const handleConfirmModal = (id) => {
    setRecordId(id);
    setShowConfirmModal(true);
  };

  // ✅ Delete API using usePost
  const modifiedEndpoint = endPoint && recordId ? `${endPoint}/${recordId}` : null;
  const { execute: deleteRecord } = usePost(modifiedEndpoint || "");

  const handleDelete = async (e) => {
    e?.preventDefault();
    if (!recordId || !modifiedEndpoint) {
      console.log("Record ID or Endpoint missing!");
      return;
    }

    try {
      console.log("Deleting recordId:", recordId, "using endpoint:", modifiedEndpoint);
      const res = await deleteRecord({});
      console.log("Delete API response:", res);

      if (res) {
        toast.success("Record deleted successfully!");
        if (setData) {
          setData((prev) => prev.filter((row) => row.id !== recordId));
        }
        if (refreshTable) refreshTable();

        setShowConfirmModal(false);
        setRecordId(null);
      }
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error("Failed to delete record.");
    }
  };

  // ✅ Filtered data for table
  const filteredData = useMemo(() => {
    return data?.filter((row) => {

      const matchesSearch = Object.values(row).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      );
      
      const matchesStatus =
        !statusFilter ||
        statusFilter === "all" ||
        String(row.status).toLowerCase() === statusFilter.toLowerCase();
      
        const rowDate = new Date(row.date?.split("-")[0]);
      const matchesDate =
        (!startDate || rowDate >= startDate) &&
        (!endDate || rowDate <= endDate);
      
        const matchesMerchant =
        !selectedMerchant || row.user_id === selectedMerchant.value;

      setCurrentPage(1);
      return matchesSearch && matchesStatus && matchesDate && matchesMerchant;
    });
  }, [search, statusFilter, startDate, endDate, selectedMerchant, data]);




  const totalSuccessAmount = useMemo(() => {
    if (!filteredData?.length) return 0;
  
    return filteredData
      .filter((row) => String(row.status).toLowerCase() === "success")
      .reduce((sum, row) => sum + (isNaN(row.numericAmount) ? 0 : row.numericAmount), 0);
  }, [filteredData]);

  // ✅ Export functions
  const downloadFile = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const headers = columns.map((c) => c.header).join(",");
    const rows = filteredData
      .map((row) => columns.map((c) => `"${row[c.accessor] ?? ""}"`).join(","))
      .join("\n");
    downloadFile(`${headers}\n${rows}`, "table.csv", "text/csv");
  };

  const exportJSON = () => {
    downloadFile(JSON.stringify(filteredData, null, 2), "table.json", "application/json");
  };

  const exportTXT = () => {
    const headers = columns.map((c) => c.header).join(" | ");
    const rows = filteredData
      .map((row) => columns.map((c) => row[c.accessor]).join(" | "))
      .join("\n");
    downloadFile(`${headers}\n${rows}`, "table.txt", "text/plain");
  };

  const exportSQL = () => {
    const tableName = "export_table";
    const sqlRows = filteredData
      .map((row) => {
        const values = columns
          .map((c) => {
            const val = row[c.accessor];
            if (val === null || val === undefined) return "NULL";
            if (typeof val === "number") return val;
            return `'${String(val).replace(/'/g, "''")}'`;
          })
          .join(", ");
        return `INSERT INTO ${tableName} (${columns.map((c) => c.accessor).join(", ")}) VALUES (${values});`;
      })
      .join("\n");
    downloadFile(sqlRows, "table.sql", "text/sql");
  };

  // ✅ Months/Years for custom header in DatePicker
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const years = Array.from({ length: 20 }, (_, i) => 2020 + i);
  
  const customHeader = ({ date, changeMonth, changeYear }) => (
    <div className="flex justify-between items-center px-2 py-1 bg-gradient-to-r from-sky-200 to-indigo-200 rounded-t-lg">
      <select
        value={months[date.getMonth()]}
        onChange={(e) => changeMonth(months.indexOf(e.target.value))}
        className="bg-white text-sky-800 rounded px-2 py-1 border border-sky-300"
      >
        {months.map((month) => <option key={month}>{month}</option>)}
      </select>
  
      <select
        value={date.getFullYear()}
        onChange={(e) => changeYear(Number(e.target.value))}
        className="bg-white text-sky-800 rounded px-2 py-1 border border-sky-300"
      >
        {years.map((year) => <option key={year}>{year}</option>)}
      </select>
    </div>
  );

  

  return (
    <div className="w-full">
      {/* ✅ Filters and Export UI */}
      {(showSearch || showStatusFilter || showExport || showDateFilter || showSelectUserFilter) && (
        <div className="flex flex-col md:flex-row justify-between items-center w-full gap-2 mb-3">
          <div className="flex flex-wrap md:flex-row items-center gap-2 flex-1">
            {showSearch && (
              <div className="relative w-52 md:w-64">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </span>
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full rounded-lg border border-sky-500 px-10 py-2 text-sm shadow-sm focus:ring-2 focus:ring-sky-400 focus:outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            )}

            {showSelectUserFilter && (
              <div className="w-52 md:w-64">
                <CustomSelect
                  options={selectData}
                  placeholder="Select Merchant"
                  value={selectedMerchant}
                  onChange={(option) => setSelectedMerchant(option)}
                />
              </div>
            )}

            {showDateFilter && (
              <div className="flex items-center gap-2">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Select start date"
                  renderCustomHeader={customHeader}
                  className="border border-sky-500 text-sky-900 font-medium text-sm rounded-lg w-44 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 hover:bg-sky-100 transition"
                />
                <span className="text-gray-500">to</span>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  placeholderText="Select end date"
                  renderCustomHeader={customHeader}
                  className="border border-sky-500 text-sky-900 font-medium text-sm rounded-lg w-44 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 hover:bg-sky-100 transition"
                />
              </div>
            )}

            {showStatusFilter && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 bg-white text-gray-700 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 hover:shadow-sm transition duration-300"
              >
                <option value="all">All</option>
                {statusList?.map((item, index) => <option key={index} value={item}>{item}</option>)}
              </select>
            )}

            {showExport && (
              <div ref={exportRef} className="relative">
                <button
                  onClick={() => setOpenExport(!openExport)}
                  className="flex items-center gap-1 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-300 transition"
                >
                  <i className="fa-solid fa-download"></i> Export
                </button>
                {openExport && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-blue-200 shadow-lg rounded-lg text-sm text-gray-700 z-50 overflow-hidden">
                    <ul>
                      <li><button onClick={exportCSV} className="flex items-center gap-2 w-full px-4 py-2 hover:bg-blue-100"><i className="fa-solid fa-file-csv"></i> CSV</button></li>
                      <li><button onClick={exportJSON} className="flex items-center gap-2 w-full px-4 py-2 hover:bg-blue-100"><i className="fa-solid fa-file-code"></i> JSON</button></li>
                      <li><button onClick={exportTXT} className="flex items-center gap-2 w-full px-4 py-2 hover:bg-blue-100"><i className="fa-solid fa-file-lines"></i> TXT</button></li>
                      <li><button onClick={exportSQL} className="flex items-center gap-2 w-full px-4 py-2 hover:bg-blue-100"><i className="fa-solid fa-database"></i> SQL</button></li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Side: Total + Clear */}
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 mt-2 md:mt-0">
            {showSelectUserFilter && (
              <div className="flex items-center gap-2 text-sm md:text-base font-semibold text-green-700 bg-green-50 px-3 py-2 rounded-lg shadow-sm">
                <i className="fa-solid fa-circle-check text-green-600"></i>
                <span>Total Successful: ₹{totalSuccessAmount.toFixed(2)}</span>
              </div>
            )}

            <Button
              className="flex items-center gap-1 bg-white-100 text-white-700 hover:bg-blue-400 transition px-4 py-2 rounded-md text-xs md:text-sm font-medium shadow-sm"
              onClick={() => {
                setStartDate(null);
                setEndDate(null);
                setStatusFilter("all");
                setSearch("");
                setSelectedMerchant(null);
              }}
            >
              <i className="fa-solid fa-arrow-rotate-left text-white-700 text-sm"></i>
              <span>Clear All</span>
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-lg w-full overflow-x-auto border border-sky-300 mt-6">
        <table className="min-w-full table-fixed text-sm text-left text-gray-700 border-collapse">
          <thead className="uppercase text-white tracking-wide" style={{ background: "linear-gradient(90deg, #007BFF, #00C8FF)" }}>
            <tr>
              {columns.map((column, index) => (
                <th key={index} className="font-semibold text-md px-4 py-3 text-left whitespace-nowrap border-b border-white/30">
                  {column.header}
                </th>
              ))}
              {showDeleteColumn && <th className="font-semibold text-md px-4 py-3 text-left whitespace-nowrap border-b border-white/30">Delete</th>}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage).map((row, rowIndex) => (
                <tr key={row.id} className={`${rowIndex % 2 === 0 ? "bg-[#f1f7ff]" : "bg-white"} hover:bg-[#e0f0ff] transition-all duration-150 border-b border-gray-200`}>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-4 py-3 text-gray-800 text-left truncate text-sm md:text-base font-normal">
                      {column.Cell ? column.Cell({ value: row[column.accessor], row }) : row[column.accessor]}
                    </td>
                  ))}

                  {showDeleteColumn && (
                    // <td className="px-4 py-3">
                    //   <Button type="button" onClick={() => handleConfirmModal(row.id)} className="text-red-800 p-3 rounded-xl cursor-pointer">
                    //     <i className="fa-solid fa-trash fa-lg"></i>
                    //   </Button>
                    // </td>
                    <td className="px-4 py-3">
                    <Button
                      type="button"
                      onClick={() =>
                        handleConfirmModal(
                          row.id || row.ticket_id || row.complain_id || row.record_id
                        )
                      }
                      className="text-red-800 p-3 rounded-xl cursor-pointer"
                    >
                      <i className="fa-solid fa-trash fa-lg"></i>
                    </Button>
                  </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={showDeleteColumn ? columns.length + 1 : columns.length} className="text-center text-gray-600 py-6 bg-white font-medium">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {showPagination && (
          <div className="flex flex-col md:flex-row justify-between items-center bg-white px-4 py-3 rounded-b-lg border-t border-sky-200 mt-3">
  
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>Show</span>
              <select value={entriesPerPage} onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }} className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-sky-400 focus:outline-none">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
              <span>entries</span>
            </div>
  
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`px-3 py-1 text-sm rounded-md font-medium transition ${currentPage === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-sky-200 to-indigo-200 text-sky-900 hover:from-sky-300 hover:to-indigo-300"}`}>Prev</Button>
              <span className="text-sm text-gray-700">Page <span className="font-semibold">{currentPage}</span></span>
              <Button onClick={() => setCurrentPage((prev) => prev < Math.ceil(filteredData.length / entriesPerPage) ? prev + 1 : prev)} disabled={currentPage === Math.ceil(filteredData.length / entriesPerPage)} className={`px-3 py-1 text-sm rounded-md font-medium transition ${currentPage === Math.ceil(filteredData.length / entriesPerPage) ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-sky-200 to-indigo-200 text-sky-900 hover:from-sky-300 hover:to-indigo-300"}`}>Next</Button>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Confirm Modal */}
      <ConfirmModal
        showConfirmModal={showConfirmModal}
        handleConfirmModal={() => setShowConfirmModal(false)}
        action={handleDelete}
        heading="Confirm Delete"
        body="Are you sure you want to delete this record?"
      />
    </div>
  );
};

export default Table;
