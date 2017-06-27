using DAL.Models;
using System;
using System.Linq;

namespace lazarus.Helpers
{
    public static class NotificationMessages
    {
        public static string GetPatientAppointmentConfirmedHeader(DateTime appointmentDate)
        {
            return $"New Appointment Confirmed for {appointmentDate}";
        }

        public static string GetPatientAppointmentConfirmedMessage(string providerName, DateTime appointmentDate, DateTime requestDate)
        {
            return $"You have an appointment with Doctor {providerName} on {appointmentDate} for the request you made on {requestDate}";
        }



        public static string GetProviderAppointmentConfirmedHeader(DateTime appointmentDate)
        {
            return $"New Patient Appointment on {appointmentDate}";
        }

        public static string GetProviderAppointmentConfirmedMessage(string patientName, DateTime appointmentDate)
        {
            return $"You have an appointment with patient {patientName} on {appointmentDate}";
        }
    }
}
