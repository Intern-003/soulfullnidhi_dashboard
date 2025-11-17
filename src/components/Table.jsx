import { useState, useMemo, useEffect, useRef } from "react";
import Button from "./Button";
import { ConfirmModal } from "./ConfirmModal";
import { usePost } from "../hooks/usePost";
import { useToast } from "../contexts/ToastContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CustomSelect } from "./CustomSelect";
import nodatafound from "../images/nodatafound.jpeg";

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

  const handleConfirmModal = (id) => {
    setRecordId(id);
    setShowConfirmModal(!showConfirmModal);
  };

  const modifiedEndpoint = endPoint + `/${recordId}`;
  const { execute: deleteRecord } = usePost(modifiedEndpoint);

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const res = await deleteRecord({});
      if (res) {
        toast.success("Record deleted successfully!");

        if (setData) {
          setData((prev) => prev.filter((row) => row.id !== recordId));
        }

        if (refreshTable) refreshTable();
        handleConfirmModal();
        setRecordId(null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const filteredData = useMemo(() => {
    return data?.filter((row) => {
      // Search filter
      const matchesSearch = Object.values(row).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      );

      // Status filter
      const matchesStatus =
        !statusFilter ||
        statusFilter === "all" ||
        String(row.status).toLowerCase() === statusFilter.toLowerCase();

      // Date filter
      const rowDate = new Date(row.date?.split("-")[0]);
      const matchesDate =
        (!startDate || rowDate >= startDate) &&
        (!endDate || rowDate <= endDate);

      // ✅ Merchant filter (based on custom select)
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
      .reduce((sum, row) => sum + Number(row.amount || 0), 0);
  }, [filteredData]);

  if (!columns || !data || data.length === 0) {
    // return (
    //   // <div style={{textAlign:"center",padding:"20px",justifyContent:"center",display: "flex",
    //   //   flexDirection: "column",alignItems:"center"}}>
    //   //   <img src={nodatafound}
    //   //   alt ="no data found"
    //   //   style={{width:"300px", opacity:0.8}} />
    //   // </div>
    // );
    // <h6>No data found</h6>;
  }

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
    downloadFile(
      JSON.stringify(filteredData, null, 2),
      "table.json",
      "application/json"
    );
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
        return `INSERT INTO ${tableName} (${columns
          .map((c) => c.accessor)
          .join(", ")}) VALUES (${values});`;
      })
      .join("\n");
    downloadFile(sqlRows, "table.sql", "text/sql");
  };

  // Months and years for custom header
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const years = Array.from({ length: 20 }, (_, i) => 2020 + i);

  const customHeader = ({ date, changeMonth, changeYear }) => (
    <div className="flex justify-between items-center px-2 py-1 bg-gradient-to-r from-sky-200 to-indigo-200 rounded-t-lg">
      <select
        value={months[date.getMonth()]}
        onChange={(e) => changeMonth(months.indexOf(e.target.value))}
        className="bg-white text-sky-800 rounded px-2 py-1 border border-sky-300"
      >
        {months.map((month) => (
          <option key={month}>{month}</option>
        ))}
      </select>

      <select
        value={date.getFullYear()}
        onChange={(e) => changeYear(Number(e.target.value))}
        className="bg-white text-sky-800 rounded px-2 py-1 border border-sky-300"
      >
        {years.map((year) => (
          <option key={year}>{year}</option>
        ))}
      </select>
    </div>
  );




  return (
    <div className="w-full">
      {(showSearch ||
        showStatusFilter ||
        showExport ||
        showDateFilter ||
        showSelectUserFilter) && (
          <>
            <div className="flex flex-col md:flex-row justify-between items-center rounded-b-xl ml-2 mb-3">
              {/* Search */}
              {showSearch && (
                <div className="w-50 md:w-1/3">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full rounded-lg border border-sky-500 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-sky-400 focus:outline-none"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              )}

              {/* Select User Filter */}
              {showSelectUserFilter && (
                <div className="w-50 md:w-1/3">
                  <CustomSelect
                    options={selectData}
                    placeholder="Select Merchant"
                    value={selectedMerchant}
                    onChange={(option) => setSelectedMerchant(option)}
                  />
                </div>
              )}

              {/* Date Picker*/}
              {/* {showDateFilter && (
                <div className="flex items-center">
                  <div className="relative">
                    <div className="absolute z-10 inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                      </svg>
                    </div>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      placeholderText="Select start date"
                      className="border border-sky-500 text-gray-900 text-sm rounded-lg w-40 ps-10 p-2.5 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                    />
                  </div>

                  <span className="mx-2 text-gray-500">to</span>

                  <div className="relative">
                    <div className="absolute z-10 inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                      </svg>
                    </div>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
                      placeholderText="Select end date"
                      className="border border-sky-500 text-gray-900 text-sm rounded-lg block w-40 ps-10 p-2.5 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                    />
                  </div>
                </div>
              )} */}

              {/* Date Picker */}
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
                    calendarClassName="bg-gradient-to-b from-sky-50 to-indigo-50 border border-sky-300 rounded-lg shadow-md"
                    dayClassName={(date) =>
                      date.getDay() === 0 || date.getDay() === 6
                        ? "text-red-500 font-semibold" // weekends
                        : "text-sky-900 font-medium"
                    }
                    className="border border-sky-500 text-sky-900 font-medium text-sm rounded-lg w-44 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 hover:bg-sky-100 transition"
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
                    calendarClassName="bg-gradient-to-b from-sky-50 to-indigo-50 border border-sky-300 rounded-lg shadow-md"
                    dayClassName={(date) =>
                      date.getDay() === 0 || date.getDay() === 6
                        ? "text-red-500 font-semibold"
                        : "text-sky-900 font-medium"
                    }
                    className="border border-sky-500 text-sky-900 font-medium text-sm rounded-lg w-44 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 hover:bg-sky-100 transition"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-4 md:mt-0">
                {/* Status Filter */}
                {showStatusFilter && (
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-sky-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-800 focus:ring-2 focus:ring-sky-400 focus:outline-none hover:border-sky-400 transition"
                  >
                    <option value="all">All</option>
                    {statusList?.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                )}

                {/* Export Dropdown */}
                {showExport && (
                  <div
                    ref={exportRef}
                    className="relative border border-sky-300 rounded-lg mr-2"
                  >
                    <button
                      onClick={() => setOpenExport(!openExport)}
                      className="flex items-center justify-center rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                    >
                      Export as
                      <svg
                        className="ml-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m19 9-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {openExport && (
                      <div className="absolute right-0 mt-2 w-30 bg-white border shadow-lg text-sm text-gray-700 z-50">
                        <ul className="py-2">
                          <li>
                            <button
                              onClick={exportCSV}
                              className="block w-full text-left px-4 py-2 hover:bg-blue-100 cursor-pointer"
                            >
                              CSV
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={exportJSON}
                              className="block w-full text-left px-4 py-2 hover:bg-blue-100 cursor-pointer"
                            >
                              JSON
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={exportTXT}
                              className="block w-full text-left px-4 py-2 hover:bg-blue-100 cursor-pointer"
                            >
                              TXT
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={exportSQL}
                              className="block w-full text-left px-4 py-2 hover:bg-blue-100 cursor-pointer"
                            >
                              SQL
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {showSelectUserFilter && (
              <div className="mt-3 ml-3 text-sm font-semibold text-green-700">
                Total Successful Amount: ₹{totalSuccessAmount.toFixed(2)}
              </div>
            )}

            <div className="mb-8">
              <Button
                className="mr-2 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-md flex justify-self-end"
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                  setStatusFilter("all");
                  setSearch("");
                  setSelectedMerchant("");
                }}
              >
                Clear All
              </Button>
            </div>
          </>
        )}
      {/* Generic Table Component */}
      {/* <div className="bg-white rounded-lg shadow-lg w-full overflow-x-auto border border-sky-300">
        <table className="min-w-full table-fixed text-sm text-left text-gray-700 border-collapse">
          <thead
            className="uppercase text-white tracking-wide"
            style={{ background: "linear-gradient(90deg, #007BFF, #00C8FF)" }}
          >
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="font-semibold text-md px-4 py-3 text-left whitespace-nowrap border-b border-white/30"
                >
                  {column.header}
                </th>
              ))}
              {showDeleteColumn && (
                <th className="font-semibold text-md px-4 py-3 text-left whitespace-nowrap border-b border-white/30">
                  Delete
                </th>
              )}
            </tr>
          </thead> */}

          {/* <tbody>
            {filteredData.length > 0 ? (
              filteredData
                .slice(
                  (currentPage - 1) * entriesPerPage,
                  currentPage * entriesPerPage
                )
                .map((row, rowIndex) => (
                  <tr
                    key={row.id}
                    className={`${rowIndex % 2 === 0 ? "bg-[#f8fbff]" : "bg-white"
                      } hover:bg-[#dbeafe] transition-colors duration-200`}
                  >
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-4 py-2 text-gray-800 text-left truncate"
                      >
                        {column.Cell
                          ? column.Cell({ value: row[column.accessor], row })
                          : row[column.accessor]}
                      </td>
                    ))}
                    {showDeleteColumn && (
                      <td className="px-4 py-2">
                        <Button
                          type="button"
                          onClick={() => handleConfirmModal(row.id)}
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
                <td
                  colSpan={columns.length}
                  className="text-center text-gray-500 bg-white p-4"
                >
                  <div className="flex flex-col items-center justify-center">
                    <img
                      src={nodatafound}
                      alt="no data found"
                      style={{ width: "300px", opacity: 0.8 }}
                    />
                  </div>
                </td>
              </tr>
            )}
          </tbody> */}
          {/* <tbody>
            {filteredData.length > 0 ? (
              filteredData
                .slice(
                  (currentPage - 1) * entriesPerPage,
                  currentPage * entriesPerPage
                )
                .map((row, rowIndex) => (
                  <tr
                    key={row.id}
                    className={`
            ${rowIndex % 2 === 0 ? "bg-[#f1f7ff]" : "bg-white"} 
            hover:bg-[#e0f0ff] 
            transition-all duration-150 
            border-b border-gray-200
          `}
                  >
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-4 py-3 text-gray-800 text-left truncate"
                      >
                        {column.Cell
                          ? column.Cell({ value: row[column.accessor], row })
                          : row[column.accessor]}
                      </td>
                    ))}

                    {showDeleteColumn && (
                      <td className="px-4 py-3">
                        <Button
                          type="button"
                          onClick={() => handleConfirmModal(row.id)}
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
                <td
                  colSpan={columns.length}
                  className="text-center text-gray-500 bg-white p-4"
                >
                  <div className="flex flex-col items-center justify-center">
                    <img
                      src={nodatafound}
                      alt="no data found"
                      style={{ width: "300px", opacity: 0.8 }}
                    />
                  </div>
                </td>
              </tr>
            )}
          </tbody>

        </table>

        {/* Pagination */}
        {/* {showPagination && (
          <div className="flex flex-col md:flex-row justify-between items-center bg-white px-4 py-2 rounded-b-lg border-t border-sky-200 mt-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-md px-2 py-0.5 focus:ring-1 focus:ring-sky-400 focus:outline-none text-xs"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
              <span>entries</span>
            </div> */}

            {/* Right - Pagination controls */}
            {/* <div className="flex items-center gap-2 mt-2 md:mt-0">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-2 py-1 text-xs rounded-md border ${currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-100 cursor-pointer"
                  }`}
              >
                Prev
              </Button>
              <span className="text-xs text-gray-600">
                Page <span className="font-semibold">{currentPage}</span>
              </span>
              <Button
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev < Math.ceil(filteredData.length / entriesPerPage)
                      ? prev + 1
                      : prev
                  )
                }
                disabled={currentPage === Math.ceil(filteredData.length / entriesPerPage)}
                className={`px-2 py-1 text-xs rounded-md border ${currentPage === Math.ceil(filteredData.length / entriesPerPage)
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-100 cursor-pointer"
                  }`}
              >
                Next
              </Button>
            </div>
          </div>
        )}
    </div>  */}
    {/* Generic Table Component */}
<div className="bg-white rounded-lg shadow-lg w-full overflow-x-auto border border-sky-300">
  <table className="min-w-full table-fixed text-sm text-left text-gray-700 border-collapse">
    <thead
      className="uppercase text-white tracking-wide"
      style={{ background: "linear-gradient(90deg, #007BFF, #00C8FF)" }}
    >
      <tr>
        {columns.map((column, index) => (
          <th
            key={index}
            className="font-semibold text-md px-4 py-3 text-left whitespace-nowrap border-b border-white/30"
          >
            {column.header}
          </th>
        ))}
        {showDeleteColumn && (
          <th className="font-semibold text-md px-4 py-3 text-left whitespace-nowrap border-b border-white/30">
            Delete
          </th>
        )}
      </tr>
    </thead>

    <tbody>
  {filteredData.length > 0 ? (
    filteredData
      .slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage)
      .map((row, rowIndex) => (
        <tr
          key={row.id}
          className={`${
            rowIndex % 2 === 0 ? "bg-[#f1f7ff]" : "bg-white"
          } hover:bg-[#e0f0ff] transition-all duration-150 border-b border-gray-200`}
        >
          {columns.map((column, colIndex) => (
            <td
              key={colIndex}
              className="px-4 py-3 text-gray-800 text-left truncate text-sm md:text-base font-normal"
            >
              {column.Cell
                ? column.Cell({ value: row[column.accessor], row })
                : row[column.accessor]}
            </td>
          ))}
          {showDeleteColumn && (
            <td className="px-4 py-3">
              <Button
                type="button"
                onClick={() => handleConfirmModal(row.id)}
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
      <td colSpan={columns.length} className="text-center text-gray-500 bg-white p-4">
        <div className="flex flex-col items-center justify-center">
          <img
            src={nodatafound}
            alt="no data found"
            style={{ width: "300px", opacity: 0.8 }}
          />
        </div>
      </td>
    </tr>
  )}
</tbody>

  </table>

  {/* Pagination */}
  {showPagination && (
    <div className="flex flex-col md:flex-row justify-between items-center bg-white px-4 py-3 rounded-b-lg border-t border-sky-200 mt-3">
      {/* Left - Entries per page */}
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <span>Show</span>
        <select
          value={entriesPerPage}
          onChange={(e) => {
            setEntriesPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-sky-400 focus:outline-none"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
        <span>entries</span>
      </div>

      {/* Right - Pagination controls */}
      <div className="flex items-center gap-2 mt-2 md:mt-0">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 text-sm rounded-md font-medium transition ${
            currentPage === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-sky-200 to-indigo-200 text-sky-900 hover:from-sky-300 hover:to-indigo-300"
          }`}
        >
          Prev
        </Button>
        <span className="text-sm text-gray-700">
          Page <span className="font-semibold">{currentPage}</span>
        </span>
        <Button
          onClick={() =>
            setCurrentPage((prev) =>
              prev < Math.ceil(filteredData.length / entriesPerPage) ? prev + 1 : prev
            )
          }
          disabled={currentPage === Math.ceil(filteredData.length / entriesPerPage)}
          className={`px-3 py-1 text-sm rounded-md font-medium transition ${
            currentPage === Math.ceil(filteredData.length / entriesPerPage)
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-sky-200 to-indigo-200 text-sky-900 hover:from-sky-300 hover:to-indigo-300"
          }`}
        >
          Next
        </Button>
      </div>
    </div>
  )}
</div>



    </div>
  );
};

export default Table;
