import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainRoutes from "./routes/MainRoutes";
import { Toaster } from 'react-hot-toast';

const App = () => {
  const location = useLocation();

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAccountRoute = location.pathname.startsWith("/my-account");

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {!isAdminRoute && <Header />}
      <Box sx={{ pt: !isAdminRoute ? { xs: '60px', md: '70px' } : 0 }}>
        <MainRoutes />
      </Box>
      {!isAdminRoute && !isAccountRoute && <Footer />}
    </>
  );
};

export default App;
