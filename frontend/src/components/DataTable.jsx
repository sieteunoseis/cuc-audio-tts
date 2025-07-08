import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useConfig } from '../config/ConfigContext';

const DataTable = ({ data, onDataChange }) => {
  const config = useConfig();
  const [jsonData, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/dbSetup.json"); // Note the leading '/'
      const jsonData = await response.json();
      setData(jsonData);
    };

    fetchData();
  }, []);


  const handleDelete = async (id) => {
    const response = await fetch(`/api/data/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      onDataChange(); // Refresh data when a record is deleted
    } else {
      console.error("Error deleting data.");
    }
  };

  const selectRecord = async (id) => {
    const response = await fetch(`/api/data/select/${id}`, {
      method: "PUT",
    });
    if (response.ok) {
      onDataChange(); // Refresh data when a record is deleted
    } else {
      console.error("Error updating data.");
    }
  };

  const formatColumnName = (col) => {
    return col
      .replace(/[^a-zA-Z]+/g, ' ') // Replace non-letter characters with spaces
      .toUpperCase()
  };

  return (
    <div className="mt-4 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
      <table className="w-full bg-white dark:bg-black border-collapse">
      <thead className="bg-gray-50 dark:bg-gray-800">
        <tr>
          {["ID", ...jsonData.map((col) => (col.name) ), "Actions"].map((col) => (
            <th className="border-b border-gray-200 dark:border-gray-600 p-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400" key={col}>
              {formatColumnName(col)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((record) => (
            <tr key={record.id} className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="p-3 text-sm text-gray-900 dark:text-gray-100">{record.id}</td>
              {jsonData.map((col) => {
                const columnName = col.name.trim();
                const cellValue = record[columnName] || ""; // Get the value for this column

                return (
                  <td className="p-3 text-sm text-gray-900 dark:text-gray-100" key={columnName}>
                    {columnName === "password" || columnName === "pw" ? (
                      <span>********</span> // Mask the password
                    ) : (
                      cellValue
                    )}
                  </td>
                );
              })}
              <td className="p-3">
                {record.selected === "YES" ? (
                  <Button className="mr-2 bg-green-600 hover:bg-green-500 text-white">Selected</Button>
                ) : (
                  <Button onClick={() => selectRecord(record.id)} className="mr-2">
                    Select
                  </Button>
                )}
                <Button onClick={() => handleDelete(record.id)}>Delete</Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={config.tableColumns.split(",").length + 2} className="p-3 text-center text-gray-500 dark:text-gray-400">
              No records found
            </td>
          </tr>
        )}
      </tbody>
    </table>
    </div>
  );
};

export default DataTable;
