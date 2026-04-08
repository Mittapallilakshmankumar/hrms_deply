import { Search, Bell } from "lucide-react";

export default function Navbar() {
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm px-6 py-4 flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-800">HR Dashboard</h2>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border rounded-xl outline-none"
          />
        </div>

        <div className="relative">
          <Bell size={22} className="text-gray-700" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
            3
          </span>
        </div>
      </div>
    </div>
  );
}


