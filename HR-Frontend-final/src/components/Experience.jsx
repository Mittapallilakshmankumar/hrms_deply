import { useState } from "react";

const Experience = () => {

  const [rows, setRows] = useState([
    { occupation: "", company: "", summary: "", duration: "", current: "" }
  ]);

  const handleChange = (index, e) => {
    const values = [...rows];
    values[index][e.target.name] = e.target.value;
    setRows(values);
  };

  const addRow = () => {
    setRows([...rows, { occupation: "", company: "", summary: "", duration: "", current: "" }]);
  };

  const removeRow = (index) => {
    const values = [...rows];
    values.splice(index, 1);
    setRows(values);
  };

  return (
    <div className="mb-8">

      <h3 className="text-lg font-semibold mb-3">
        Experience
      </h3>

      {rows.map((row, index) => (

        <div key={index} className="grid grid-cols-5 gap-3 mb-3">

          <input
            name="occupation"
            placeholder="Occupation"
            className="border p-2 rounded"
            value={row.occupation}
            onChange={(e) => handleChange(index, e)}
          />

          <input
            name="company"
            placeholder="Company"
            className="border p-2 rounded"
            value={row.company}
            onChange={(e) => handleChange(index, e)}
          />

          <input
            name="summary"
            placeholder="Summary"
            className="border p-2 rounded"
            value={row.summary}
            onChange={(e) => handleChange(index, e)}
          />

          <input
            name="duration"
            placeholder="Duration"
            className="border p-2 rounded"
            value={row.duration}
            onChange={(e) => handleChange(index, e)}
          />

          <div className="flex gap-2">

            <select
              name="current"
              className="border p-2 rounded w-full"
              value={row.current}
              onChange={(e) => handleChange(index, e)}
            >
              <option>Select</option>
              <option>Yes</option>
              <option>No</option>
            </select>

            {rows.length > 1 && (
              <button
                onClick={() => removeRow(index)}
                className="text-red-500"
              >
                ✕
              </button>
            )}

          </div>

        </div>

      ))}

      <button
        onClick={addRow}
        className="text-blue-600 font-medium"
      >
        + Add Row
      </button>

    </div>
  );
};

export default Experience;