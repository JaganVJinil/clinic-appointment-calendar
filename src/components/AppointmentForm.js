import React, { useState } from "react";
import "./AppointmentForm.css";

const patients = ["Alin PS", "Lakshmipriya R", "Sanskriti V", "Akash Krishna","Mathew Thomas"];
const doctors = ["Dr.Adithyan", "Dr.Salman", "Dr.Parvathy","Dr.Sreelakshmi","Dr.Karun"];

const AppointmentForm = ({ date, onSave, onClose, existing = null }) => {
  const [patient, setPatient] = useState(existing?.patient || "");
  const [doctor, setDoctor] = useState(existing?.doctor || "");
  const [time, setTime] = useState(existing?.time || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patient || !doctor || !time) {
      alert("Please fill in all fields");
      return;
    }

    const appointment = {
      patient,
      doctor,
      time,
      date: date?.toISOString(),
    };

    onSave(appointment); 
  };

  return (
    date && (
      <div className="modal-overlay">
        <div className="form-container">
          <h3>{existing ? "Edit Appointment" : "Add Appointment"} for {date.toDateString()}</h3>
          <form onSubmit={handleSubmit}>
            <label>Patient:</label>
            <select value={patient} onChange={(e) => setPatient(e.target.value)}>
              <option value="">Select Patient</option>
              {patients.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <label>Doctor:</label>
            <select value={doctor} onChange={(e) => setDoctor(e.target.value)}>
              <option value="">Select Doctor</option>
              {doctors.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <label>Time:</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />

            <div className="form-actions">
              <button type="submit">{existing ? "Update" : "Save"}</button>
              <button type="button" onClick={onClose} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AppointmentForm;
