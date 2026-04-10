import { useEffect, useState } from "react";

export default function HrApprovalTable() {

  const [requests, setRequests] = useState([]);

  // SEARCH STATES
  const [searchText, setSearchText] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  // PAGINATION STATES
  const [pendingPage, setPendingPage] = useState(1);
  const [approvedPage, setApprovedPage] = useState(1);
  const [rejectedPage, setRejectedPage] = useState(1);

  const rowsPerPage = 5;

  const BASE_URL = "http://127.0.0.1:8000/api/leave";


  // FETCH DATA
  const fetchLeaves = async () => {

    try {

      const res = await fetch(`${BASE_URL}/list/`);

      const data = await res.json();

      setRequests(data);

    } catch (error) {

      console.error("Error fetching leaves:", error);

    }

  };


  useEffect(() => {

    fetchLeaves();

  }, []);


  // APPROVE
  const approveLeave = async (id) => {

    await fetch(`${BASE_URL}/approve/${id}/`, {
      method: "PUT",
    });

    fetchLeaves();

  };


  // REJECT
  const rejectLeave = async (id) => {

    await fetch(`${BASE_URL}/reject/${id}/`, {
      method: "PUT",
    });

    fetchLeaves();

  };


  // FILTER LOGIC

  const filteredRequests = requests.filter((req) => {

    const textMatch =
      req.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      req.employee_id?.toLowerCase().includes(searchText.toLowerCase());

    const dateMatch =
      searchDate === "" ||
      req.from_date?.includes(searchDate) ||
      req.to_date?.includes(searchDate);

    const statusMatch =
      searchStatus === "" ||
      req.status === searchStatus;

    return textMatch && dateMatch && statusMatch;

  });


  const pending = filteredRequests.filter(r => r.status === "Pending");
  const approved = filteredRequests.filter(r => r.status === "Approved");
  const rejected = filteredRequests.filter(r => r.status === "Rejected");


  return (

    <div className="space-y-8">


      {/* SEARCH BAR */}

      <div className="flex flex-wrap gap-3">

        <input
          type="text"
          placeholder="Search Name or Employee ID"
          value={searchText}
          onChange={(e) => {

            setSearchText(e.target.value);

            setPendingPage(1);
            setApprovedPage(1);
            setRejectedPage(1);

          }}
          className="border px-4 py-2 rounded"
        />


        <input
          type="date"
          value={searchDate}
          onChange={(e) => {

            setSearchDate(e.target.value);

            setPendingPage(1);
            setApprovedPage(1);
            setRejectedPage(1);

          }}
          className="border px-4 py-2 rounded"
        />


        <select
          value={searchStatus}
          onChange={(e) => {

            setSearchStatus(e.target.value);

            setPendingPage(1);
            setApprovedPage(1);
            setRejectedPage(1);

          }}
          className="border px-4 py-2 rounded"
        >

          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>

        </select>


        <button
          onClick={() => {

            setSearchText("");
            setSearchDate("");
            setSearchStatus("");

            setPendingPage(1);
            setApprovedPage(1);
            setRejectedPage(1);

          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Refresh
        </button>

      </div>


      {/* TABLES */}

      <LeaveTable
        title="Leave Approval Requests"
        data={pending}
        page={pendingPage}
        setPage={setPendingPage}
        rowsPerPage={rowsPerPage}
        showActions={true}
        approveLeave={approveLeave}
        rejectLeave={rejectLeave}
        bgColor="white"
      />


      <LeaveTable
        title="Approved Leaves"
        data={approved}
        page={approvedPage}
        setPage={setApprovedPage}
        rowsPerPage={rowsPerPage}
        bgColor="green"
      />


      <LeaveTable
        title="Rejected Leaves"
        data={rejected}
        page={rejectedPage}
        setPage={setRejectedPage}
        rowsPerPage={rowsPerPage}
        bgColor="red"
      />

    </div>

  );

}


/* ================= REUSABLE TABLE ================= */

function LeaveTable({
  title,
  data,
  page,
  setPage,
  rowsPerPage,
  showActions,
  approveLeave,
  rejectLeave,
  bgColor = "white"
}) {

  const start = (page - 1) * rowsPerPage;

  const paginated = data.slice(start, start + rowsPerPage);

  const totalPages = Math.ceil(data.length / rowsPerPage);


  const bgStyles = {
    white: "bg-white",
    green: "bg-green-50",
    red: "bg-red-50"
  };


  return (

    <div className={`${bgStyles[bgColor]} rounded-2xl shadow-sm border p-6`}>

      <h2 className="text-lg font-semibold mb-4">

        {title}

      </h2>


      <table className="w-full text-sm text-center">

        <thead>

          <tr className="border-b text-gray-600">

            <th>Name</th>
            <th>Department</th>
            <th>Leave Type</th>
            <th>From</th>
            <th>To</th>

            {showActions && <th>Action</th>}

          </tr>

        </thead>


        <tbody>

          {paginated.length === 0 ? (

            <tr>

              <td
                colSpan={showActions ? 6 : 5}
                className="py-6 text-gray-400"
              >
                No Records Found
              </td>

            </tr>

          ) : (

            paginated.map((item) => (

              <tr key={item.id} className="border-b">

                <td className="py-3">{item.name}</td>
                <td>{item.department}</td>
                <td>{item.leave_type}</td>
                <td>{item.from_date}</td>
                <td>{item.to_date}</td>


                {showActions && (

                  <td>

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() => approveLeave(item.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-xs"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => rejectLeave(item.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-xs"
                      >
                        Reject
                      </button>

                    </div>

                  </td>

                )}

              </tr>

            ))

          )}

        </tbody>

      </table>


      {/* PAGINATION */}

      {totalPages > 1 && (

        <div className="flex justify-center mt-4 gap-2">

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
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
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>

        </div>

      )}

    </div>

  );

}