import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function EmployeesList() {

  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const token = localStorage.getItem("petty-cash-access");


  /* ===============================
     SPLIT DATA
  =============================== */

  const activeEmployees = employees.filter(emp => emp.is_active === true);
  const exitedEmployees = employees.filter(emp => emp.is_active === false);


  /* ===============================
     FETCH EMPLOYEES
  =============================== */

  const fetchEmployees = async () => {

    try {

      const res = await fetch(
        "http://127.0.0.1:8000/api/app1/employees/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!res.ok) {
        alert("Unauthorized. Please login again ❌");
        return;
      }

      const data = await res.json();
      setEmployees(data);

    } catch (error) {

      console.log(error);
      alert("Server error while fetching employees ❌");

    }

  };


  useEffect(() => {
    fetchEmployees();
  }, []);


  /* ===============================
     OPEN RESET PASSWORD MODAL
  =============================== */

  const openModal = (emp) => {

    setSelectedEmp(emp);
    setShowModal(true);
    setNewPassword("");
    setShowPassword(false);

  };


  /* ===============================
     RESET PASSWORD
  =============================== */

  const handleReset = async () => {

    if (!newPassword) {
      alert("Password required ❌");
      return;
    }

    try {

      const res = await fetch(
        "http://127.0.0.1:8000/api/attendance/admin-reset-password/",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            employee_id: selectedEmp.employee_id,
            email: selectedEmp.email,
            new_password: newPassword
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {

        alert(data.message || "Password updated successfully ✅");

        setShowModal(false);
        setNewPassword("");

      } else {

        alert(data.message || "Password reset failed ❌");

      }

    } catch (error) {

      console.log(error);
      alert("Server error ❌");

    }

  };


  /* ===============================
     EXIT EMPLOYEE
  =============================== */

  const handleExit = async (id) => {

    const confirmExit = window.confirm(
      "Are you sure you want to exit this employee?"
    );

    if (!confirmExit) return;

    try {

      const res = await fetch(
        `http://127.0.0.1:8000/api/app1/employees/${id}/exit/`,
        {
          method: "PATCH",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      const data = await res.json();

      if (res.ok) {

        alert(data.message || "Employee exited successfully ✅");

        fetchEmployees(); // refresh list

      } else {

        alert(data.message || "Exit failed ❌");

      }

    } catch (error) {

      console.log(error);
      alert("Server error ❌");

    }

  };


  /* ===============================
     UI
  =============================== */

  return (

    <div className="bg-white rounded-2xl shadow p-6 mt-6">

      {/* ACTIVE EMPLOYEES */}

      <h2 className="text-xl font-bold mb-4 text-green-600">
        Active Employees
      </h2>


      <div className="overflow-x-auto">

        <table className="min-w-full border border-gray-200 rounded-lg">

          <thead className="bg-gray-100">
            <tr>
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


          <tbody className="text-center">

            {activeEmployees.map((item) => (

              <tr key={item.id}>

                <td className="p-3 border">{item.employee_id}</td>
                <td className="p-3 border">{item.name}</td>
                <td className="p-3 border">{item.email}</td>
                <td className="p-3 border">{item.phone}</td>
                <td className="p-3 border">{item.department}</td>
                <td className="p-3 border">{item.role}</td>
                <td className="p-3 border">{item.date_of_joining}</td>

                <td className="p-3 border text-green-600 font-bold">
                  Active
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

            ))}

          </tbody>

        </table>

      </div>


      {/* EXITED EMPLOYEES */}

      <h2 className="text-xl font-bold mt-8 mb-4 text-red-600">
        Exited Employees
      </h2>


      <table className="min-w-full border">

        <tbody>

          {exitedEmployees.map((item) => (

            <tr key={item.id}>

              <td className="p-3 border">{item.employee_id}</td>
              <td className="p-3 border">{item.name}</td>

              <td className="p-3 border text-red-600 font-bold">
                Exited
              </td>

            </tr>

          ))}

        </tbody>

      </table>


      {/* RESET PASSWORD MODAL */}

      {showModal && (

        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40">

          <div className="bg-white p-6 rounded">

            <h3 className="mb-3 font-semibold">
              Reset Password
            </h3>


            <div className="flex items-center gap-2">

              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="border p-2"
              />

              <span
                className="cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </span>

            </div>


            <div className="mt-4 flex gap-3">

              <button
                onClick={handleReset}
                className="bg-blue-500 text-white px-4 py-1 rounded"
              >
                Update
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-4 py-1 rounded"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}