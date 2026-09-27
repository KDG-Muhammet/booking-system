import { NavLink } from "react-router-dom";

function Sidebar() {
  const navigation = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "▦",
    },
    {
      name: "Afspraken",
      path: "/appointments",
      icon: "◷",
    },
    {
      name: "Klanten",
      path: "/customers",
      icon: "♙",
    },
    {
      name: "Diensten",
      path: "/services",
      icon: "◆",
    },
    {
      name: "Instellingen",
      path: "/settings",
      icon: "⚙",
    },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <h1 className="text-xl font-bold text-gray-900">
          Booking<span className="text-blue-600">System</span>
        </h1>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-6">
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <span className="w-5 text-center">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
            MM
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">
              Business Owner
            </p>
            <p className="text-xs text-gray-500">
              Beheerder
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;