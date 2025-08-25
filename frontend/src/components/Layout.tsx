import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-green-100"> {/* 👈 AQUÍ el fondo */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <nav className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-6">
          <NavLink to="/" className="font-bold text-xl">CookClique</NavLink>
          <div className="ml-auto flex gap-4">
            <NavLink to="/" className="hover:underline">Feed</NavLink>
            <NavLink to="/search" className="hover:underline">Buscar</NavLink>
            <NavLink to="/edamam" className="hover:underline">Edamam</NavLink>
            <NavLink to="/profile/demo" className="hover:underline">Perfil</NavLink>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
