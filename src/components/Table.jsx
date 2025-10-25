import { useState, useMemo } from "react";
import Button from "./Button";
import { ConfirmModal } from "./ConfirmModal";
import { usePost } from "../hooks/usePost";
import { useToast } from "../contexts/ToastContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Table = ({
  columns,
  data,
  showSearch = true,
  showPagination = true,
  showExport = true,
  showStatusFilter = true,
  showDeleteColumn = true,
  showDateFilter = true,
  endPoint = "",
  refreshTable,
}) => {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [recordId, setRecordId] = useState(null);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [openExport, setOpenExport] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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
        refreshTable();
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
      const rowDate = new Date(row.date);
      const matchesDate =
        (!startDate || rowDate >= startDate) &&
        (!endDate || rowDate <= endDate);

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [search, statusFilter, startDate, endDate, data]);

  if (!columns || !data || data.length === 0) {
    return <h6>No data found</h6>;
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

  return (
    <div className="w-full">
      {(showSearch || showStatusFilter || showExport) && (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center rounded-b-xl ml-2 mb-4">
            {/* Search */}
            {showSearch && (
              <div className="w-full md:w-1/3">
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
            <div className="flex items-center justify-end gap-4 md:mt-0">
              {/* Status Filter */}
              {showStatusFilter && (
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-sky-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-800 focus:ring-2 focus:ring-sky-400 focus:outline-none hover:border-sky-400 transition"
                >
                  <option value="">Select Status</option>
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                  <option value="pending">Pending</option>
                </select>
              )}

              {/* Export Dropdown */}
              {showExport && (
                <div className="relative border border-sky-300 rounded-lg mr-2">
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
                    <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg text-sm text-gray-700 z-50">
                      <ul className="py-2">
                        <li>
                          <button
                            onClick={exportCSV}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            CSV
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={exportJSON}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            JSON
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={exportTXT}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            TXT
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={exportSQL}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
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

          {/* Date Picker*/}
          {showDateFilter && (
            <div className="flex items-center ml-2">
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
                  className="border border-sky-500 text-gray-900 text-sm rounded-lg w-full ps-10 p-2.5 focus:ring-2 focus:ring-sky-400 focus:outline-none"
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
                  className="border border-sky-500 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* Table */}
      <div className="bg-gray-300 rounded-lg mx-4 my-4 border border-sky-300">
        <div
          className="overflow-x-scroll"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#9ca3af #e5e7eb" }}
        >
          <table
            className="w-full text-sm text-left text-gray-700 bg-gray-300 rounded-lg overflow-hidden  inset-shadow-sm inset-shadow-indigo-500/100 "
            style={{
              borderCollapse: "collapse",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            }}
          >
            <thead
              style={{
                background: "linear-gradient(90deg, #007BFF, #00C8FF)",
                color: "white",
              }}
              className="uppercase tracking-wide text-center"
            >
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="font-semibold text-md px-4 py-3 border-b border-white/30"
                  >
                    {column.header}
                  </th>
                ))}
                {showDeleteColumn && (
                  <th className="font-semibold text-md px-4 py-3 border-b border-white/30">
                    Delete
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="text-center">
              {filteredData.length > 0 ? (
                filteredData
                  .slice(
                    (currentPage - 1) * entriesPerPage,
                    currentPage * entriesPerPage
                  )
                  .map((row, rowIndex) => (
                    <tr
                      key={row.id}
                      className={`${
                        rowIndex % 2 === 0 ? "bg-[#f8fbff]" : "bg-white"
                      } hover:bg-[#dbeafe] transition-colors duration-200`}
                    >
                      {columns.map((column, colIndex) => (
                        <td key={colIndex} className="px-4 py-2 text-gray-800">
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
                            <i class="fa-solid fa-trash fa-lg"></i>
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-4 text-gray-500"
                  >
                    No matching records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <ConfirmModal
          showConfirmModal={showConfirmModal}
          handleConfirmModal={handleConfirmModal}
          heading={"Are you sure you want to delete?"}
          body={"If you delete the record it will be not recovered."}
          action={handleDelete}
        />

        {showPagination && (
          <div
            className="flex flex-col md:flex-row justify-between items-center bg-white px-4 py-3 rounded-b-lg border border-sky-200"
            style={{}}
          >
            {/* Left - Entries per page */}
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-sky-400 focus:outline-none"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
              <span>entries</span>
            </div>

            {/* Right - Pagination controls */}
            <div className="flex items-center gap-2 mt-3 md:mt-0">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 text-sm rounded-md border ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-100 cursor-pointer"
                }`}
              >
                Prev
              </Button>
              <span className="text-sm text-gray-600">
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
                disabled={
                  currentPage ===
                  Math.ceil(filteredData.length / entriesPerPage)
                }
                className={`px-3 py-1 text-sm rounded-md border ${
                  currentPage ===
                  Math.ceil(filteredData.length / entriesPerPage)
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-100 cursor-pointer"
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
