import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Calendar.css";
import AppointmentForm from "./AppointmentForm";

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getStartDay = (year, month) => new Date(year, month, 1).getDay();

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const CalendarView = () => {
  const navigate = useNavigate();
  const today = new Date();

  // Redirect if no token (protect calendar route)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/calendar", { replace: true });
    }
  }, [navigate]);

  const [appointments, setAppointments] = useState(
    JSON.parse(localStorage.getItem("appointments") || "[]")
  );
  const [selectedDate, setSelectedDate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [showDayAppointments, setShowDayAppointments] = useState(false);
  const [filterPatient, setFilterPatient] = useState("");
  const [filterDoctor, setFilterDoctor] = useState("");

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const startDay = getStartDay(currentYear, currentMonth);

  const saveAppointment = (newAppt) => {
    const updated = [...appointments, newAppt];
    setAppointments(updated);
    localStorage.setItem("appointments", JSON.stringify(updated));
    setShowForm(false);
    setShowDayAppointments(false);
  };

  const deleteAppointment = (indexToDelete) => {
    const updated = appointments.filter((_, idx) => idx !== indexToDelete);
    setAppointments(updated);
    localStorage.setItem("appointments", JSON.stringify(updated));
  };

  const getAppointmentsForDate = (date) => {
    return appointments.filter(
      (appt) =>
        new Date(appt.date).toDateString() === date.toDateString() &&
        (!filterPatient || appt.patient === filterPatient) &&
        (!filterDoctor || appt.doctor === filterDoctor)
    );
  };

  const handleDayClick = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    setSelectedDate(date);
    setShowDayAppointments(true);
  };

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.replace("/"); 
  };

  const renderCalendarCells = () => {
    const cells = [];

    for (let i = 0; i < startDay; i++) {
      cells.push(<div key={`blank-${i}`} className="calendar-cell greyed" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const appts = getAppointmentsForDate(date);

      cells.push(
        <div
          key={day}
          className="calendar-cell"
          onClick={() => handleDayClick(day)}
        >
          <div className="day-number">{day}</div>
          <div className="appt-list">
            {appts.slice(0, 2).map((appt, index) => (
              <div key={index} className="appt-item">
                <span className="appt-time">{appt.time}</span>{" "}
                <span className="appt-name">{appt.patient}</span>
              </div>
            ))}
            {appts.length > 2 && (
              <div className="more-appts">+{appts.length - 2} more</div>
            )}
          </div>
        </div>
      );
    }

    const totalCells = startDay + daysInMonth;
    const paddingCells = 42 - totalCells;

    for (let i = 0; i < paddingCells; i++) {
      cells.push(<div key={`pad-${i}`} className="calendar-cell greyed" />);
    }

    return cells;
  };

  const uniquePatients = [...new Set(appointments.map((a) => a.patient))];
  const uniqueDoctors = [...new Set(appointments.map((a) => a.doctor))];

  return (
    <div
  className="calendar-container"
  style={{
    backgroundImage: 'url("/images/calendaredited.jpg")',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    minHeight: '100vh',
  }}
>

      {/* Filters */}
      <div className="filters" style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <select value={filterPatient} onChange={(e) => setFilterPatient(e.target.value)}>
          <option value="">All Patients</option>
          {uniquePatients.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select value={filterDoctor} onChange={(e) => setFilterDoctor(e.target.value)}>
          <option value="">All Doctors</option>
          {uniqueDoctors.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        {(filterPatient || filterDoctor) && (
          <button onClick={() => {
            setFilterPatient("");
            setFilterDoctor("");
          }}>Clear Filters</button>
        )}
      </div>

      {/* Calendar Header */}
      <div className="calendar-header">
        <button onClick={goToPrevMonth}>&lt;</button>
        <h2>{monthNames[currentMonth]} {currentYear}</h2>
        <button onClick={goToNextMonth}>&gt;</button>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {/* Day names */}
      <div className="calendar-days">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="calendar-day-name">{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">{renderCalendarCells()}</div>

      {/* Modal for Appointments */}
      {showDayAppointments && selectedDate && (
        <div className="modal-overlay">
          <div className="form-container">
            <h3>Appointments for {selectedDate.toDateString()}</h3>
            <ul className="appointment-list">
              {getAppointmentsForDate(selectedDate).map((appt, index) => (
                <li key={index} className="appointment-item">
                  <strong>{appt.time}</strong> - {appt.patient} with {appt.doctor}
                  <button
                    onClick={() =>
                      deleteAppointment(
                        appointments.findIndex(
                          (a) =>
                            a.date === appt.date &&
                            a.time === appt.time &&
                            a.patient === appt.patient
                        )
                      )
                    }
                    className="delete-btn"
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
            <div className="form-actions">
              <button onClick={() => setShowForm(true)}>+ Add</button>
              <button onClick={() => setShowDayAppointments(false)} className="cancel-btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Form Modal */}
      {showForm && selectedDate && (
        <AppointmentForm
          date={selectedDate}
          onSave={saveAppointment}
          onClose={() => {
            setShowForm(false);
            setShowDayAppointments(false);
          }}
        />
      )}
    </div>
  );
};

export default CalendarView;
