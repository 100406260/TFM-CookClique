import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import FeedPage from "./pages/FeedPage"
import ProfilePage from "./pages/ProfilePage";
import SearchLocalPage from "./pages/SearchLocalPage";
import SearchEdamamPage from "./pages/SearchEdamamPage";
import RecipeDetail from "./components/RecipeCard";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<FeedPage />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="profile/:id" element={<ProfilePage />} />
        <Route path="search" element={<SearchLocalPage />} />
        <Route path="edamam" element={<SearchEdamamPage />} />
      </Route>
    </Routes>
  );
}
