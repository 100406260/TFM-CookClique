import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import FeedPage from "./pages/FeedPage";
import RecipePage from "./pages/RecipeDetailPage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchLocalPage";
import EdamamPage from "./pages/SearchEdamamPage";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <FeedPage /> },
      { path: "recipe/:id", element: <RecipePage/> }, //TODO: cambiar el userID
      { path: "profile/:username", element: <ProfilePage /> },
      { path: "search", element: <SearchPage /> },
      { path: "edamam", element: <EdamamPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
