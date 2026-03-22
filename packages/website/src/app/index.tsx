import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { AppLayout } from "@/app/layout/AppLayout";
import { HomePage } from "@/pages/home/HomePage";
import { BookmarkletDetailPage } from "@/pages/bookmarklet-detail/BookmarkletDetailPage";
import { BuilderPage } from "@/pages/builder/BuilderPage";
import { TestPage } from "@/pages/test/TestPage";
import "@/app/index.css";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="builder" element={<BuilderPage />} />
            <Route path=":bookmarkletId" element={<BookmarkletDetailPage />} />
            <Route path=":bookmarkletId/test" element={<TestPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StrictMode>,
  );
}
