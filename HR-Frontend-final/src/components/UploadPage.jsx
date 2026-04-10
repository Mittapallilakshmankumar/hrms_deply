import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

export default function UploadPage() {

  const [rows, setRows] = useState([
    { id: Date.now(), name: "", file: null },
  ]);

  const [files, setFiles] = useState([]);
  const [employeeName, setEmployeeName] = useState("");

  // ✅ GET ROLE + IDS
  const role = (localStorage.getItem("role") || "").toLowerCase().trim();
  const employeeId = localStorage.getItem("employeeId");
  const userId = localStorage.getItem("userId");


  // 🔥 GET EMPLOYEE NAME (TEMP)
  useEffect(() => {

    /*
    fetch(`/api/get-employee/${employeeId}`)
      .then(res => res.json())
      .then(data => setEmployeeName(data.name));
    */

    setEmployeeName("John Doe");

  }, [employeeId]);


  // 🔥 FETCH FILES (ROLE BASED FRONTEND LOGIC)
  const fetchFiles = async () => {

    try {

      let url = "";

      // ✅ ADMIN / HR / MANAGEMENT → GET ALL FILES
      if (["admin", "hr", "management"].includes(role)) {

        url = `http://127.0.0.1:8000/api/app1/files/?user_id=${userId}`;

      }

      // ✅ EMPLOYEE → GET OWN FILES ONLY
      else {

        url = `http://127.0.0.1:8000/api/app1/files/?employee_id=${employeeId}`;

      }

      const res = await fetch(url);

      const data = await res.json();

      const formatted = data.map((f) => ({

        id: f.id,
        emp: f.employee_id,
        empName: f.employee_name,
        name: f.file_name,
        fileName: f.file.split("/").pop(),
        url: f.file,

      }));

      setFiles(formatted);

    } catch (err) {

      console.error(err);

    }

  };


  useEffect(() => {

    fetchFiles();

  }, [employeeId, role]);


  // 🔥 HANDLE CHANGE
  const handleChange = (index, field, value) => {

    const updated = [...rows];

    updated[index][field] = value;

    setRows(updated);

  };


  // 🔥 ADD ROW
  const addRow = () => {

    setRows([...rows, { id: Date.now(), name: "", file: null }]);

  };


  // 🔥 REMOVE ROW
  const removeRow = (index) => {

    setRows(rows.filter((_, i) => i !== index));

  };


  // 🔥 API UPLOAD FUNCTION
  const uploadToServer = async (row) => {

    const formData = new FormData();

    formData.append("employee_id", employeeId);

    formData.append("file_name", row.name);

    formData.append("file", row.file);


    const res = await fetch(
      "http://127.0.0.1:8000/api/app1/upload-file/",
      {
        method: "POST",
        body: formData,
      }
    );

    return res.json();

  };


  // ✅ UPLOAD SINGLE FILE
  const uploadSingle = async (row, index) => {

    if (!row.name || !row.file) {

      alert("Fill all fields");

      return;

    }

    try {

      await uploadToServer(row);

      fetchFiles();


      const updated = [...rows];

      updated[index] = {

        id: Date.now() + Math.random(),
        name: "",
        file: null,

      };

      setRows(updated);

    } catch (err) {

      console.error(err);

      alert("Upload failed");

    }

  };


  // ✅ UPLOAD ALL FILES
  const uploadAll = async () => {

    for (let r of rows) {

      if (!r.name || !r.file) {

        alert("Fill all fields");

        return;

      }

    }

    try {

      for (let r of rows) {

        await uploadToServer(r);

      }

      fetchFiles();

      setRows([{ id: Date.now(), name: "", file: null }]);

    } catch (err) {

      console.error(err);

      alert("Upload failed");

    }

  };


  // ✅ DOWNLOAD FILE
  const handleDownload = (file) => {

    const a = document.createElement("a");

    a.href = file.url;

    a.download = file.fileName;

    a.click();

  };


  return (

    <div className="flex">

      <Sidebar />


  <div className="flex-1 p-8 ml-24">

        <h2 className="text-3xl font-bold mb-6">
          File Upload Manager
        </h2>


        {/* UPLOAD SECTION */}

        <div className="space-y-4">

          {rows.map((row, index) => (

            <div
              key={row.id}
              className="flex flex-wrap gap-3 bg-white p-4 rounded-xl shadow"
            >

              <input
                type="text"
                placeholder="Enter display name"
                className="flex-1 px-3 py-2 border rounded-lg"
                value={row.name}
                onChange={(e) =>
                  handleChange(index, "name", e.target.value)
                }
              />


              <input
                key={row.id}
                type="file"
                onChange={(e) =>
                  handleChange(index, "file", e.target.files[0])
                }
                className="flex-1"
              />


              <button
                onClick={() => uploadSingle(row, index)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Upload
              </button>


              <button
                onClick={addRow}
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
              >
                +
              </button>


              {index !== 0 && (

                <button
                  onClick={() => removeRow(index)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  ✕
                </button>

              )}

            </div>

          ))}

        </div>


        {/* UPLOAD ALL BUTTON */}

        <div className="mt-6">

          <button
            onClick={uploadAll}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
          >
            Upload All Files
          </button>

        </div>


        {/* FILE TABLE */}

        <div className="mt-10">

          <h3 className="text-xl font-semibold mb-4">
            Uploaded Files
          </h3>


          <div className="overflow-x-auto bg-white rounded-xl shadow">

            <table className="min-w-full">

              <thead className="bg-gray-100">

                <tr>

                  {/* ADMIN / HR / MANAGEMENT ONLY */}

                  {["admin", "hr", "management"].includes(role) && (

                    <>
                      <th className="px-4 py-3 text-left">Emp ID</th>
                      <th className="px-4 py-3 text-left">Emp Name</th>
                    </>

                  )}

                  <th className="px-4 py-3 text-left">Name</th>

                  <th className="px-4 py-3 text-left">File</th>

                  <th className="px-4 py-3 text-left">Actions</th>

                </tr>

              </thead>


              <tbody>

                {files.map((f) => (

                  <tr key={f.id} className="border-t">

                    {/* ADMIN / HR / MANAGEMENT ONLY */}

                    {["admin", "hr", "management"].includes(role) && (

                      <>
                        <td className="px-4 py-3">{f.emp}</td>
                        <td className="px-4 py-3">{f.empName}</td>
                      </>

                    )}

                    <td className="px-4 py-3">{f.name}</td>

                    <td className="px-4 py-3">{f.fileName}</td>


                    <td className="px-4 py-3 flex gap-2">

                      {/* DOWNLOAD */}
                      <button
                        onClick={() => handleDownload(f)}
                        className="bg-gray-700 text-white px-3 py-1 rounded"
                      >
                        Download
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  );

}