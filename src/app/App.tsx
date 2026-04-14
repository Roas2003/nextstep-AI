// Next Step AI - Career Assistant Application
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./context/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

// 🟢 أضفنا هدول
import { useEffect } from "react";
import { supabase } from "../supabase";

export default function App() {

  // 🟢 تجربة الاتصال + جلب البيانات
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("profile")
        .select("*");

      console.log("DATA:", data);
      console.log("ERROR:", error);
    };

    fetchData();
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster 
          position="top-center" 
          toastOptions={{
            duration: 3000,
            style: {
              direction: 'rtl',
            },
          }}
        />
      </AuthProvider>
    </ErrorBoundary>
  );
}