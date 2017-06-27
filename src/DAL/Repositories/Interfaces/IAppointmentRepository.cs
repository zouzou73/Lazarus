using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DAL.Repositories.Interfaces
{
    public interface IAppointmentRepository : IRepository<Appointment>
    {
        Appointment GetAppointment(int appointmentId);
        List<Appointment> GetAllAppointments(int? page = null, int? pageSize = null);
        List<Appointment> GetAllUpcomingAppointments(int? page = null, int? pageSize = null);
        List<Appointment> GetAppointmentsByPatientId(int patientId);
        List<Appointment> GetAppointmentsByProviderId(int providerId);
        List<Appointment> GetUserAllAppointments(string userId, int? page = null, int? pageSize = null);
        List<Appointment> GetUserUpcomingAppointments(string userId, int? page = null, int? pageSize = null);
        List<Appointment> GetUserAppointmentsForToday(string userId);
        bool TestCanDeleteAppointment(int id);
    }
}
