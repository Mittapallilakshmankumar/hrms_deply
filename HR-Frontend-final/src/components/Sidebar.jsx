// import {
//   LayoutDashboard,
//   UserPlus,
//   FileText,
//   ClipboardCheck,
//   ClipboardList,
//   LogOut,
//   Upload
// } from "lucide-react";
 
// import { Link, useLocation } from "react-router-dom";
 
// export default function Sidebar() {
//   const location = useLocation();
 
//   // ✅ get role
//   const role = (localStorage.getItem("role") || "").toLowerCase().trim();
 
//   // ✅ menu
//   const menu = [
//     { name: "Home", path: "/home", icon: LayoutDashboard },
//     { name: "Onboarding", path: "/home/onboarding", icon: UserPlus },
//     { name: "Leave", path: "/home/leave", icon: FileText },
//     { name: "Attendance", path: "/home/attendance", icon: ClipboardCheck },
 
//    { name: "Upload", path: "/home/upload", icon: Upload },
 
 
//     // ✅ ADMIN + MANAGEMENT + HR ONLY
//     ...(["admin", "management", "hr"].includes(role)
//       ? [
         
//           {
//             name: "Admin Dashboard",
//             path: "/home/leaveapprove",
//             icon: ClipboardList,
//           },
//         ]
//       : []),
//   ];
 
//   const handleLogout = () => {
//     localStorage.clear();
//     sessionStorage.clear();
//     window.location.href = "/";
//   };
 
//   return (
//     <div className="w-24 min-h-screen bg-[#082a57] text-white flex flex-col items-center py-6 justify-between">
 
//       {/* TOP SECTION */}
//       <div>
//         <h1 className="text-lg font-bold mb-10">HRMS</h1>
 
//         <div className="flex flex-col gap-8">
//           {menu.map((item) => {
//             const Icon = item.icon;
 
//             // ✅ better active check
//             const active = location.pathname.startsWith(item.path);
 
//             return (
//               <Link
//                 key={item.name}
//                 to={item.path}
//                 title={item.name}   // tooltip
//                 className="flex flex-col items-center text-xs"
//               >
//                 <div
//                   className={`p-3 rounded-xl transition-all duration-200 ${
//                     active
//                       ? "bg-white/20"
//                       : "hover:bg-white/10 text-gray-300"
//                   }`}
//                 >
//                   <Icon size={22} />
//                 </div>
//                 <span className="mt-2">{item.name}</span>
//               </Link>
//             );
//           })}
//         </div>
//       </div>
 
//       {/* LOGOUT */}
//       <div className="flex flex-col items-center text-xs cursor-pointer">
//         <div onClick={handleLogout} className="p-3 rounded-xl bg-red-500">
//           <LogOut size={22} />
//         </div>
//         <span className="mt-2">Logout</span>
//       </div>
 
//     </div>
//   );
// }
 
import {
  LayoutDashboard,
  UserPlus,
  FileText,
  ClipboardCheck,
  ClipboardList,
  LogOut,
  Upload
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {

  const location = useLocation();

  const role = (localStorage.getItem("role") || "").toLowerCase().trim();


  // ✅ menu items
  const menu = [
    { name: "Home", path: "/home", icon: LayoutDashboard },

    { name: "Onboarding", path: "/home/onboarding", icon: UserPlus },

    { name: "Leave", path: "/home/leave", icon: FileText },

    { name: "Attendance", path: "/home/attendance", icon: ClipboardCheck },

    { name: "Upload", path: "/home/upload", icon: Upload },

    // ADMIN / HR / MANAGEMENT
    ...(["admin", "management", "hr"].includes(role)
      ? [
          {
            name: "Admin Dashboard",
            path: "/home/leaveapprove",
            icon: ClipboardList,
          },
        ]
      : []),
  ];


  const handleLogout = () => {

    localStorage.clear();

    sessionStorage.clear();

    window.location.href = "/";

  };


  return (

    <div className="fixed top-0 left-0 h-screen w-24 bg-[#082a57] text-white flex flex-col items-center py-6 z-50">

      {/* LOGO */}
      <h1 className="text-lg font-bold mb-8">HRMS</h1>


      {/* MENU ITEMS */}
      <div className="flex flex-col gap-5">

        {menu.map((item) => {

          const Icon = item.icon;

          const active = location.pathname.startsWith(item.path);

          return (

            <Link
              key={item.name}
              to={item.path}
              title={item.name}
              className="flex flex-col items-center text-xs"
            >

              <div
                className={`p-3 rounded-xl transition-all duration-200 ${
                  active
                    ? "bg-white/20"
                    : "hover:bg-white/10 text-gray-300"
                }`}
              >
                <Icon size={22} />
              </div>

              <span className="mt-1">{item.name}</span>

            </Link>

          );

        })}


        {/* LOGOUT */}
        <div
          onClick={handleLogout}
          className="flex flex-col items-center text-xs cursor-pointer mt-3"
        >
          <div className="p-3 rounded-xl bg-red-500 hover:bg-red-600 transition">
            <LogOut size={22} />
          </div>

          <span className="mt-1">Logout</span>
        </div>

      </div>

    </div>

  );

}