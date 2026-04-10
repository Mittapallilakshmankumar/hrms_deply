
import { useEffect, useState } from "react";
import AddCandidateModal from "./AddCandidateModal";

const CandidateTable = () => {

  const [candidates, setCandidates] = useState([]);
  const [viewId, setViewId] = useState(null);

  // ✅ search state
  const [search, setSearch] = useState("");

  // ✅ pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;


  useEffect(() => {

    const userId = localStorage.getItem("userId");
    const isAdmin = localStorage.getItem("isAdmin");

    const url =
      isAdmin === "true"
        ? "http://127.0.0.1:8000/api/app1/employees/"
        : `http://127.0.0.1:8000/api/app1/employees/?user_id=${userId}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log("API DATA:", data);
        setCandidates(data);
      })
      .catch((err) => console.error(err));

  }, []);


  // ✅ search filter logic
  const filteredCandidates = candidates.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.employee_id?.toLowerCase().includes(search.toLowerCase())
  );


  // ✅ pagination logic
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;

  const currentRecords = filteredCandidates.slice(
    indexOfFirst,
    indexOfLast
  );

  const totalPages = Math.ceil(
    filteredCandidates.length / recordsPerPage
  );


  return (

    <div className="bg-white rounded shadow p-4 overflow-x-auto">


      {/* 🔍 SEARCH BAR */}

      <div className="flex justify-between items-center mb-4">

        <input
          type="text"
          placeholder="Search by Employee Name or ID..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset page after search
          }}
          className="border px-4 py-2 rounded w-72 focus:outline-none focus:ring focus:ring-blue-200"
        />

      </div>



      {/* HEADER */}

      <div className="grid grid-cols-8 gap-4 min-w-[1300px] font-semibold text-sm border-b pb-3">

        <div>Emp ID</div>
        <div>Name</div>
        <div>Email</div>
        <div>Phone</div>
        <div>Department</div>
        <div>Joining Date</div>
        <div>Role</div>
        <div>Action</div>

      </div>



      {/* DATA */}

      {currentRecords.length > 0 ? (

        currentRecords.map((c, index) => (

          <div
            key={index}
            className="grid grid-cols-8 gap-4 min-w-[1300px] text-sm border-b py-3 hover:bg-gray-50"
          >

            <div>{c.employee_id}</div>
            <div>{c.name}</div>
            <div>{c.email}</div>
            <div>{c.phone}</div>
            <div>{c.department}</div>
            <div>{c.date_of_joining}</div>
            <div>{c.role}</div>


            {/* VIEW BUTTON */}

            <div>

              <button
                onClick={() => setViewId(c.id)}
                className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
              >
                View
              </button>

            </div>

          </div>

        ))

      ) : (

        <div className="flex justify-center py-10 text-gray-400">
          No records found
        </div>

      )}



      {/* ✅ PAGINATION */}

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



      {/* OPEN MODAL */}

      {viewId && (

        <AddCandidateModal
          closeModal={() => setViewId(null)}
          candidateId={viewId}
        />

      )}

    </div>

  );

};


export default CandidateTable;
