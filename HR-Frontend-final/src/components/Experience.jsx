import { useState } from "react";

const Experience = ({ setExperienceData }) => {

  const [rows, setRows] = useState([
    { company_name: "", role: "", years: "", description: "" }
  ]);

  const handleChange = (index, e) => {
    const values = [...rows];
    values[index][e.target.name] = e.target.value;
    setRows(values);

    // send data to parent
    if (setExperienceData) {
      setExperienceData(values);
    }
  };

  const addRow = () => {
    setRows([...rows, { company_name: "", role: "", years: "", description: "" }]);
  };

  const removeRow = (index) => {
    const values = [...rows];
    values.splice(index, 1);
    setRows(values);

    if (setExperienceData) {
      setExperienceData(values);
    }
  };

  return (
    <div className="mb-8">

      <h3 className="text-lg font-semibold mb-3">
        Experience
      </h3>

      {rows.map((row, index) => (

        <div key={index} className="grid grid-cols-5 gap-3 mb-3">

          <input
            name="company_name"
            placeholder="Company Name"
            className="border p-2 rounded"
            value={row.company_name}
            onChange={(e) => handleChange(index, e)}
          />

          <input
            name="role"
            placeholder="Role"
            className="border p-2 rounded"
            value={row.role}
            onChange={(e) => handleChange(index, e)}
          />

          <input
            name="years"
            placeholder="Years"
            className="border p-2 rounded"
            value={row.years}
            onChange={(e) => handleChange(index, e)}
          />

          <input
            name="description"
            placeholder="Description"
            className="border p-2 rounded"
            value={row.description}
            onChange={(e) => handleChange(index, e)}
          />

          <div className="flex gap-2">

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


