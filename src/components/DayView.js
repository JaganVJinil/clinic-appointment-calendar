import React, { useState } from "react";
import AppointmentForm from "./AppointmentForm";
import "./DayView.css";

const DayView = ({ appointments, onSave }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);

  const appointmentsForDay = appointments.filter(
    (appt) =>
      new Date(appt.date).toDateString() === selectedDate.toDateString()
  );

  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  const handleDelete = (apptToDelete) => {
    const updatedAppointments = appointments.filter(
      (appt) => !(appt.date === apptToDelete.date &&
                  appt.time === apptToDelete.time &&
                  appt.patient === apptToDelete.patient &&
                  appt.doctor === apptToDelete.doctor)
    );
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments));
    window.location.reload(); 
  };

  return (
    <div className="dayview-container">
      <h2>Day View</h2>
      
      <input
        type="date"
        value={selectedDate.toISOString().split("T")[0]}
        onChange={handleDateChange}
        className="date-picker"
      />

      <h3>{selectedDate.toDateString()}</h3>

      {appointmentsForDay.length > 0 ? (
        <ul className="appointment-list">
          {appointmentsForDay.map((appt, index) => (
            <li key={index} className="appointment-item">
              <strong>{appt.time}</strong> - {appt.patient} with {appt.doctor}
              <button
                className="delete-btn"
                onClick={() => handleDelete(appt)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No appointments for this day.</p>
      )}

      <button onClick={() => setShowForm(true)} className="add-btn">
        + Add Appointment
      </button>

      {showForm && (
        <AppointmentForm
          date={selectedDate}
          onSave={(newAppt) => {
            onSave(newAppt);
            setShowForm(false);
          }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default DayView;
