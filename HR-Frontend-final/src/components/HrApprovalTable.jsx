import { useEffect, useState } from "react";

export default function HrApprovalTable() {

  const [requests, setRequests] = useState([]);

  const BASE_URL = "http://127.0.0.1:8000/api/leave";

  // ✅ FETCH ALL LEAVES
  const fetchLeaves = async () => {
    try {
      const res = await fetch(`${BASE_URL}/list/`);
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  // ✅ LOAD DATA ON PAGE LOAD
  useEffect(() => {
    fetchLeaves();
  }, []);

  // ✅ APPROVE LEAVE
  const approveLeave = async (id) => {
    try {
      await fetch(`${BASE_URL}/approve/${id}/`, {
        method: "PUT",
      });

      fetchLeaves(); // refresh table
    } catch (error) {
      console.error("Error approving leave:", error);
    }
  };

  // ✅ REJECT LEAVE
  const rejectLeave = async (id) => {
    try {
      await fetch(`${BASE_URL}/reject/${id}/`, {
        method: "PUT",
      });

      fetchLeaves(); // refresh table
    } catch (error) {
      console.error("Error rejecting leave:", error);
    }
  };

  // ✅ FILTER DATA
  const pending = requests.filter((r) => r.status === "Pending");
  const approved = requests.filter((r) => r.status === "Approved");
  const rejected = requests.filter((r) => r.status === "Rejected");

  return (
    <div className="space-y-8">

      {/* 🔹 PENDING TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">

        <h2 className="text-lg font-semibold mb-4">
          Leave Approval Requests
        </h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-2">Name</th>
              <th>Department</th>
              <th>Leave Type</th>
              <th>From</th>
              <th>To</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {pending.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-400">
                  No Pending Requests
                </td>
              </tr>
            ) : (
              pending.map((req) => (
                <tr key={req.id} className="border-b">

                  <td className="py-3 font-medium">{req.name}</td>
                  <td>{req.department}</td>
                  <td>{req.leave_type}</td>
                  <td>{req.from_date}</td>
                  <td>{req.to_date}</td>
                  <td>{req.reason}</td>

                  <td>
                    <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                      Pending
                    </span>
                  </td>

                  <td>
                    <div className="flex gap-2">

                      <button
                        onClick={() => approveLeave(req.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-xs"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => rejectLeave(req.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-xs"
                      >
                        Reject
                      </button>

                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 APPROVED TABLE */}
      <div className="bg-green-50 rounded-xl border p-4">

        <h3 className="text-green-700 font-semibold mb-3">
          Approved Leaves
        </h3>

        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-green-700 border-b">
              <th>Name</th>
              <th>Department</th>
              <th>Leave Type</th>
              <th>From</th>
              <th>To</th>
            </tr>
          </thead>

          <tbody>
            {approved.map((item) => (
              <tr key={item.id}>
                <td className="py-2">{item.name}</td>
                <td>{item.department}</td>
                <td>{item.leave_type}</td>
                <td>{item.from_date}</td>
                <td>{item.to_date}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {/* 🔹 REJECTED TABLE */}
      <div className="bg-red-50 rounded-xl border p-4">

        <h3 className="text-red-700 font-semibold mb-3">
          Rejected Leaves
        </h3>

        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-red-700 border-b">
              <th>Name</th>
              <th>Department</th>
              <th>Leave Type</th>
              <th>From</th>
              <th>To</th>
            </tr>
          </thead>

          <tbody>
            {rejected.map((item) => (
              <tr key={item.id}>
                <td className="py-2">{item.name}</td>
                <td>{item.department}</td>
                <td>{item.leave_type}</td>
                <td>{item.from_date}</td>
                <td>{item.to_date}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
}