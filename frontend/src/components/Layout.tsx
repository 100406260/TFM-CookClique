import { Outlet, Link, NavLink } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 bg-white border-b">
        <nav className="mx-auto max-w-5xl px-4 h-14 flex items-center gap-6">
          <Link to="/" className="font-bold">CookClique</Link>
          <NavLink to="/" className={({isActive}) => isActive ? "text-blue-600" : "text-gray-600"}>
            Feed
          </NavLink>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {/* PROBADOR visual: si Tailwind no funciona, no verás el bloque verde */}
        <div className="mb-4 h-2 w-full bg-green-500 rounded"></div>
        <Outlet />
      </main>
    </div>
  );
}
