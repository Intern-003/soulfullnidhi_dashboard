import React from 'react'

const Table = ({columns, data}) => {
    if(!columns || !data || data.length === 0){
        return <h6>No data found</h6>
    }
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }} class="w-full text-sm text-left rtl:text-right text-gray-500 ">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
          {columns.map((column, index) => (
            <th key={index} style={{ border: '1px solid black', padding: '8px' }} scope="col" class="px-6 py-3">
              {column.header}
                </th>
          ))}
            </tr>

        </thead>
        <tbody>
         {data.map((row, rowIndex) => (
          <tr key={rowIndex} class="bg-white border-b ">
            {columns.map((column, colIndex) => (
              <td class="px-6 py-4" key={colIndex} style={{ border: '1px solid black', padding: '8px' }} >
                {row[column.accessor]}
              </td>
            ))}
          </tr>
        ))}
        </tbody>
    </table>
  )
}

export default Table;