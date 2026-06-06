import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import { RouterProvider } from "react-router-dom";
import AppRoutes from "@routes/AppRoutes";
import { PracticeSentencesProvider } from "@contexts/PracticeSentencesProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PracticeSentencesProvider>
      <RouterProvider router={AppRoutes()} />
    </PracticeSentencesProvider>
  </React.StrictMode>,
);
