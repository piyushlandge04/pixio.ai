import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { PageTransition } from "./components/PageTransition";
import { lazy, Suspense } from "react";

import Landing from "./pages/Landing";
import Generate from "./pages/Generate";
import History from "./pages/History";
import About from "./pages/About";
import Auth from "./pages/Auth";

// Secondary route components
const Profile = lazy(() => import("./pages/Profile"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Minimal loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <Suspense fallback={<PageLoader />}>
      <PageTransition key={location.pathname}>
        <Routes location={location}>
          {/* Landing Page: / */}
          <Route path="/" element={<Landing />} />
          
          {/* Flyer Generator: /generate */}
          <Route path="/generate" element={<Generate />} />
          
          {/* Generation History: /history */}
          <Route path="/history" element={<History />} />
          
          {/* User Profile: /profile */}
          <Route path="/profile" element={<Profile />} />
          
          {/* Authentication: /auth */}
          <Route path="/auth" element={<Auth />} />
          
          {/* Reset Password: /reset-password */}
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* About: /about */}
          <Route path="/about" element={<About />} />
          
          {/* Admin Dashboard: /admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* Not Found: * */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
    </Suspense>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
