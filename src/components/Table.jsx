import { useState, useMemo, useEffect, useRef } from "react";
import Button from "./Button";
import { ConfirmModal } from "./ConfirmModal";
import { usePost } from "../hooks/usePost";
import { useToast } from "../contexts/ToastContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CustomSelect } from "./CustomSelect";
import nodata from "../images/nodatafound.jpeg";

const Table = ({
  columns,
  data = [],
  showSearch = true,
  showPagination = true,
  showExport = true,
  showStatusFilter = true,
  showDeleteColumn = true,
  showDateFilter = true,
  showSelectUserFilter = false,
  endPoint = "",
  refreshTable,
  setData,
  statusList,
}) => {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [recordId, setRecordId] = useState(null);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [selectData, setSelectData] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const exportRef = useRef(null);

  // Prepare merchant select options
  useEffect(() => {
    const dataForSelect = Array.from(
      new Map(
        data?.map((item) => [
          item.user_id,
          { value: item.user_id, label: item.user || item.merchant_details },
        ])
      ).values()
    );
    setSelectData(dataForSelect);
  }, [data]);

  // Close export dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportRef.current && !exportRef.current.contains(event.target)) {
        setOpenExport(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle confirm modal for deletion
  const handleConfirmModal = (id) => {
    setRecordId(id);
    setShowConfirmModal(true);
  };

  const modifiedEndpoint = endPoint && recordId ? `${endPoint}/${recordId}` : null;
  const { execute: deleteRecord } = usePost(modifiedEndpoint || "");

  const handleDelete = async () => {
    if (!recordId || !modifiedEndpoint) return;
    try {
      await deleteRecord({});
      toast.success("Record deleted successfully!");
      if (setData) {
        setData((prev) => prev.filter((row) => row.id !== recordId));
      }
      if (refreshTable) refreshTable();
      setShowConfirmModal(false);
      setRecordId(null);
    } catch (err) {
      toast.error("Failed to delete record.");
    }
  };

  // Filtered data based on search, status, date, and merchant
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const matchesSearch = Object.values(row).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      );

      const matchesStatus =
        !statusFilter ||
        statusFilter === "all" ||
        String(row.status).toLowerCase() === statusFilter.toLowerCase();

      const rowDate = row.date ? new Date(row.date) : null;
      const matchesDate =
        (!startDate || (rowDate && rowDate >= startDate)) &&
        (!endDate || (rowDate && rowDate <= endDate));

      const matchesMerchant =
        !selectedMerchant || row.user_id === selectedMerchant.value;

      return matchesSearch && matchesStatus && matchesDate && matchesMerchant;
    });
  }, [search, statusFilter, startDate, endDate, selectedMerchant, data]);

  const totalSuccessAmount = useMemo(() => {
    if (!filteredData.length) return 0;
    return filteredData
      .filter((row) => String(row.status).toLowerCase() === "success")
      .reduce((sum, row) => sum + (isNaN(row.numericAmount) ? 0 : row.numericAmount), 0);
  }, [filteredData]);

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  // DatePicker custom header
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const years = Array.from({ length: 20 }, (_, i) => 2020 + i);
  const customHeader = ({ date, changeMonth, changeYear }) => (
    <div className="flex justify-between items-center px-2 py-1 bg-gradient-to-r from-sky-200 to-indigo-200 rounded-t-lg">
      <select
        value={months[date.getMonth()]}
        onChange={(e) => changeMonth(months.indexOf(e.target.value))}
        className="bg-white text-sky-800 rounded px-2 py-1 border border-sky-300"
      >
        {months.map((m) => <option key={m}>{m}</option>)}
      </select>
      <select
        value={date.getFullYear()}
        onChange={(e) => changeYear(Number(e.target.value))}
        className="bg-white text-sky-800 rounded px-2 py-1 border border-sky-300"
      >
        {years.map((y) => <option key={y}>{y}</option>)}
      </select>
    </div>
  );

  // Export handlers
  // const exportCSV = () => {
  //   const rows = filteredData.map(row => columns.map(col => row[col.accessor]));
  //   const csvContent =
  //     "data:text/csv;charset=utf-8," +
  //     [columns.map(col => col.header).join(","), ...rows.map(r => r.join(","))].join("\n");
  //   const encodedUri = encodeURI(csvContent);
  //   const link = document.createElement("a");
  //   link.href = encodedUri;
  //   link.download = "table_export.csv";
  //   link.click();
  // };
// Recursively extract text from React element objects
// Extract text from nested objects or React elements
// Safely extract text from React elements, arrays, primitives
const extractText = (element) => {
  if (element === null || element === undefined) return "";

  if (typeof element === "string" || typeof element === "number") {
    return String(element);
  }

  if (Array.isArray(element)) {
    return element.map(extractText).join(" | ");
  }

  // Detect React Elements: react elements have $$typeof symbol
  if (typeof element === "object" && element.$$typeof) {
    return extractText(element.props?.children);
  }

  // Generic object -> flatten values
  if (typeof element === "object") {
    return Object.values(element).map(extractText).join(" | ");
  }

  return String(element);
};

// Flatten plain objects only — ignores React elements & circulars
const flattenObject = (obj, prefix = "", seen = new WeakSet()) => {
  const result = {};

  if (obj === null || typeof obj !== "object") return result;

  if (seen.has(obj)) return result; // prevent circular recursion
  seen.add(obj);

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    // Ignore React elements: treat them as text
    if (value?.$$typeof) {
      result[newKey] = extractText(value);
      continue;
    }

    // If value is plain object → recurse
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, newKey, seen));
      continue;
    }

    // Arrays → map to text
    if (Array.isArray(value)) {
      result[newKey] = value.map(extractText).join(" | ");
      continue;
    }

    // Primitives
    result[newKey] = extractText(value);
  }

  return result;
};

// Escape CSV values safely
const escapeCSVValue = (val) => {
  if (val === null || val === undefined) return "";
  let str = String(val);
  if (str.includes('"')) str = str.replace(/"/g, '""');
  if (str.includes(",") || str.includes("\n") || str.includes('"')) str = `"${str}"`;
  return str;
};

// Normalize row (you can keep your custom logic)
const normalizeRow = (row) => flattenObject(row);

// Export CSV
const exportCSV = () => {
  if (!filteredData.length) return;

  const normalizedRows = filteredData.map(normalizeRow);
  const headers = Array.from(new Set(normalizedRows.flatMap(row => Object.keys(row))));

  const csvRows = normalizedRows.map(row =>
    headers.map(header => escapeCSVValue(row[header])).join(",")
  );

  const csvContent = "data:text/csv;charset=utf-8," +
    [headers.join(","), ...csvRows].join("\n");

  const link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = "table_export.csv";
  link.click();
};


  const exportJSON = () => {
    const json = JSON.stringify(filteredData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "table_export.json";
    link.click();
  };

  return (
    <div className="w-full  mx-auto px-2 sm:px-0">
      {/* FILTER BAR */}
      {(showSearch || showStatusFilter || showExport || showDateFilter || showSelectUserFilter) && (
        <div className="w-full bg-white shadow-md rounded-xl p-4 mb-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 w-full">
            <div className="flex flex-wrap items-center gap-4 lg:max-w-[65%]">
              {showSearch && (
                <div className="relative w-56">
                  <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-sky-400 outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              )}
              {showSelectUserFilter && (
                <div className="w-56">
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
                    placeholderText="Start Date"
                    className="border border-gray-300 rounded-lg px-3 py-2 shadow-sm w-40"
                    renderCustomHeader={customHeader}
                  />
                  <span className="text-gray-500 font-medium">→</span>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    placeholderText="End Date"
                    className="border border-gray-300 rounded-lg px-3 py-2 shadow-sm w-40"
                    renderCustomHeader={customHeader}
                  />
                </div>
              )}
              {showStatusFilter && (
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 bg-white rounded-lg px-3 py-2 shadow-sm font-medium"
                >
                  <option value="all">All</option>
                  {statusList?.map((item, idx) => (
                    <option key={idx} value={item}>{item}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex items-center gap-3 ml-auto flex-wrap">
              {showExport && (
                <div className="relative" ref={exportRef}>
                  <Button
                    onClick={() => setOpenExport(!openExport)}
                    className="bg-yellow-400 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-500 transition flex items-center gap-2 min-w-[110px] h-[42px] justify-center"
                  >
                    <i className="fa-solid fa-download"></i> Export
                  </Button>
                  {openExport && (
                    <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg p-2 w-40 z-50">
                      <button onClick={exportCSV} className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md">CSV</button>
                      <button onClick={exportJSON} className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md">JSON</button>
                    </div>
                  )}
                </div>
              )}

              <Button
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg shadow-md transition min-w-[110px] h-[42px] flex items-center justify-center"
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                  setStatusFilter("all");
                  setSearch("");
                  setSelectedMerchant(null);
                }}
              >
                Clear All
              </Button>
            </div>
          </div>

          {/* Total Successful Amount */}
          {showSelectUserFilter && (
            <div className="flex justify-end w-full mt-2">
              <div className="flex items-center gap-2 text-sm md:text-base font-semibold text-green-700 bg-green-50 px-3 py-2 rounded-lg shadow-sm">
                <i className="fa-solid fa-circle-check text-green-600"></i>
                <span>Total Successful: ₹{totalSuccessAmount.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      )}
      {/* GOOGLE FONT (Poppins) */}
{/* LOAD POPPINS + INTER */}
<link
  href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
  rel="stylesheet"
/>
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap"
  rel="stylesheet"
/>

<div className="bg-white rounded-2xl shadow-lg overflow-hidden">

  {/* TABLE WRAPPER */}
  <div className="overflow-x-auto">
    <table className="w-full table-auto text-sm text-left border-collapse">

      {/* HEADER */}
      <thead
        className="uppercase text-white sticky top-0 z-20"
        style={{ background: "linear-gradient(90deg, #062f70, #0d3dc4)" }}
      >
        <tr>
          {columns.map((col, idx) => (
            <th
              key={idx}
              className="font-semibold text-sm px-4 py-3 whitespace-nowrap tracking-wide"
            >
              {col.header}
            </th>
          ))}

          {showDeleteColumn && (
            <th className="font-semibold text-sm px-4 py-3 whitespace-nowrap">
              Delete
            </th>
          )}
        </tr>
      </thead>

      {/* BODY */}
      <tbody>
        {filteredData.length ? (
          filteredData
            .slice(
              (currentPage - 1) * entriesPerPage,
              currentPage * entriesPerPage
            )
            .map((row, idx) => (
              <tr
                key={row.id || idx}
                className={`transition-all duration-150 ${
                  idx % 2 === 0 ?   "bg-[#e6efff]" : "bg-white"
                } hover:bg-blue-100`}
              >
                {columns.map((col, ci) => (
                  <td
                    key={ci}
                    className="px-4 py-2 text-gray-700 font-normal text-[13px] leading-5 break-words"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {col.Cell
                      ? col.Cell({ value: row[col.accessor], row })
                      : row[col.accessor]}
                  </td>
                ))}

                {showDeleteColumn && (
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleConfirmModal(row.id)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <i className="fa-solid fa-trash fa-lg"></i>
                    </button>
                  </td>
                )}
              </tr>
            ))
        ) : (
          <tr>
            <td
              colSpan={
                showDeleteColumn ? columns.length + 1 : columns.length
              }
              className="text-center text-gray-600 py-10 bg-white"
            >
              <img src={nodata} alt="no data" className="mx-auto h-32 w-32" />
              <p className="mt-2 text-gray-500">No data found</p>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  {/* PAGINATION */}
  {showPagination && filteredData.length > 0 && (
    <div className="flex flex-col md:flex-row justify-between items-center px-4 py-3 bg-gray-200 rounded-b-2xl border-t border-gray-300 shadow-inner">

      {/* LEFT RECORDS PER PAGE */}
      <div className="flex items-center gap-2 text-sm text-gray-800 font-medium">
        <span>Show</span>
        <select
          value={entriesPerPage}
          onChange={(e) => {
            setEntriesPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white focus:ring-1 focus:ring-sky-400 outline-none"
        >
          {[10, 20, 30, 50].map((num) => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
        <span>entries</span>
      </div>

      {/* RIGHT PAGINATION BUTTONS */}
      <div className="flex items-center gap-3 mt-2 md:mt-0">
        
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 text-sm rounded-md font-medium transition
            ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }
          `}
        >
          Prev
        </button>

        <span className="text-sm font-medium text-gray-800">
          Page <span className="font-semibold">{currentPage}</span> of {totalPages}
        </span>

        <button
          onClick={() =>
            setCurrentPage((prev) =>
              prev < totalPages ? prev + 1 : prev
            )
          }
          disabled={currentPage === totalPages}
          className={`px-3 py-1 text-sm rounded-md font-medium transition
            ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }
          `}
        >
          Next
        </button>
      </div>
    </div>
  )}
</div>

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
