// import { useEffect, useState } from "react";

// export default function AdminPanel() {

//   const [summary, setSummary] = useState({
//     total: 0,
//     present: 0,
//     absent: 0,
//   });

//   useEffect(() => {

//     fetch("http://127.0.0.1:8000/api/attendance/admin-dashboard/")
//       .then(res => res.json())
//       .then(data => {

//         console.log("🔥 ATTENDANCE DATA:", data);

//         if (!Array.isArray(data)) {
//           console.log("❌ Not array:", data);
//           return;
//         }

//         let present = 0;

//         data.forEach(emp => {
//           const status = (emp.today_status || "")
//             .toString()
//             .trim()
//             .toLowerCase();

//           console.log("STATUS:", status);

//           if (status === "present") {
//             present++;
//           }
//         });

//         console.log("✅ FINAL PRESENT:", present);

//         setSummary({
//           total: data.length,
//           present: present,
//           absent: data.length - present
//         });

//       })
//       .catch(err => console.log("ERROR:", err));

//   }, []);

//   return (
//     <div>
//       <h2>Total: {summary.total}</h2>
//       <h2>Present: {summary.present}</h2>
//       <h2>Absent: {summary.absent}</h2>
//     </div>
//   );
// }



// import { useEffect, useState } from "react";

// export default function AdminPanel() {

//   // ✅ Summary state
//   const [summary, setSummary] = useState({
//     total: 0,
//     present: 0,
//     absent: 0,
//   });

//   // ✅ Employee list state
//   const [employees, setEmployees] = useState([]);

//   useEffect(() => {

//     fetch("http://127.0.0.1:8000/api/attendance/admin-dashboard/")
//       .then(res => res.json())
//       .then(data => {

//         console.log("🔥 ATTENDANCE DATA:", data);

//         if (!Array.isArray(data)) {
//           console.log("❌ Not array:", data);
//           return;
//         }

//         // ✅ Calculate present count
//         let present = 0;

//         data.forEach(emp => {
//           const status = (emp.today_status || "")
//             .toString()
//             .trim()
//             .toLowerCase();

//           if (status === "present") {
//             present++;
//           }
//         });

//         // ✅ Set summary
//         setSummary({
//           total: data.length,
//           present: present,
//           absent: data.length - present
//         });

//         // ✅ Store full employee data
//         setEmployees(data);

//       })
//       .catch(err => console.log("ERROR:", err));

//   }, []);

//   return (
//     <div style={{ padding: "20px" }}>

//       {/* ✅ SUMMARY */}
//       <h2>Total: {summary.total}</h2>
//       <h2>Present: {summary.present}</h2>
//       <h2>Absent: {summary.absent}</h2>

//       <hr />

//       {/* ✅ TABLE */}
//       <h3>Employee Attendance</h3>

//       <table border="1" cellPadding="10" style={{ width: "100%", textAlign: "center" }}>
//         <thead style={{ background: "#f2f2f2" }}>
//           <tr>
//             <th>ID</th>
//             <th>Name</th>
//             <th>Status</th>
//             <th>Login Time</th>
//             <th>Logout Time</th>
//           </tr>
//         </thead>

//         <tbody>
//           {employees.length > 0 ? (
//             employees.map((emp, index) => (
//               <tr key={index}>
//                 <td>{emp.employee_id}</td>
//                 <td>{emp.name}</td>

//                 {/* ✅ Status */}
//                 <td style={{ color: emp.today_status === "Present" ? "green" : "red" }}>
//                   {emp.today_status}
//                 </td>

//                 {/* ✅ Login Time */}
//                 <td>
//                   {emp.login_time ? emp.login_time : "Not Logged In"}
//                 </td>

//                 {/* ✅ Logout Time */}
//                 <td>
//                   {emp.logout_time ? emp.logout_time : "Not Logged Out"}
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="5">No Data Found</td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//     </div>
//   );
// }


// import { useEffect, useState } from "react";

// export default function EmployeesList() {

//   const [employees, setEmployees] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedEmp, setSelectedEmp] = useState(null);
//   const [newPassword, setNewPassword] = "";

//   // ✅ ADD THIS (EYE TOGGLE)
//   const [showPassword, setShowPassword] = useState(false);

//   useEffect(() => {
//     fetch("http://127.0.0.1:8000/api/app1/employees/")
//       .then(res => res.json())
//       .then(data => setEmployees(data))
//       .catch(err => console.log(err));
//   }, []);

//   const openModal = (emp) => {
//     setSelectedEmp(emp);
//     setShowModal(true);
//     setNewPassword("");
//     setShowPassword(false);
//   };

//   const handleReset = async () => {
//     if (!newPassword) return;

//     try {
//       const res = await fetch("http://127.0.0.1:8000/api/attendance/admin-reset-password/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           employee_id: selectedEmp.employee_id,
//           email: selectedEmp.email,
//           new_password: newPassword
//         }),
//       });

//       const data = await res.json();
//       alert(data.message);

//       setShowModal(false);
//       setNewPassword("");

//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow p-6 mt-6">

//       <h2 className="text-xl font-bold mb-4 text-gray-700">
//         Employees List
//       </h2>

//       <div className="overflow-x-auto">

//         <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">

//           <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
//             <tr>
//               <th className="p-3 border">Emp ID</th>
//               <th className="p-3 border">Name</th>
//               <th className="p-3 border">Email</th>
//               <th className="p-3 border">Phone</th>
//               <th className="p-3 border">Department</th>
//               <th className="p-3 border">Role</th>
//               <th className="p-3 border">Joining Date</th>
//               <th className="p-3 border">Status</th>
//               <th className="p-3 border">Action</th>
//             </tr>
//           </thead>

//           <tbody className="text-sm text-center">

//             {employees.length === 0 ? (
//               <tr>
//                 <td colSpan="9" className="p-4 text-gray-400">
//                   No Employees Found
//                 </td>
//               </tr>
//             ) : (
//               employees.map((item) => (
//                 <tr key={item.id} className="hover:bg-gray-50">

//                   <td className="p-3 border font-semibold text-blue-600">
//                     {item.employee_id}
//                   </td>

//                   <td className="p-3 border">{item.name}</td>

//                   <td className="p-3 border">{item.email}</td>

//                   <td className="p-3 border">{item.phone || "-"}</td>

//                   <td className="p-3 border">{item.department || "-"}</td>

//                   <td className="p-3 border">{item.role || "-"}</td>

//                   <td className="p-3 border">{item.date_of_joining || "-"}</td>

//                   <td className="p-3 border text-green-600 font-semibold">
//                     Active
//                   </td>

//                   <td className="p-3 border">
//                     <button
//                       onClick={() => openModal(item)}
//                       className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow"
//                     >
//                       Reset
//                     </button>
//                   </td>

//                 </tr>
//               ))
//             )}

//           </tbody>

//         </table>

//       </div>

//       {/* 🔥 MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

//           <div className="bg-white p-6 rounded-xl w-80 shadow-lg">

//             <h3 className="text-lg font-bold mb-4 text-center">
//               Reset Password
//             </h3>

//             <p className="text-sm mb-2 text-gray-600 text-center">
//               {selectedEmp?.name}
//             </p>

//             {/* ✅ PASSWORD INPUT WITH EYE */}
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter new password"
//                 className="border p-2 w-full rounded mb-4 pr-10"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//               />

//               <span
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-3 cursor-pointer"
//               >
//                 {showPassword ? "🙈" : "👁️"}
//               </span>
//             </div>

//             <div className="flex justify-between">

//               <button
//                 onClick={() => setShowModal(false)}
//                 className="bg-gray-400 text-white px-3 py-1 rounded"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={handleReset}
//                 className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
//               >
//                 Update
//               </button>

//             </div>

//           </div>

//         </div>
//       )}

//     </div>
//   );
// }



// import { useEffect, useState } from "react";

// export default function EmployeesList() {

//   const [employees, setEmployees] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedEmp, setSelectedEmp] = useState(null);
//   const [newPassword, setNewPassword] = "";

//   // ✅ ADD THIS (EYE TOGGLE)
//   const [showPassword, setShowPassword] = useState(false);

//   useEffect(() => {
//     fetch("http://127.0.0.1:8000/api/app1/employees/")
//       .then(res => res.json())
//       .then(data => setEmployees(data))
//       .catch(err => console.log(err));
//   }, []);

//   const openModal = (emp) => {
//     setSelectedEmp(emp);
//     setShowModal(true);
//     setNewPassword("");
//     setShowPassword(false);
//   };

//   const handleReset = async () => {
//     if (!newPassword) return;

//     try {
//       const res = await fetch("http://127.0.0.1:8000/api/attendance/admin-reset-password/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           employee_id: selectedEmp.employee_id,
//           email: selectedEmp.email,
//           new_password: newPassword
//         }),
//       });

//       const data = await res.json();
//       alert(data.message);

//       setShowModal(false);
//       setNewPassword("");

//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow p-6 mt-6">

//       <h2 className="text-xl font-bold mb-4 text-gray-700">
//         Employees List
//       </h2>

//       <div className="overflow-x-auto">

//         <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">

//           <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
//             <tr>
//               <th className="p-3 border">Emp ID</th>
//               <th className="p-3 border">Name</th>
//               <th className="p-3 border">Email</th>
//               <th className="p-3 border">Phone</th>
//               <th className="p-3 border">Department</th>
//               <th className="p-3 border">Role</th>
//               <th className="p-3 border">Joining Date</th>
//               <th className="p-3 border">Status</th>
//               <th className="p-3 border">Action</th>
//             </tr>
//           </thead>

//           <tbody className="text-sm text-center">

//             {employees.length === 0 ? (
//               <tr>
//                 <td colSpan="9" className="p-4 text-gray-400">
//                   No Employees Found
//                 </td>
//               </tr>
//             ) : (
//               employees.map((item) => (
//                 <tr key={item.id} className="hover:bg-gray-50">

//                   <td className="p-3 border font-semibold text-blue-600">
//                     {item.employee_id}
//                   </td>

//                   <td className="p-3 border">{item.name}</td>

//                   <td className="p-3 border">{item.email}</td>

//                   <td className="p-3 border">{item.phone || "-"}</td>

//                   <td className="p-3 border">{item.department || "-"}</td>

//                   <td className="p-3 border">{item.role || "-"}</td>

//                   <td className="p-3 border">{item.date_of_joining || "-"}</td>

//                   <td className="p-3 border text-green-600 font-semibold">
//                     Active
//                   </td>

//                   <td className="p-3 border">
//                     <button
//                       onClick={() => openModal(item)}
//                       className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow"
//                     >
//                       Reset
//                     </button>
//                   </td>

//                 </tr>
//               ))
//             )}

//           </tbody>

//         </table>

//       </div>

//       {/* 🔥 MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

//           <div className="bg-white p-6 rounded-xl w-80 shadow-lg">

//             <h3 className="text-lg font-bold mb-4 text-center">
//               Reset Password
//             </h3>

//             <p className="text-sm mb-2 text-gray-600 text-center">
//               {selectedEmp?.name}
//             </p>

//             {/* ✅ PASSWORD INPUT WITH EYE */}
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter new password"
//                 className="border p-2 w-full rounded mb-4 pr-10"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//               />

//               <span
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-3 cursor-pointer"
//               >
//                 {showPassword ? "🙈" : "👁️"}
//               </span>
//             </div>

//             <div className="flex justify-between">

//               <button
//                 onClick={() => setShowModal(false)}
//                 className="bg-gray-400 text-white px-3 py-1 rounded"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={handleReset}
//                 className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
//               >
//                 Update
//               </button>

//             </div>

//           </div>

//         </div>
//       )}

//     </div>
//   );
// }



// import { useEffect, useState } from "react";
// import { Eye, EyeOff } from "lucide-react"; // ✅ added
 
// export default function EmployeesList() {
 
//   const [employees, setEmployees] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedEmp, setSelectedEmp] = useState(null);
//   const [newPassword, setNewPassword] = "";
 
//   // ✅ PASSWORD TOGGLE STATE
//   const [showPassword, setShowPassword] = useState(false);
 
//   useEffect(() => {
//     fetch("http://127.0.0.1:8000/api/app1/employees/")
//       .then(res => res.json())
//       .then(data => setEmployees(data))
//       .catch(err => console.log(err));
//   }, []);
 
//   const openModal = (emp) => {
//     setSelectedEmp(emp);
//     setShowModal(true);
//     setNewPassword("");
//     setShowPassword(false);
//   };
 
//   const handleReset = async () => {
//     if (!newPassword) return;
 
//     try {
//       const res = await fetch(
//         "http://127.0.0.1:8000/api/attendance/admin-reset-password/",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             employee_id: selectedEmp.employee_id,
//             email: selectedEmp.email,
//             new_password: newPassword
//           }),
//         }
//       );
 
//       const data = await res.json();
//       alert(data.message);
 
//       setShowModal(false);
//       setNewPassword("");
 
//     } catch (error) {
//       console.log(error);
//     }
//   };
 
//   return (
// <div className="bg-white rounded-2xl shadow p-6 mt-6">
 
//       <h2 className="text-xl font-bold mb-4 text-gray-700">
//         Employees List
// </h2>
 
//       <div className="overflow-x-auto">
 
//         <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
 
//           <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
// <tr>
// <th className="p-3 border">Emp ID</th>
// <th className="p-3 border">Name</th>
// <th className="p-3 border">Email</th>
// <th className="p-3 border">Phone</th>
// <th className="p-3 border">Department</th>
// <th className="p-3 border">Role</th>
// <th className="p-3 border">Joining Date</th>
// <th className="p-3 border">Status</th>
// <th className="p-3 border">Action</th>
// </tr>
// </thead>
 
//           <tbody className="text-sm text-center">
 
//             {employees.length === 0 ? (
// <tr>
// <td colSpan="9" className="p-4 text-gray-400">
//                   No Employees Found
// </td>
// </tr>
//             ) : (
//               employees.map((item) => (
// <tr key={item.id} className="hover:bg-gray-50">
 
//                   <td className="p-3 border font-semibold text-blue-600">
//                     {item.employee_id}
// </td>
 
//                   <td className="p-3 border">{item.name}</td>
 
//                   <td className="p-3 border">{item.email}</td>
 
//                   <td className="p-3 border">{item.phone || "-"}</td>
 
//                   <td className="p-3 border">{item.department || "-"}</td>
 
//                   <td className="p-3 border">{item.role || "-"}</td>
 
//                   <td className="p-3 border">{item.date_of_joining || "-"}</td>
 
//                   <td className="p-3 border text-green-600 font-semibold">
//                     Active
// </td>
 
//                   <td className="p-3 border">
// <button
//                       onClick={() => openModal(item)}
//                       className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow"
// >
//                       Reset
// </button>
// </td>
 
//                 </tr>
//               ))
//             )}
 
//           </tbody>
 
//         </table>
 
//       </div>
 
//       {/* 🔥 MODAL */}
//       {showModal && (
// <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
 
//           <div className="bg-white p-6 rounded-xl w-80 shadow-lg">
 
//             <h3 className="text-lg font-bold mb-4 text-center">
//               Reset Password
// </h3>
 
//             <p className="text-sm mb-2 text-gray-600 text-center">
//               {selectedEmp?.name}
// </p>
 
//             {/* ✅ PASSWORD INPUT WITH EYE ICON */}
// <div className="relative mb-4">
 
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter new password"
//                 className="border p-2 w-full rounded pr-10"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//               />
 
//               <span
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
// >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
// </span>
 
//             </div>
 
//             <div className="flex justify-between">
 
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="bg-gray-400 text-white px-3 py-1 rounded"
// >
//                 Cancel
// </button>
 
//               <button
//                 onClick={handleReset}
//                 className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
// >
//                 Update
// </button>
 
//             </div>
 
//           </div>
 
//         </div>
//       )}
 
//     </div>
//   );
// }


// import { useEffect, useState } from "react";
// import { Eye, EyeOff } from "lucide-react";

// export default function EmployeesList() {

//   const [employees, setEmployees] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedEmp, setSelectedEmp] = useState(null);
//   const [newPassword, setNewPassword] = useState("");

//   // 👁️ toggle
//   const [showPassword, setShowPassword] = useState(false);

//   useEffect(() => {
//     fetch("http://127.0.0.1:8000/api/app1/employees/")
//       .then(res => res.json())
//       .then(data => setEmployees(data))
//       .catch(err => console.log(err));
//   }, []);

//   const openModal = (emp) => {
//     setSelectedEmp(emp);
//     setShowModal(true);
//     setNewPassword("");
//     setShowPassword(false);
//   };

//   const handleReset = async () => {
//     if (!newPassword) return;

//     try {
//       const res = await fetch(
//         "http://127.0.0.1:8000/api/attendance/admin-reset-password/",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             employee_id: selectedEmp.employee_id,
//             email: selectedEmp.email,
//             new_password: newPassword
//           }),
//         }
//       );

//       const data = await res.json();
//       alert(data.message);

//       setShowModal(false);
//       setNewPassword("");

//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow p-6 mt-6">

//       <h2 className="text-xl font-bold mb-4 text-gray-700">
//         Employees List
//       </h2>

//       <div className="overflow-x-auto">

//         <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">

//           {/* HEADER */}
//           <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
//             <tr>
//               <th className="p-3 border">Emp ID</th>
//               <th className="p-3 border">Name</th>
//               <th className="p-3 border">Email</th>
//               <th className="p-3 border">Phone</th>
//               <th className="p-3 border">Department</th>
//               <th className="p-3 border">Role</th>
//               <th className="p-3 border">Joining Date</th>
//               <th className="p-3 border">Status</th>
//               <th className="p-3 border">Action</th>
//             </tr>
//           </thead>

//           {/* BODY */}
//           <tbody className="text-sm text-center">

//             {employees.length === 0 ? (
//               <tr>
//                 <td colSpan="9" className="p-4 text-gray-400">
//                   No Employees Found
//                 </td>
//               </tr>
//             ) : (
//               employees.map((item) => (
//                 <tr key={item.id} className="hover:bg-gray-50">

//                   <td className="p-3 border font-semibold text-blue-600">
//                     {item.employee_id}
//                   </td>

//                   <td className="p-3 border">{item.name}</td>

//                   <td className="p-3 border">{item.email}</td>

//                   <td className="p-3 border">{item.phone || "-"}</td>

//                   <td className="p-3 border">{item.department || "-"}</td>

//                   <td className="p-3 border">{item.role || "-"}</td>

//                   <td className="p-3 border">{item.date_of_joining || "-"}</td>

//                   <td className="p-3 border text-green-600 font-semibold">
//                     Active
//                   </td>

//                   <td className="p-3 border">
//                     <button
//                       onClick={() => openModal(item)}
//                       className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow"
//                     >
//                       Reset
//                     </button>
//                   </td>

//                 </tr>
//               ))
//             )}

//           </tbody>

//         </table>

//       </div>

//       {/* 🔥 MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

//           <div className="bg-white p-6 rounded-xl w-80 shadow-lg">

//             <h3 className="text-lg font-bold mb-4 text-center">
//               Reset Password
//             </h3>

//             <p className="text-sm mb-2 text-gray-600 text-center">
//               {selectedEmp?.name}
//             </p>

//             {/* ✅ PASSWORD FIELD WITH EYE INSIDE */}
            
//             <div className="relative mb-4">

//   <input
//     type={showPassword ? "text" : "password"}
//     placeholder="Enter new password"
//     className="border p-2 w-full rounded pr-12"
//     value={newPassword}
//     onChange={(e) => setNewPassword(e.target.value)}
//   />

//   <span
//     onClick={() => setShowPassword(!showPassword)}
//     className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-black"
//   >
//     {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//   </span>

// </div>

//             <div className="flex justify-between">

//               <button
//                 onClick={() => setShowModal(false)}
//                 className="bg-gray-400 text-white px-3 py-1 rounded"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={handleReset}
//                 className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
//               >
//                 Update
//               </button>

//             </div>

//           </div>

//         </div>
//       )}

//     </div>
//   );
// }




// import { useEffect, useState } from "react";
// import { Eye, EyeOff } from "lucide-react";

// export default function EmployeesList() {

//   const [employees, setEmployees] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedEmp, setSelectedEmp] = useState(null);
//   const [newPassword, setNewPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   // ✅ SPLIT DATA
//   const activeEmployees = employees.filter(emp => emp.is_active);
//   const exitedEmployees = employees.filter(emp => !emp.is_active);

//   // ✅ FETCH DATA
//   useEffect(() => {
//     fetch("http://127.0.0.1:8000/api/app1/employees/")
//       .then(res => res.json())
//       .then(data => setEmployees(data))
//       .catch(err => console.log(err));
//   }, []);

//   // ✅ OPEN MODAL
//   const openModal = (emp) => {
//     setSelectedEmp(emp);
//     setShowModal(true);
//     setNewPassword("");
//     setShowPassword(false);
//   };

//   // ✅ RESET PASSWORD
//   const handleReset = async () => {
//     if (!newPassword) return;

//     try {
//       const res = await fetch(
//         "http://127.0.0.1:8000/api/attendance/admin-reset-password/",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             employee_id: selectedEmp.employee_id,
//             email: selectedEmp.email,
//             new_password: newPassword
//           }),
//         }
//       );

//       const data = await res.json();
//       alert(data.message);

//       setShowModal(false);
//       setNewPassword("");

//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // ✅ EXIT EMPLOYEE
//   const handleExit = async (id) => {
//     await fetch(`http://127.0.0.1:8000/api/employees/${id}/exit/`, {
//       method: "PATCH",
//     });

//     // 🔥 update UI
//     setEmployees(prev =>
//       prev.map(emp =>
//         emp.id === id ? { ...emp, is_active: false } : emp
//       )
//     );
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow p-6 mt-6">

//       {/* 🔹 ACTIVE EMPLOYEES */}
//       <h2 className="text-xl font-bold mb-4 text-green-600">
//         Active Employees
//       </h2>

//       <div className="overflow-x-auto">
//         <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">

//           <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
//             <tr>
//               <th className="p-3 border">Emp ID</th>
//               <th className="p-3 border">Name</th>
//               <th className="p-3 border">Email</th>
//               <th className="p-3 border">Phone</th>
//               <th className="p-3 border">Department</th>
//               <th className="p-3 border">Role</th>
//               <th className="p-3 border">Joining Date</th>
//               <th className="p-3 border">Status</th>
//               <th className="p-3 border">Action</th>
//             </tr>
//           </thead>

//           <tbody className="text-sm text-center">
//             {activeEmployees.length === 0 ? (
//               <tr>
//                 <td colSpan="9" className="p-4 text-gray-400">
//                   No Active Employees
//                 </td>
//               </tr>
//             ) : (
//               activeEmployees.map((item) => (
//                 <tr key={item.id} className="hover:bg-gray-50">

//                   <td className="p-3 border font-semibold text-blue-600">
//                     {item.employee_id}
//                   </td>

//                   <td className="p-3 border">{item.name}</td>
//                   <td className="p-3 border">{item.email}</td>
//                   <td className="p-3 border">{item.phone || "-"}</td>
//                   <td className="p-3 border">{item.department || "-"}</td>
//                   <td className="p-3 border">{item.role || "-"}</td>
//                   <td className="p-3 border">{item.date_of_joining || "-"}</td>

//                   <td className="p-3 border text-green-600 font-semibold">
//                     Active
//                   </td>

//                   <td className="p-3 border">
//                     <button
//                       onClick={() => openModal(item)}
//                       className="bg-blue-500 text-white px-3 py-1 rounded"
//                     >
//                       Reset
//                     </button>

//                     <button
//                       onClick={() => handleExit(item.id)}
//                       className="bg-yellow-500 text-white px-3 py-1 rounded ml-2"
//                     >
//                       Exit
//                     </button>
//                   </td>

//                 </tr>
//               ))
//             )}
//           </tbody>

//         </table>
//       </div>

//       {/* 🔻 EXITED EMPLOYEES */}
//       <h2 className="text-xl font-bold mt-8 mb-4 text-red-600">
//         Exited Employees
//       </h2>

//       <div className="overflow-x-auto">
//         <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">

//           <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
//             <tr>
//               <th className="p-3 border">Emp ID</th>
//               <th className="p-3 border">Name</th>
//               <th className="p-3 border">Email</th>
//               <th className="p-3 border">Phone</th>
//               <th className="p-3 border">Department</th>
//               <th className="p-3 border">Role</th>
//               <th className="p-3 border">Joining Date</th>
//               <th className="p-3 border">Status</th>
//             </tr>
//           </thead>

//           <tbody className="text-sm text-center">
//             {exitedEmployees.length === 0 ? (
//               <tr>
//                 <td colSpan="8" className="p-4 text-gray-400">
//                   No Exited Employees
//                 </td>
//               </tr>
//             ) : (
//               exitedEmployees.map((item) => (
//                 <tr key={item.id} className="hover:bg-gray-50">

//                   <td className="p-3 border">{item.employee_id}</td>
//                   <td className="p-3 border">{item.name}</td>
//                   <td className="p-3 border">{item.email}</td>
//                   <td className="p-3 border">{item.phone || "-"}</td>
//                   <td className="p-3 border">{item.department || "-"}</td>
//                   <td className="p-3 border">{item.role || "-"}</td>
//                   <td className="p-3 border">{item.date_of_joining || "-"}</td>

//                   <td className="p-3 border text-red-600 font-semibold">
//                     Exited
//                   </td>

//                 </tr>
//               ))
//             )}
//           </tbody>

//         </table>
//       </div>

//       {/* 🔥 MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

//           <div className="bg-white p-6 rounded-xl w-80 shadow-lg">

//             <h3 className="text-lg font-bold mb-4 text-center">
//               Reset Password
//             </h3>

//             <p className="text-sm mb-2 text-gray-600 text-center">
//               {selectedEmp?.name}
//             </p>

//             <div className="relative mb-4">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter new password"
//                 className="border p-2 w-full rounded pr-12"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//               />

//               <span
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
//               >
//                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </span>
//             </div>

//             <div className="flex justify-between">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="bg-gray-400 text-white px-3 py-1 rounded"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={handleReset}
//                 className="bg-green-500 text-white px-3 py-1 rounded"
//               >
//                 Update
//               </button>
//             </div>

//           </div>
//         </div>
//       )}

//     </div>
//   );
// }


// import { useEffect, useState } from "react";
// import { Eye, EyeOff } from "lucide-react";

// export default function EmployeesList() {

//   const [employees, setEmployees] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedEmp, setSelectedEmp] = useState(null);
//   const [newPassword, setNewPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   // ✅ SPLIT DATA
//   const activeEmployees = employees.filter(emp => emp.is_active === true);
//   const exitedEmployees = employees.filter(emp => emp.is_active === false);

//   // ✅ FETCH DATA
//   const fetchEmployees = () => {
//     fetch("http://127.0.0.1:8000/api/app1/employees/")
//       .then(res => res.json())
//       .then(data => setEmployees(data))
//       .catch(err => console.log(err));
//   };

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   // ✅ OPEN MODAL
//   const openModal = (emp) => {
//     setSelectedEmp(emp);
//     setShowModal(true);
//     setNewPassword("");
//     setShowPassword(false);
//   };

//   // ✅ RESET PASSWORD
//   const handleReset = async () => {
//     if (!newPassword) return;

//     try {
//       const res = await fetch(
//         "http://127.0.0.1:8000/api/attendance/admin-reset-password/",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             employee_id: selectedEmp.employee_id,
//             email: selectedEmp.email,
//             new_password: newPassword
//           }),
//         }
//       );

//       const data = await res.json();
//       alert(data.message);

//       setShowModal(false);
//       setNewPassword("");

//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // ✅ EXIT EMPLOYEE
//   const handleExit = async (id) => {

//     const confirmExit = window.confirm("Are you sure you want to exit?");
//     if (!confirmExit) return;

//     await fetch(`http://127.0.0.1:8000/api/app1/employees/${id}/exit/`, {
//       method: "PATCH",
//     });

//     // 🔥 RELOAD DATA (IMPORTANT)
//     fetchEmployees();

//     alert("Employee exited successfully");
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow p-6 mt-6">

//       {/* 🔹 ACTIVE EMPLOYEES */}
//       <h2 className="text-xl font-bold mb-4 text-green-600">
//         Active Employees
//       </h2>

//       <div className="overflow-x-auto">
//         <table className="min-w-full border border-gray-200 rounded-lg">

//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-3 border">Emp ID</th>
//               <th className="p-3 border">Name</th>
//               <th className="p-3 border">Email</th>
//               <th className="p-3 border">Phone</th>
//               <th className="p-3 border">Department</th>
//               <th className="p-3 border">Role</th>
//               <th className="p-3 border">Joining Date</th>
//               <th className="p-3 border">Status</th>
//               <th className="p-3 border">Action</th>
//             </tr>
//           </thead>

//           <tbody className="text-center">
//             {activeEmployees.map((item) => (
//               <tr key={item.id}>

//                 <td className="p-3 border">{item.employee_id}</td>
//                 <td className="p-3 border">{item.name}</td>
//                 <td className="p-3 border">{item.email}</td>
//                 <td className="p-3 border">{item.phone}</td>
//                 <td className="p-3 border">{item.department}</td>
//                 <td className="p-3 border">{item.role}</td>
//                 <td className="p-3 border">{item.date_of_joining}</td>

//                 <td className="p-3 border text-green-600 font-bold">
//                   Active
//                 </td>

//                 <td className="p-3 border">

//                   {/* RESET */}
//                   <button
//                     onClick={() => openModal(item)}
//                     className="bg-blue-500 text-white px-3 py-1 rounded"
//                   >
//                     Reset
//                   </button>

//                   {/* EXIT */}
//                   <button
//                     onClick={() => handleExit(item.id)}
//                     className="bg-yellow-500 text-white px-3 py-1 rounded ml-2"
//                   >
//                     Exit
//                   </button>

//                 </td>

//               </tr>
//             ))}
//           </tbody>

//         </table>
//       </div>

//       {/* 🔻 EXITED EMPLOYEES */}
//       <h2 className="text-xl font-bold mt-8 mb-4 text-red-600">
//         Exited Employees
//       </h2>

//       <table className="min-w-full border">
//         <tbody>
//           {exitedEmployees.map((item) => (
//             <tr key={item.id}>
//               <td className="p-3 border">{item.employee_id}</td>
//               <td className="p-3 border">{item.name}</td>
//               <td className="p-3 border text-red-600 font-bold">
//                 Exited
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* 🔥 MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40">
//           <div className="bg-white p-6 rounded">

//             <h3>Reset Password</h3>

//             <input
//               type={showPassword ? "text" : "password"}
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               placeholder="Enter new password"
//             />

//             <span onClick={() => setShowPassword(!showPassword)}>
//               {showPassword ? <EyeOff /> : <Eye />}
//             </span>

//             <br />

//             <button onClick={handleReset}>Update</button>
//             <button onClick={() => setShowModal(false)}>Cancel</button>

//           </div>
//         </div>
//       )}

//     </div>
//   );
// }





import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function EmployeesList() {

  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ✅ SPLIT DATA
  const activeEmployees = employees.filter(emp => emp.is_active === true);
  const exitedEmployees = employees.filter(emp => emp.is_active === false);

  // ✅ FETCH DATA
  const fetchEmployees = () => {
    fetch("http://127.0.0.1:8000/api/app1/employees/", {
  headers: {
    "Authorization": `Bearer ${localStorage.getItem("petty-cash-access")}`
  }
})
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ✅ OPEN MODAL
  const openModal = (emp) => {
    setSelectedEmp(emp);
    setShowModal(true);
    setNewPassword("");
    setShowPassword(false);
  };

  // ✅ RESET PASSWORD
  const handleReset = async () => {
    if (!newPassword) return;

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/attendance/admin-reset-password/",
        {
          method: "POST",
          headers: {
          "Authorization": `Bearer ${localStorage.getItem("petty-cash-access")}`,
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
      alert(data.message);

      setShowModal(false);
      setNewPassword("");

    } catch (error) {
      console.log(error);
    }
  };

  // ✅ EXIT EMPLOYEE
  const handleExit = async (id) => {

    const confirmExit = window.confirm("Are you sure you want to exit?");
    if (!confirmExit) return;

   await fetch(`http://127.0.0.1:8000/api/app1/employees/${id}/exit/`, {
  method: "PATCH",
  headers: {
    "Authorization": `Bearer ${localStorage.getItem("petty-cash-access")}`,
    "Content-Type": "application/json"
  }
});

    // 🔥 RELOAD DATA (IMPORTANT)
    fetchEmployees();

    alert("Employee exited successfully");
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 mt-6">

      {/* 🔹 ACTIVE EMPLOYEES */}
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

                  {/* RESET */}
                  <button
                    onClick={() => openModal(item)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Reset
                  </button>

                  {/* EXIT */}
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

      {/* 🔻 EXITED EMPLOYEES */}
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

      {/* 🔥 MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded">

            <h3>Reset Password</h3>

            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />

            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff /> : <Eye />}
            </span>

            <br />

            <button onClick={handleReset}>Update</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>

          </div>
        </div>
      )}

    </div>
  );
}