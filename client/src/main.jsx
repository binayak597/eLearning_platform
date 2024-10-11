import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { UserContextProvider } from "./context/UserContext";
import { Toaster } from "react-hot-toast";
import { CourseContextProvider } from "./context/CourseContext.jsx";

export const server = "http://localhost:8080";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserContextProvider>
      <CourseContextProvider>
        <App />
        <Toaster />
      </CourseContextProvider>
    </UserContextProvider>
  </StrictMode>
);
