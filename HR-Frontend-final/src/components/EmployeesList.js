import { useEffect, useState } from "react";

export default function EmployeesList() {

  const [employees, setEmployees] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  // 🔍 SEARCH STATES
  const [searchText, setSearchText] = useState("");
  const [searchDept, setSearchDept] = useState("");

  // 📄 PAGINATION STATE
  const [page, setPage] = useState(1);

  const rowsPerPage = 6;


  // ✅ FETCH EMPLOYEES

  const fetchEmployees = () => {

    fetch("http://127.0.0.1:8000/api/app1/employees/")
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(err => console.log(err));

  };


  useEffect(() => {

    fetchEmployees();

  }, []);



  // 🔍 FILTER LOGIC

  const filteredEmployees = employees.filter(emp => {

    const textMatch =
      emp.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.employee_id?.toLowerCase().includes(searchText.toLowerCase());

    const deptMatch =
      searchDept === "" ||
      emp.department?.toLowerCase().includes(searchDept.toLowerCase());

    return textMatch && deptMatch;

  });



  // 📄 PAGINATION LOGIC

  const startIndex = (page - 1) * rowsPerPage;

  const paginatedEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);



  // 🔐 OPEN MODAL

  const openModal = (emp) => {

    setSelectedEmp(emp);

    setShowModal(true);

  };



  // 🔐 RESET PASSWORD

  const handleReset = async () => {

    if (!newPassword) return;

    try {

      const res = await fetch(
        "http://127.0.0.1:8000/api/attendance/admin-reset-password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employee_id: selectedEmp.employee_id,
            email: selectedEmp.email,
            new_password: newPassword
          }),
        }
      );

      const data = await res.json();

      alert(data.message);

      setShowModal(false);

      setNewPassword("");

    } catch (error) {

      console.log(error);

    }

  };



  // 🚪 EXIT EMPLOYEE

  const handleExit = async (id) => {

    if (!window.confirm("Are you sure?")) return;

    await fetch(
      `http://127.0.0.1:8000/api/app1/employees/${id}/exit/`,
      {
        method: "PATCH",
      }
    );

    fetchEmployees();

  };



  return (

    <div className="w-full bg-white rounded-2xl shadow p-6 mt-6">


      {/* HEADER + SEARCH */}

      <div className="flex flex-wrap gap-3 justify-between mb-4">

        <h2 className="text-xl font-bold text-gray-700">

          Employees List

        </h2>


        <div className="flex gap-3">

          {/* SEARCH NAME / ID */}

          <input
            type="text"
            placeholder="Search Name / Employee ID"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(1);
            }}
            className="border px-4 py-2 rounded"
          />


          {/* SEARCH DEPARTMENT */}

          <input
            type="text"
            placeholder="Search Department"
            value={searchDept}
            onChange={(e) => {
              setSearchDept(e.target.value);
              setPage(1);
            }}
            className="border px-4 py-2 rounded"
          />


          {/* RESET BUTTON */}

          <button
  onClick={() => window.location.reload()}
  className="bg-blue-600 text-white px-4 py-2 rounded"
>
  Refresh
</button>

        </div>

      </div>



      {/* TABLE */}

      <div className="w-full overflow-x-auto">

        <table className="w-full border border-gray-200 rounded-lg">

          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">

            <tr className="text-left">

              <th className="p-3 border">Emp ID</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">Department</th>
              <th className="p-3 border">Role</th>
              <th className="p-3 border">Joining Date</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Action</th>

            </tr>

          </thead>



          <tbody className="text-sm">

            {paginatedEmployees.length === 0 ? (

              <tr>

                <td colSpan="9" className="p-4 text-gray-400 text-center">

                  No Employees Found

                </td>

              </tr>

            ) : (

              paginatedEmployees.map((item) => (

                <tr key={item.id} className="hover:bg-gray-50">

                  <td className="p-3 border font-semibold text-blue-600">

                    {item.employee_id}

                  </td>

                  <td className="p-3 border">

                    {item.name}

                  </td>

                  <td className="p-3 border break-words">

                    {item.email}

                  </td>

                  <td className="p-3 border">

                    {item.phone || "-"}

                  </td>

                  <td className="p-3 border">

                    {item.department || "-"}

                  </td>

                  <td className="p-3 border">

                    {item.role || "-"}

                  </td>

                  <td className="p-3 border">

                    {item.date_of_joining || "-"}

                  </td>

                  <td
                    className={`p-3 border font-semibold ${
                      item.is_active
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >

                    {item.is_active ? "Active" : "Exited"}

                  </td>

                  <td className="p-3 border">

                    <button
                      onClick={() => openModal(item)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Reset
                    </button>

                    <button
                      onClick={() => handleExit(item.id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded ml-2"
                    >
                      Exit
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>



      {/* PAGINATION */}

      {totalPages > 1 && (

        <div className="flex justify-center mt-4 gap-2">

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded"
          >
            Prev
          </button>


          {[...Array(totalPages)].map((_, i) => (

            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                page === i + 1
                  ? "bg-blue-600 text-white"
                  : ""
              }`}
            >
              {i + 1}
            </button>

          ))}


          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>

        </div>

      )}



      {/* RESET PASSWORD MODAL */}

      {showModal && (

        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

          <div className="bg-white p-6 rounded-xl w-80 shadow-lg">

            <h3 className="text-lg font-bold mb-4 text-center">

              Reset Password

            </h3>

            <p className="text-sm mb-2 text-gray-600 text-center">

              {selectedEmp?.name}

            </p>

            <input
              type="password"
              placeholder="Enter new password"
              className="border p-2 w-full rounded mb-4"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <div className="flex justify-between">

              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleReset}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Update
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}