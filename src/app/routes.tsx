import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { ResumeBuilder } from "./pages/ResumeBuilder";
import { SkillAnalysis } from "./pages/SkillAnalysis";
import { JobMatching } from "./pages/JobMatching";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "resume",
        element: (
          <ProtectedRoute>
            <ResumeBuilder />
          </ProtectedRoute>
        ),
      },
      {
        path: "skills",
        element: (
          <ProtectedRoute>
            <SkillAnalysis />
          </ProtectedRoute>
        ),
      },
      {
        path: "jobs",
        element: (
          <ProtectedRoute>
            <JobMatching />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
