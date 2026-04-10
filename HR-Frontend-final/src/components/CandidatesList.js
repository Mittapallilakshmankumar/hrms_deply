import { useEffect, useState } from "react";

export default function CandidatesList() {

  const [candidates, setCandidates] = useState([]);

  // 🔍 SEARCH STATES
  const [searchText, setSearchText] = useState("");
  const [searchDept, setSearchDept] = useState("");

  // 📄 PAGINATION STATE
  const [page, setPage] = useState(1);

  const rowsPerPage = 5;


  // ✅ FETCH DATA

  const fetchCandidates = () => {

    fetch("http://127.0.0.1:8000/api/app1/list/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("petty-cash-access")}`,
      },
    })
      .then(res => res.json())
      .then(data => {

        if (Array.isArray(data)) {
          setCandidates(data);
        }
        else if (Array.isArray(data.data)) {
          setCandidates(data.data);
        }
        else if (Array.isArray(data.results)) {
          setCandidates(data.results);
        }
        else {
          setCandidates([]);
        }

      })
      .catch(err => console.log("Error:", err));

  };


  useEffect(() => {

    fetchCandidates();

  }, []);



  // 🔍 FILTER LOGIC

  const filteredCandidates = candidates.filter((item) => {

    const textMatch =
      `${item.first_name} ${item.last_name}`
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.phone?.toLowerCase().includes(searchText.toLowerCase());

    const deptMatch =
      searchDept === "" ||
      item.department
        ?.toLowerCase()
        .includes(searchDept.toLowerCase());

    return textMatch && deptMatch;

  });



  // 📄 PAGINATION

  const startIndex = (page - 1) * rowsPerPage;

  const paginatedCandidates = filteredCandidates.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const totalPages = Math.ceil(
    filteredCandidates.length / rowsPerPage
  );



  // ✅ APPROVE FUNCTION

  const approveCandidate = async (id) => {

    try {

      const res = await fetch(
        `http://127.0.0.1:8000/api/app1/approve-candidate/${id}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "petty-cash-access"
            )}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (!res.ok || data.error) {

        alert(
          "Error ❌: " +
            (data.error || "Something failed")
        );

        return;

      }

      alert("Approved ✅\nEMP ID: " + data.employee_id);

      setCandidates((prev) =>
        prev.filter((item) => item.id !== id)
      );

    }
    catch (err) {

      console.log(err);

      alert("Server error ❌");

    }

  };



  return (

    <div className="w-full bg-white rounded-2xl shadow p-6 mt-6">


      {/* HEADER + SEARCH */}

      <div className="flex flex-wrap gap-3 justify-between mb-4">

        <h2 className="text-xl font-bold text-gray-700">

          Onboarding Candidates

        </h2>


        <div className="flex gap-3">

          {/* SEARCH NAME / EMAIL / PHONE */}

          <input
            type="text"
            placeholder="Search Name / Email / Phone"
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


          {/* REFRESH */}

          <button
            onClick={() => {
              setSearchText("");
              setSearchDept("");
              setPage(1);
            }}
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

            <tr className="text-center">

              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">Department</th>
              <th className="p-3 border">Role</th>
              <th className="p-3 border">Joining Date</th>
              <th className="p-3 border">Action</th>

            </tr>

          </thead>



          <tbody className="text-sm text-center">

            {paginatedCandidates.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="p-4 text-gray-400"
                >

                  No Candidates Found

                </td>

              </tr>

            ) : (

              paginatedCandidates.map((item) => (

                <tr
                  key={item.id}
                  className="hover:bg-gray-50"
                >

                  <td className="p-3 border">

                    {item.first_name} {item.last_name}

                  </td>

                  <td className="p-3 border break-words">

                    {item.email || "-"}

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

                    {item.date_of_joining ||
                      "Not Assigned"}

                  </td>

                  <td className="p-3 border">

                    <button
                      onClick={() =>
                        approveCandidate(item.id)
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >

                      Approve

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

    </div>

  );

}