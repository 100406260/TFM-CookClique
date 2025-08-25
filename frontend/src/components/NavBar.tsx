import { NavLink } from "react-router-dom";

export default function NavBar() {
  const base = "px-3 py-2 rounded-xl text-sm font-medium transition-colors";
  const active = "bg-gray-900 text-white";
  const inactive = "text-gray-600 hover:text-gray-900 hover:bg-gray-100";

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <nav className="mx-auto max-w-3xl px-4">
        <div className="flex items-center justify-between py-3">
          <NavLink to="/" className="text-xl font-black tracking-tight">
            CookClique
          </NavLink>
          <div className="flex items-center gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${base} ${isActive ? active : inactive}`
              }
              end
            >
              Feed
            </NavLink>
            <NavLink
              to="/profile/11111111-1111-1111-1111-111111111111"
              className={({ isActive }) =>
                `${base} ${isActive ? active : inactive}`
              }
            >
              Perfil
            </NavLink>
            <NavLink
              to="/search"
              className={({ isActive }) =>
                `${base} ${isActive ? active : inactive}`
              }
            >
              Buscar
            </NavLink>
            <NavLink
              to="/edamam"
              className={({ isActive }) =>
                `${base} ${isActive ? active : inactive}`
              }
            >
              Edamam
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
}
