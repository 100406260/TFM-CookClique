import { useParams } from "react-router-dom";

export default function ProfilePage() {
  const { id } = useParams();
  // Aquí puedes hacer fetch al backend /users/:id y /recipes?user_id=...
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Perfil</h1>
        <p className="text-gray-600">Usuario: {id}</p>
      </div>
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-xl font-semibold">Recetas del usuario</h2>
        <p className="text-gray-600">Próximamente…</p>
      </div>
    </div>
  );
}
