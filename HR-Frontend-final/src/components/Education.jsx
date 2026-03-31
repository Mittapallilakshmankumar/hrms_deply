import { useState } from "react";

const Education = ({ setEducationData }) => {

  const [rows, setRows] = useState([{}]);

  const handleChange = (index, e) => {
    const values = [...rows];
    values[index][e.target.placeholder] = e.target.value;
    setRows(values);

    // send data to parent
    if (setEducationData) {
      setEducationData(values);
    }
  };

  const addRow = () => {
    setRows([...rows, {}]);
  };

  const removeRow = (index) => {
    const values = [...rows];
    values.splice(index, 1);
    setRows(values);

    if (setEducationData) {
      setEducationData(values);
    }
  };

  return (
    <div className="mb-6">

      <h3 className="text-lg font-semibold mb-3">Education</h3>

      {rows.map((row, index) => (
        <div key={index} className="grid grid-cols-5 gap-3 mb-2">

          <input
            placeholder="School Name"
            className="border p-2 rounded"
            onChange={(e) => handleChange(index, e)}
          />

          <input
            placeholder="Degree / Diploma"
            className="border p-2 rounded"
            onChange={(e) => handleChange(index, e)}
          />

          <input
            placeholder="Field of Study"
            className="border p-2 rounded"
            onChange={(e) => handleChange(index, e)}
          />

          <input
            type="date"
            className="border p-2 rounded"
            onChange={(e) => handleChange(index, e)}
          />

          {/* ❌ BUTTON ADDED HERE */}
          <div className="flex items-center gap-2">
            <input
              placeholder="Notes"
              className="border p-2 rounded w-full"
              onChange={(e) => handleChange(index, e)}
            />

            {rows.length > 1 && (
              <button
                onClick={() => removeRow(index)}
                className="text-red-500 font-bold"
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

export default Education;