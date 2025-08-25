import { Outlet, Link, NavLink } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-white border-b">
        <nav className="mx-auto max-w-5xl px-4 h-14 flex items-center gap-6">
          <Link to="/" className="font-bold">CookClique</Link>
          <NavLink to="/" className={({isActive}) => isActive ? "text-blue-600" : "text-gray-600"}>
            Feed
          </NavLink>
          <NavLink to="/ping" className={({isActive}) => isActive ? "text-blue-600" : "text-gray-600"}>
            Ping
          </NavLink>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 space-y-4">
        {/* Banda visible para comprobar Tailwind */}
        <div className="h-2 w-full bg-emerald-500 rounded"></div>
        <Outlet />
      </main>
    </div>
  );
}
