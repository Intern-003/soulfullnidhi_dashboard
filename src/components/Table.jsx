import React, { useState, useMemo } from "react";

const Table = ({ columns, data }) => {
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [openExport, setOpenExport] = useState(false);

  if (!columns || !data || data.length === 0) {
    return <h6>No data found</h6>;
  }

  // 🔍 Filtered Data
  const filteredData = useMemo(() => {
    return data.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, data]);

  // 📑 Pagination
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  // 📂 Export Handlers
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
    const rows = data
      .map((row) => columns.map((c) => `"${row[c.accessor] ?? ""}"`).join(","))
      .join("\n");
    downloadFile(`${headers}\n${rows}`, "table.csv", "text/csv");
  };

  const exportJSON = () =>
    downloadFile(JSON.stringify(data, null, 2), "table.json", "application/json");

  const exportTXT = () => {
    const headers = columns.map((c) => c.header).join(" | ");
    const rows = data
      .map((row) => columns.map((c) => row[c.accessor]).join(" | "))
      .join("\n");
    downloadFile(`${headers}\n${rows}`, "table.txt", "text/plain");
  };

  const exportSQL = () => {
    const tableName = "export_table";
    const sqlRows = data
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
      {/* 🔍 Search + Entries + Export */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3 p-6 bg-blue-100 rounded-b-xl mx-4" style={{}}>
        {/* Search */}
        <div className="w-full md:w-1/3 ">
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-lg border border-sky-500 px-3 py-2 text-sm shadow-xl/10"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Entries per page */}
        <div className="flex items-center gap-2 border-sky-500 ">
          <label className="text-sm">Show</label>
          <select
            className="rounded-lg border border-gray-300 px-2 py-1 text-sm border-sky-500 "
            value={entriesPerPage}
            onChange={(e) => {
              setEntriesPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[10, 25, 50, 100].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <span className="text-sm">entries</span>
        </div>

        {/* Export Dropdown */}
        <div className="relative border-sky-500 ">
          <button
            onClick={() => setOpenExport(!openExport)}
            className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
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
              <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
            </svg>
          </button>

          {openExport && (
            <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg text-sm text-gray-700">
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
      </div>

    <div className=" bg-gray-300 rounded-b-xl mx-4">

   
<table
  style={{
    width: "100%",
    borderCollapse: "collapse",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    borderRadius: "12px",
    overflow: "hidden",
    background: "white",
  }}
  className="w-full text-sm text-left rtl:text-right text-gray-700"
>
  {/* Table Head */}
  <thead
    style={{
      background: "linear-gradient(90deg, #007BFF, #00C8FF)",
      color: "white",
    }}
    className="uppercase text-xs tracking-wide"
  >
    <tr>
      {columns.map((column, index) => (
        <th
          key={index}
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.3)",
            padding: "12px 16px",
          }}
          className="font-semibold text-sm"
        >
          {column.header}
        </th>
      ))}
    </tr>
  </thead>

  {/* Table Body */}
  <tbody>
    {data.map((row, rowIndex) => (
      <tr
        key={rowIndex}
        className={`${
          rowIndex % 2 === 0 ? "bg-[#f8fbff]" : "bg-white"
        } hover:bg-[#e9f8ff] transition-colors duration-200`}
        style={{
          borderBottom: "1px solid #e0f2fe",
        }}
      >
        {columns.map((column, colIndex) => (
          <td
            key={colIndex}
            style={{
              padding: "10px 16px",
            }}
            className="text-gray-800"
          >
            {row[column.accessor]}
          </td>
        ))}
      </tr>
    ))}
  </tbody>
</table>


     </div>
    </div>
  )
}

export default Table;