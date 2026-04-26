import { BrowserRouter, Routes, Route } from "react-router-dom";
import BlogPage from "./pages/BlogPage";
import PostDetailPage from "./pages/PostDetailPage";
import CmsPage from "./pages/CmsPage";
import { Toasty } from "@cloudflare/kumo";

export default function App() {
  return (
    <BrowserRouter>
      <Toasty>
        <main>
          <Routes>
            <Route path="/" element={<BlogPage />} />
            <Route path="/post/:id" element={<PostDetailPage />} />
            <Route path="/cms" element={<CmsPage />} />
          </Routes>
        </main>
      </Toasty>
    </BrowserRouter>
  );
}
