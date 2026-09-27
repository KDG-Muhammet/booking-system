function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8">
      <div>
        <p className="text-sm text-gray-500">
          Booking System
        </p>
      </div>

      <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
          MM
        </div>

        <span>Business Owner</span>

        <span className="text-gray-400">⌄</span>
      </button>
    </header>
  );
}

export default Topbar;