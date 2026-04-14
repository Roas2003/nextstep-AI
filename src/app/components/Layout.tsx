import { Outlet } from "react-router";
import { Navigation } from "./Navigation";

export function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50" dir="rtl">
      <Navigation />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
