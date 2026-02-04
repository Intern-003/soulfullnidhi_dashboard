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

  // New props for server-side pagination
  isServerPaginated = false,
  hasMore = false,
  isLoadingMore = false,
  onLoadNext = () => {},

  entriesPerPage,
  setEntriesPerPage,
}) => {
  const toast = useToast();
  const [role] = useState(atob(localStorage.getItem("role") || "") || "admin");
  const [search, setSearch] = useState("");
  const [txnSearch, setTxnSearch] = useState("");
  const [recordId, setRecordId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [selectData, setSelectData] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const exportRef = useRef(null);

  // 🔍 DEBUG DATE FORMAT (TEMPORARY)
  useEffect(() => {
    if (data?.length) {
      // console.log("FULL FIRST ROW:", data[0]);

      // console.log("date:", data[0]?.date);
      // console.log("created_at:", data[0]?.created_at);
      // console.log("txnid.created_at:", data[0]?.txnid?.created_at);
      // console.log("txnid.txn_date:", data[0]?.txnid?.txn_date);

      // console.log("TYPE OF created_at:", typeof data[0]?.created_at);
    }
  }, [data]);


  /* ================= DATE FIX HELPERS ================= */

  const getRowDate = (row) => {
    return (
      row?.date ||
      row?.created_at ||
      row?.txnid?.created_at ||
      row?.txnid?.txn_date ||
      null
    );
  };

  const parseDate = (value) => {
    if (!value) return null;

    if (value instanceof Date && !isNaN(value)) {
      const d = new Date(value);
      d.setHours(0, 0, 0, 0);
      return d;
    }

    if (typeof value === "string") {
      const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
      if (match) {
        const d = new Date(match[1]);
        d.setHours(0, 0, 0, 0);
        return d;
      }
    }
    return null;
  };

  const parseEndDate = (value) => {
    const d = parseDate(value);
    if (!d) return null;
    d.setHours(23, 59, 59, 999);
    return d;
  };

  /* ================= MERCHANT SELECT ================= */

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

  /* ================= EXPORT DROPDOWN CLOSE ================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportRef.current && !exportRef.current.contains(event.target)) {
        setOpenExport(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= DELETE ================= */

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
      refreshTable?.();
      setShowConfirmModal(false);
      setRecordId(null);
    } catch {
      toast.error("Failed to delete record.");
    }
  };

  /* ================= DEEP SEARCH HELPERS ================= */

  const getAllStrings = (value) => {
      if (value === null || value === undefined) return [];

    if (typeof value === "string" || typeof value === "number") {
      return [String(value).toLowerCase()];
    }
    if (Array.isArray(value)) {
      return value.flatMap(getAllStrings);
    }
      if (typeof value === "object" && value.$$typeof) {
        return [];
      }

    if (value && typeof value === "object") {
      return Object.values(value).flatMap(getAllStrings);
    }
    return [];
  };

  /* ================= EXTRACT TEXT FOR JSX ================= */
  const extractTextFromElement = (element) => {
    if (!element || typeof element !== "object" || !element.$$typeof) return "";
    if (element.props?.children) {
      if (typeof element.props.children === "string") return element.props.children;
      if (Array.isArray(element.props.children)) {
        return element.props.children.map(extractTextFromElement).join(" ");
      }
      return extractTextFromElement(element.props.children);
    }
    return "";
  };

  /* ================= FILTERED DATA ================= */

  const filteredData = useMemo(() => {
    // DEBUG: Log for troubleshooting
    if (txnSearch) {
      console.log("DEBUG - txnSearch:", txnSearch);
      console.log("DEBUG - Sample row keys:", data[0] ? Object.keys(data[0]) : 'No data');
      const sampleName = data[0]?.name || data[0]?.NAME || data[0]?.['NAME'] || data[0]?.name;
      console.log("DEBUG - Sample row NAME raw:", sampleName);
      console.log("DEBUG - Sample row NAME extracted:", extractTextFromElement(sampleName));
    }

    return data.filter((row) => {
      const allValues = getAllStrings(row);
      const matchesSearch = !search || allValues.some((val) => val.includes(search.toLowerCase()));

      // Updated to include all possible fields from screenshot for comprehensive search
      // Enhanced name matching for robustness - handle JSX elements
      let rawNameValue = row.name || row.NAME || row['NAME'] || row['name'] || row.user || row['user'] || row.merchant_name || row['merchant_name'] || row['MERCHANT NAME'] || row['merchant name'] || '';
      const nameValue = typeof rawNameValue === 'string' ? rawNameValue : extractTextFromElement(rawNameValue);
      const userIdValue = String(row.user_id || row['USER ID'] || row['userId'] || row.id || '');

      const txnRelevantFields = [
        userIdValue,  // Explicitly add user ID
        nameValue,    // Explicitly add name (extracted text)
        String(row.order_id || row.id || row['ORDER ID'] || ''),
        String(row.merchant_details || row['MERCHANT DETAILS'] || extractTextFromElement(row.merchant_details || row['MERCHANT DETAILS'] || '')),
        String(row.bank_details || row['BANK DETAILS'] || extractTextFromElement(row.bank_details || row['BANK DETAILS'] || '')),
        String(row.bank_name || row['BANK NAME'] || row['Bank Name'] || row.bank || ''),
        String(row.reference_details || row['REFERENCE DETAILS'] || extractTextFromElement(row.reference_details || row['REFERENCE DETAILS'] || '')),
        String(row.amount_commission || row['AMOUNT / COMMISSION'] || ''),
        String(row.txnid || ''),
        String(row.amount || row.numericAmount || row['Amount'] || row['Pay Amount'] || ''),
        String(row.charges || row['Charges'] || row['Total Charges'] || ''),
        String(row.gst || row['GST'] || ''),
        String(row.payin_rolling_amount || row['Payin Rolling Amount'] || row['Opening Wallet Amount'] || row['Closing Wallet Amount'] || row['Total Debited Amount'] || ''),
        String(row.transaction_details || extractTextFromElement(row.transaction_details || '')),
        String(row.ref_no || row['Ref No'] || ''),
        String(row.payee_txnid || row['Payee Txnid'] || ''),
        String(row.payee_vpa || row['Payee VPA'] || ''),
        String(row.status || row['STATUS'] || ''),
        String(row.holder || row['Holder'] || extractTextFromElement(row.holder || row['Holder'] || '')),
        String(row.account || row['Account'] || ''),
        String(row.ifsc || row['IFSC'] || ''),
        String(row.mode || row['Mode'] || ''),
        String(row.mobile || row['Mobile'] || ''),
        String(row.payment_mode || row['Payment Mode'] || ''),
        String(row.u_pi_id || row['UPI Id'] || ''),
        String(row.soulbox || row['SOULBOX'] || ''),
        String(row.note || row['Note'] || ''),
        String(row.opening_wallet_amount || row['Opening Wallet Amount'] || ''),
        String(row.closing_wallet_amount || row['Closing Wallet Amount'] || ''),
        String(row.total_debited_amount || row['Total Debited Amount'] || '')
      ];
      const txnValues = txnRelevantFields.flatMap(getAllStrings).filter(Boolean);
      const matchesTxn = !txnSearch || txnValues.some((val) => val.includes(txnSearch.toLowerCase()));

      // DEBUG: Log for specific row if searching
      if (txnSearch && nameValue.toLowerCase().includes(txnSearch.toLowerCase())) {
        console.log("DEBUG - Match found for row:", row);
      }

      const matchesStatus =
        statusFilter === "all" ||
        String(row.status || '').toLowerCase() === statusFilter.toLowerCase();

      const rawDate = getRowDate(row);
      const rowDate = parseDate(rawDate);
      const start = parseDate(startDate);
      const end = parseEndDate(endDate);

      const matchesDate =
        (!start || (rowDate && rowDate >= start)) &&
        (!end || (rowDate && rowDate <= end));

      const matchesMerchant =
        !selectedMerchant || row.user_id === selectedMerchant.value;

      return matchesSearch && matchesTxn && matchesStatus && matchesDate && matchesMerchant;
    });
  }, [search, txnSearch, statusFilter, startDate, endDate, selectedMerchant, data]);


  /* ================= TOTAL SUCCESS ================= */

  const totalSuccessAmount = useMemo(() => {
    return filteredData
      .filter((row) => String(row.status || '').toLowerCase() === "success")
      .reduce((sum, row) => sum + (Number(row.numericAmount) || 0), 0);
  }, [filteredData]);

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  /* ================= EXPORT ================= */

  const extractText = (element) => {
    if (element === null || element === undefined) return "";
    if (typeof element === "string" || typeof element === "number") return String(element);
    if (Array.isArray(element)) return element.map(extractText).join(" | ");
    if (typeof element === "object" && element.$$typeof) return extractText(element.props?.children);
    if (typeof element === "object") return Object.values(element).map(extractText).join(" | ");
    return String(element);
  };

  const flattenObject = (obj, prefix = "", seen = new WeakSet()) => {
    const result = {};
    if (obj === null || typeof obj !== "object") return result;
    if (seen.has(obj)) return result;
    seen.add(obj);

    for (const key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (value?.$$typeof) {
        result[newKey] = extractText(value);
      } else if (Array.isArray(value)) {
        result[newKey] = value.map(extractText).join(" | ");
      } else if (typeof value === "object") {
        Object.assign(result, flattenObject(value, newKey, seen));
      } else {
        result[newKey] = extractText(value);
      }
    }
    return result;
  };

  // CSV escape helper - improved to handle newlines too
  const escapeCSV = (field) => {
    const string = String(field || '');
    if (string.includes('"') || string.includes(',') || string.includes('\n') || string.includes('\r')) {
      return '"' + string.replace(/"/g, '""') + '"';
    }
    return string;
  };

  // Generic download helper using data URI
  const downloadFile = (content, filename, mimeType) => {
    const encodedUri = `data:${mimeType};charset=utf-8,` + encodeURIComponent(content);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportCSV = () => {
    if (!filteredData.length) {
      toast.error("No data to export.");
      setOpenExport(false);
      return;
    }
    const normalizedRows = filteredData.map(flattenObject);
    const headers = Array.from(new Set(normalizedRows.flatMap(Object.keys))).sort();
    const escapedHeaders = headers.map(escapeCSV);
    const csv = [
      escapedHeaders.join(","),
      ...normalizedRows.map((row) => headers.map((h) => escapeCSV(row[h] || '')).join(",")),
    ].join("\n");
    downloadFile(csv, "table_export.csv", "text/csv");
    setOpenExport(false);
    toast.success("CSV exported successfully!");
  };

  const exportJSON = () => {
    if (!filteredData.length) {
      toast.error("No data to export.");
      setOpenExport(false);
      return;
    }
    const jsonContent = JSON.stringify(filteredData, null, 2);
    downloadFile(jsonContent, "table_export.json", "application/json");
    setOpenExport(false);
    toast.success("JSON exported successfully!");
  };

  const exportTXT = () => {
    if (!filteredData.length) {
      toast.error("No data to export.");
      setOpenExport(false);
      return;
    }
    const normalizedRows = filteredData.map(flattenObject);
    const headers = Array.from(new Set(normalizedRows.flatMap(Object.keys))).sort();
    const txtContent = [
      headers.join("\t"),
      ...normalizedRows.map((row) => headers.map((h) => String(row[h] || '')).join("\t")),
    ].join("\n");
    downloadFile(txtContent, "table_export.txt", "text/plain");
    setOpenExport(false);
    toast.success("TXT exported successfully!");
  };

  const exportSQL = () => {
    if (!filteredData.length) {
      toast.error("No data to export.");
      setOpenExport(false);
      return;
    }
    const normalizedRows = filteredData.map(flattenObject);
    const headers = Array.from(new Set(normalizedRows.flatMap(Object.keys))).sort();
    const columns = headers.map(h => `\`${h.replace(/`/g, '\\`')}\``).join(', ');
    const valuesRows = normalizedRows.map(row => {
      const values = headers.map(h => {
        let val = String(row[h] || '');
        val = val.replace(/'/g, "''");
        if (val === '' || val.toLowerCase() === 'null') return 'NULL';
        return `'${val}'`;
      }).join(', ');
      return `INSERT INTO table_name (${columns}) VALUES (${values});`;
    }).join('\n');

    const sqlContent = `-- Export from Table\n-- Table: table_name\n-- Columns: ${headers.join(', ')}\n\n${valuesRows}`;
    downloadFile(sqlContent, "table_export.sql", "text/plain");
    setOpenExport(false);
    toast.success("SQL exported successfully!");
  };

  /* ================= DATE PICKER HEADER ================= */

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const years = Array.from({ length: 25 }, (_, i) => 2015 + i);

  const customHeader = ({ date, changeMonth, changeYear }) => (
    <div className="flex justify-between items-center px-2 py-1 bg-gradient-to-r from-sky-200 to-indigo-200 rounded-t-lg">
      <select
        value={months[date.getMonth()]}
        onChange={(e) => changeMonth(months.indexOf(e.target.value))}
        className="bg-white text-sky-800 rounded px-2 py-1 border border-sky-300 text-sm"
      >
        {months.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <select
        value={date.getFullYear()}
        onChange={(e) => changeYear(Number(e.target.value))}
        className="bg-white text-sky-800 rounded px-2 py-1 border border-sky-300 text-sm"
      >
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );

  /* ================= UI ================= */

  return (
    <div className="w-full  mx-auto px-2 sm:px-0">
      {/* FILTER BAR */}
      {(showSearch ||
        showStatusFilter ||
        showExport ||
        showDateFilter ||
        showSelectUserFilter) && (
        <div className="w-full bg-white shadow-md rounded-xl p-4 mb-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 w-full">
            <div className="flex flex-wrap items-center gap-4 lg:max-w-[65%]">
              {/* {role === "user"  && ( */}
              <div className="relative w-64">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Search User ID / Name / Order ID / Txn / Ref / Payee Txnid / Bank Name..."
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-sky-400 outline-none"
                  value={txnSearch}
                  onChange={(e) => setTxnSearch(e.target.value)}
                />
              </div>
              {/* )} */}
               {/* {role === "admin" && showSelectUserFilter && ( */}
            
                {/* <div className="w-56">
                  <CustomSelect
                    options={selectData}
                    placeholder="Select Merchant"
                    value={selectedMerchant}
                    onChange={(option) => setSelectedMerchant(option)}
                  />
                </div> */}
              {/* )} */}
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
                    <option key={idx} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex items-center gap-3 ml-auto flex-wrap">
              {showExport && (
                <div className="relative" ref={exportRef}>
                  <Button
                    onClick={() => setOpenExport(!openExport)}
                    className="text-blue-800 px-4 py-2 rounded-lg shadow-md hover:transition flex items-center gap-2 min-w-[110px] h-[42px] justify-center"
                    style={{
                      background:
                        "linear-gradient(275deg, #a2c1f3ff, #d4d6ddff)",
                    }}
                  >
                    <i className="fa-solid fa-download"></i> Export
                  </Button>
                  {openExport && (
                    <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg p-2 w-40 z-50">
                      <button
                        onClick={exportCSV}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
                      >
                        CSV
                      </button>
                      <button
                        onClick={exportJSON}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
                      >
                        JSON
                      </button>
                      <button
                        onClick={exportTXT}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
                      >
                        TXT
                      </button>
                      <button
                        onClick={exportSQL}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
                      >
                        SQL
                      </button>
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
                  setTxnSearch("");
                  setSelectedMerchant(null);
                }}
                style={{
                  background: "linear-gradient(275deg, #030b18ff, #0e92dfff)",
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
              className="uppercase text-white top-0 z-20"
              style={{
                background: "linear-gradient(250deg, #2a91d9 0%, #00418c 100%)",
              }}
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
                filteredData.map((row, idx) => (
                  <tr
                    key={row.id || idx}
                    className={`transition-all duration-150 ${
                      idx % 2 === 0 ? "bg-[#e6efff]" : "bg-white"
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
                    colSpan={showDeleteColumn ? columns.length + 1 : columns.length}
                    className="text-center text-gray-600 py-10 bg-white"
                  >
                    <img
                      src={nodata}
                      alt="no data"
                      className="mx-auto h-32 w-32"
                    />
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
            {/* LEFT – entries per page */}
            <div className="flex items-center gap-2 text-sm text-gray-800 font-medium">
              <span>Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white focus:ring-1 focus:ring-sky-400 outline-none"
              >
                {[50, 100, 150,200].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              <span>entries</span>
            </div>

            {/* RIGHT – Prev / Page / Next */}
            <div className="flex items-center gap-3 mt-2 md:mt-0">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || isServerPaginated}
                className={`px-3 py-1 text-sm rounded-md font-medium transition
                  ${currentPage === 1 || isServerPaginated
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"}`}
              >
                Prev
              </button>

              <span className="text-sm font-medium text-gray-800">
                {isServerPaginated ? (
                  "Loaded: " + filteredData.length + " records"
                ) : (
                  <>
                    Page <span className="font-semibold">{currentPage}</span> of {totalPages}
                  </>
                )}
              </span>

              <button
                onClick={isServerPaginated ? onLoadNext : () =>
                  setCurrentPage((prev) =>
                    prev < totalPages ? prev + 1 : prev
                  )
                }
                disabled={
                  isServerPaginated
                    ? !hasMore || isLoadingMore
                    : currentPage === totalPages
                }
                className={`px-3 py-1 text-sm rounded-md font-medium transition flex items-center gap-2
                  ${
                    (isServerPaginated ? !hasMore || isLoadingMore : currentPage === totalPages)
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                {isServerPaginated && isLoadingMore ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z" fill="currentColor" />
                    </svg>
                    Loading...
                  </>
                ) : (
                  "Next"
                )}
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