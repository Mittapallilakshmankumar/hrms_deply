// export default function RoleCards({ activeRole, setActiveRole }) {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       <div
//         onClick={() => setActiveRole("employee")}
//         className={`rounded-2xl p-6 border cursor-pointer transition ${
//           activeRole === "employee"
//             ? "bg-blue-50 border-blue-500 shadow-sm"
//             : "bg-white border-gray-200 hover:shadow-sm"
//         }`}
//       >
//         <h2 className="text-xl font-semibold text-gray-800">Employee Panel</h2>
//         <p className="text-sm text-gray-500 mt-2">
//           Apply leave and view your request history.
//         </p>
//       </div>

//       <div
//         onClick={() => setActiveRole("hr")}
//         className={`rounded-2xl p-6 border cursor-pointer transition ${
//           activeRole === "hr"
//             ? "bg-green-50 border-green-500 shadow-sm"
//             : "bg-white border-gray-200 hover:shadow-sm"
//         }`}
//       >
//         <h2 className="text-xl font-semibold text-gray-800">HR Panel</h2>
//         <p className="text-sm text-gray-500 mt-2">
//           Approve or reject employee leave requests.
//         </p>
//       </div>
//     </div>
//   );
// }


