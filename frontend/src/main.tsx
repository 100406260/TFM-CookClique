import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

function Ping() {
  return (
    <div className="p-4 rounded-lg bg-white shadow">
      <h1 className="text-2xl font-bold">App OK</h1>
      <p className="text-gray-600">Si ves esto, React y Tailwind están cargando.</p>
    </div>
  );
}

import Layout from "./components/Layout";
import FeedPage from "./pages/FeedPage";
import RecipePage from "./pages/RecipeDetailPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <FeedPage /> },
      { path: "recipe/:id", element: <RecipePage /> },
      // Ruta de fallback para probar que se ve algo
      { path: "ping", element: <Ping /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
