const sendEmail = require("./sendEmail");

const sendAppointmentReminder = async (appointment) => {
  const html = `
    <h3>Hello ${appointment.patientName},</h3>
    <p>This is a reminder that your appoinment was confirmed with Dr. <strong>${appointment.doctorName}</strong>.</p>
    <p><strong>Date:</strong> ${appointment.date}</p>
    <p><strong>Time:</strong> ${appointment.time}</p>
    <br/>
    <p>Clínica Vortex.</p>
  `;

  await sendEmail(appointment.patientEmail, "Confirmed shift reminder", html);
};

module.exports = sendAppointmentReminder;
