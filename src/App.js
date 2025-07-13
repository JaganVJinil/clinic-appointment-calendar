import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import CalendarView from "./components/CalendarView";
import DayView from "./components/DayView";

// Wrapper for DayView to handle appointment state
const DayViewWrapper = () => {
  const [appointments, setAppointments] = useState(
    JSON.parse(localStorage.getItem("appointments") || "[]")
  );

  const handleSave = (newAppt) => {
    const updated = [...appointments, newAppt];
    setAppointments(updated);
    localStorage.setItem("appointments", JSON.stringify(updated));
  };

  return <DayView appointments={appointments} onSave={handleSave} />;
};

// AppContent to use hooks like useLocation
const AppContent = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Apply dark mode only if not on login page
    if (location.pathname !== "/") {
      document.body.className = darkMode ? "dark-mode" : "";
    } else {
      document.body.className = ""; // Always light on login
    }
  }, [darkMode, location.pathname]);

  return (
    <>
      {location.pathname !== "/" && (
        <div style={{ textAlign: "center", padding: "10px" }}>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/calendar"
          element={isMobile ? <DayViewWrapper /> : <CalendarView />}
        />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
