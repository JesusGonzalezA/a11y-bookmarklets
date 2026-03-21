import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { Layout } from "@/components/layout";
import { BookmarkletPage } from "@/pages/bookmarklet";
import { HomePage } from "@/pages/home";
import { TestPage } from "@/pages/test-page";
import "@/index.css";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path=":bookmarkletId" element={<BookmarkletPage />} />
            <Route path=":bookmarkletId/test" element={<TestPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StrictMode>,
  );
}
