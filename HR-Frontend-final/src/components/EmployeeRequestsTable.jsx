import { useEffect, useState } from "react";

export default function EmployeeRequestsTable() {

  const [requests, setRequests] = useState([]);

  // ✅ SEARCH STATES
  const [search, setSearch] = useState("");
  const [dateSearch, setDateSearch] = useState("");

  // ✅ PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const BASE_URL = "http://127.0.0.1:8000/api/leave";


  // ✅ FETCH LEAVE REQUESTS
  const fetchRequests = async () => {

    try {

      const userId = localStorage.getItem("userId");

      const res = await fetch(
        `${BASE_URL}/list/?user_id=${userId}`
      );

      const data = await res.json();

      setRequests(data);

    } catch (error) {

      console.error("Error fetching leave requests:", error);

    }

  };


  // ✅ LOAD DATA
  useEffect(() => {

    fetchRequests();

  }, []);


  // ✅ FILTER LOGIC (NAME + EMP ID + DATE)

  const filteredRequests = requests.filter((req) => {

    const matchesText =
      req.name?.toLowerCase().includes(search.toLowerCase()) ||
      req.employee_id?.toLowerCase().includes(search.toLowerCase());

    const matchesDate =
      dateSearch === "" ||
      req.from_date?.includes(dateSearch) ||
      req.to_date?.includes(dateSearch);

    return matchesText && matchesDate;

  });


  // ✅ PAGINATION LOGIC

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;

  const currentRecords = filteredRequests.slice(
    indexOfFirst,
    indexOfLast
  );

  const totalPages = Math.ceil(
    filteredRequests.length / recordsPerPage
  );


  return (

    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 overflow-x-auto">


      {/* TITLE */}

      <h2 className="text-xl font-semibold text-gray-800 mb-4">

        Employee Leave Requests

      </h2>


      {/* SEARCH BAR SECTION */}

      <div className="flex flex-wrap gap-3 mb-4">

        {/* NAME / EMP ID SEARCH */}

        <input
          type="text"
          placeholder="Search by Name or Employee ID"
          value={search}
          onChange={(e) => {

            setSearch(e.target.value);
            setCurrentPage(1);

          }}
          className="border px-4 py-2 rounded w-72"
        />


        {/* DATE SEARCH */}

        <input
          type="date"
          value={dateSearch}
          onChange={(e) => {

            setDateSearch(e.target.value);
            setCurrentPage(1);

          }}
          className="border px-4 py-2 rounded"
        />


        {/* CLEAR BUTTON */}

        <button
          onClick={() => {

            setSearch("");
            setDateSearch("");
            setCurrentPage(1);

          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Refresh
        </button>

      </div>


      {/* TABLE */}

      <table className="w-full min-w-[900px] text-sm">

        <thead>

          <tr className="text-left border-b border-gray-200 text-gray-600">

            <th className="py-3">Name</th>
            <th className="py-3">ID</th>
            <th className="py-3">Department</th>
            <th className="py-3">Leave Type</th>
            <th className="py-3">From</th>
            <th className="py-3">To</th>
            <th className="py-3">Reason</th>
            <th className="py-3">Status</th>

          </tr>

        </thead>


        <tbody>

          {currentRecords.length === 0 ? (

            <tr>

              <td colSpan="8" className="text-center py-6 text-gray-400">

                No leave requests found

              </td>

            </tr>

          ) : (

            currentRecords.map((request, index) => (

              <tr
                key={request.id || index}
                className="border-b border-gray-100"
              >

                <td className="py-3">{request.name || "-"}</td>

                <td className="py-3">{request.employee_id || "-"}</td>

                <td className="py-3">{request.department || "-"}</td>

                <td className="py-3">{request.leave_type || "-"}</td>

                <td className="py-3">{request.from_date || "-"}</td>

                <td className="py-3">{request.to_date || "-"}</td>

                <td className="py-3">{request.reason || "-"}</td>


                <td className="py-3">

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      request.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : request.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {request.status || "Pending"}
                  </span>

                </td>

              </tr>

            ))

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

    </div>

  );

}