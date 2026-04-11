import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import HrApprovalTable from "./HrApprovalTable";
import EmployeesList from "./EmployeesList";
import CandidatesList from "./CandidatesList";

export default function ApproveLeave() {

  const handleRefresh = () => {
    setSelectedDate("");
    setSelectedMonth("");
    setSearch("");
    setCurrentPage(1);
  };

  const [isAdminLogged] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    half_day: 0
  });

  const [attendanceData, setAttendanceData] = useState([]);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  // ✅ SEARCH STATE
  const [search, setSearch] = useState("");

  // ✅ PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;


  // 🔥 FETCH DATA
  useEffect(() => {

    if (isAdminLogged) {

      let url = "http://127.0.0.1:8000/api/attendance/admin-dashboard/";

      if (selectedDate) {
        url = `http://127.0.0.1:8000/api/attendance/by-date/?date=${selectedDate}`;
      }
      else if (selectedMonth) {
        url = `http://127.0.0.1:8000/api/attendance/by-month/?month=${selectedMonth}`;
      }

      fetch(url)
        .then(res => res.json())
        .then(data => {

          setAttendanceData(data);

          let total = data.length;
          let present = 0;
          let absent = 0;

          data.forEach(emp => {

            const status = (emp.today_status || emp.status || "").toLowerCase();

            if (status === "present") present++;
            else absent++;

          });

          setStats({
            total,
            present,
            absent,
            half_day: 0
          });

        })
        .catch(err => console.log(err));
    }

  }, [isAdminLogged, selectedDate, selectedMonth]);


  // ✅ SEARCH FILTER
  const filteredData = attendanceData.filter(emp =>
    emp.name?.toLowerCase().includes(search.toLowerCase()) ||
    emp.employee_id?.toLowerCase().includes(search.toLowerCase())
  );


  // ✅ PAGINATION LOGIC
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;

  const currentRecords = filteredData.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);


  return (

    <div className="flex">

      <Sidebar />

      <div className="flex-1 p-8 ml-24">

        <div className="space-y-6">


          {/* DASHBOARD */}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            <div className="bg-white p-5 rounded-2xl shadow">
              <p>Total Employees</p>
              <h2 className="text-3xl font-bold">{stats.total}</h2>
            </div>

            <div className="bg-green-100 p-5 rounded-2xl">
              <p>Present</p>
              <h2 className="text-3xl font-bold">{stats.present}</h2>
            </div>

            <div className="bg-red-100 p-5 rounded-2xl">
              <p>Absent</p>
              <h2 className="text-3xl font-bold">{stats.absent}</h2>
            </div>

            <div className="bg-yellow-100 p-5 rounded-2xl">
              <p>Half Day</p>
              <h2 className="text-3xl font-bold">{stats.half_day}</h2>
            </div>

          </div>


          {/* TITLE */}

          <h2 className="font-bold text-lg">Attendance Table</h2>


          {/* FILTERS + SEARCH */}

          <div className="flex flex-wrap gap-3 items-center mb-4">

            <input
              type="date"
              className="border p-2"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedMonth("");
                setCurrentPage(1);
              }}
            />


            <input
              type="month"
              className="border p-2"
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setSelectedDate("");
                setCurrentPage(1);
              }}
            />


            {/* SEARCH BAR */}

            <input
              type="text"
              placeholder="Search by Employee Name or ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="border px-4 py-2 rounded w-72"
            />
          
            <button
  onClick={() => window.location.reload()}
  className="bg-blue-600 text-white px-4 py-2 rounded"
>
  Refresh
</button>

          </div>


          {/* TABLE */}

          <table className="w-full border bg-white">

            <thead>

              <tr>

                <th className="border p-2">Emp ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Login Time</th>
                <th className="border p-2">Logout Time</th>
                <th className="border p-2">Present</th>
                <th className="border p-2">Absent</th>
                <th className="border p-2">Total</th>

              </tr>

            </thead>


            <tbody>

              {currentRecords.length > 0 ? (

                currentRecords.map((emp) => {

                  const status = emp.today_status || emp.status;

                  return (

                    <tr key={emp.employee_id} className="text-center">

                      <td className="border p-2">{emp.employee_id}</td>
                      <td className="border p-2">{emp.name}</td>

                      <td
                        className={`border p-2 font-bold ${
                          status === "Present"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {status}
                      </td>

                      <td className="border p-2">
                        {emp.login_time || "Not Logged In"}
                      </td>

                      <td className="border p-2">
                        {emp.logout_time || "Not Logged Out"}
                      </td>

                      <td className="border p-2 text-green-600">
                        {selectedDate
                          ? (status === "Present" ? 1 : 0)
                          : emp.present_days}
                      </td>

                      <td className="border p-2 text-red-600">
                        {selectedDate
                          ? (status === "Absent" ? 1 : 0)
                          : emp.absent_days}
                      </td>

                      <td className="border p-2">
                        {selectedDate ? 1 : emp.total_days}
                      </td>

                    </tr>

                  );

                })

              ) : (

                <tr>
                  <td colSpan="8" className="p-4 text-center">
                    No Data Found
                  </td>
                </tr>

              )}

            </tbody>

          </table>


          {/* PAGINATION */}

          {totalPages > 1 && (

            <div className="flex justify-center mt-6 gap-2">

              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Prev
              </button>


              {[...Array(totalPages)].map((_, i) => (

                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : ""
                  }`}
                >
                  {i + 1}
                </button>

              ))}


              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Next
              </button>

            </div>

          )}


          <HrApprovalTable />
          <EmployeesList />
          <CandidatesList />

        </div>

      </div>

    </div>

  );

}