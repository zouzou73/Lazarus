using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DAL.Models;
using DAL.Repositories.Interfaces;

namespace DAL.Repositories
{
    public class AppointmentRepository : Repository<Appointment>, IAppointmentRepository
    {
        public AppointmentRepository(ApplicationDbContext context) : base(context)
        { }


        public Appointment GetAppointment(int appointmentId)
        {
            return appContext.Appointments.Include(a => a.Date).Include(a => a.Patient.ApplicationUser).Include(a => a.Provider.ApplicationUser)
                .Where(a => a.Id == appointmentId).FirstOrDefault();
        }

        public List<Appointment> GetAppointmentsByPatientId(int patientId)
        {
            return appContext.Appointments.Include(a => a.Date).Include(a => a.Patient.ApplicationUser).Include(a => a.Provider.ApplicationUser)
                .Where(a => a.PatientId == patientId).ToList();
        }


        public List<Appointment> GetAppointmentsByProviderId(int providerId)
        {
            return appContext.Appointments.Include(a => a.Date).Include(a => a.Patient.ApplicationUser).Include(a => a.Provider.ApplicationUser)
                .Where(a => a.ProviderId == providerId).ToList();
        }


        public List<Appointment> GetUserAllAppointments(string userId, int? page = null, int? pageSize = null)
        {
            return GetUserAppointmentsHelper(userId, page, pageSize, false);
        }


        public List<Appointment> GetUserAppointmentsForToday(string userId)
        {
            DateTime currentDate = DateTime.UtcNow;
            DateTime startDate = currentDate.Date;
            DateTime endDate = currentDate.Date.AddDays(1);

            var todaysAppointments = appContext.Appointments.Include(a => a.Date).Include(a => a.Patient.ApplicationUser).Include(a => a.Provider.ApplicationUser).Include(a => a.Consultations)
                .Where(a => (!a.Consultations.Any()) &&
                (a.Provider.ApplicationUserId == userId || a.Patient.ApplicationUserId == userId) &&
                (a.Status == Core.AppointmentStatus.Confirm || a.Status == Core.AppointmentStatus.Confirmed) &&
                (a.Date.StartDate >= startDate && a.Date.StartDate < endDate))
                .ToList()
                .OrderBy(a => Math.Abs((a.Date.StartDate - currentDate).Ticks));

            return todaysAppointments.ToList();
        }


        public List<Appointment> GetUserUpcomingAppointments(string userId, int? page = null, int? pageSize = null)
        {
            return GetUserAppointmentsHelper(userId, page, pageSize, true);
        }


        private List<Appointment> GetUserAppointmentsHelper(string userId, int? page, int? pageSize, bool upcomingOnly)
        {
            if ((page == null || pageSize == null) && (page != null || pageSize != null))
                throw new InvalidOperationException($"{nameof(page)} and {nameof(pageSize)} should both be null or non null");

            DateTime currentDate = DateTime.UtcNow;

            var userAppointments = appContext.Appointments.Include(a => a.Date).Include(a => a.Patient.ApplicationUser).Include(a => a.Provider.ApplicationUser)
                .Where(a => a.Provider.ApplicationUserId == userId || a.Patient.ApplicationUserId == userId);

            if (upcomingOnly)
                userAppointments = userAppointments.Where(a => a.Date.StartDate > currentDate);

            if (page != null)
                return userAppointments.OrderByDescending(a => a.Id).Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value).ToList();
            else
                return userAppointments.OrderByDescending(a => a.Id).ToList();
        }


        public List<Appointment> GetAllUpcomingAppointments(int? page = null, int? pageSize = null)
        {
            return GetAllAppointmentsHelper(page, pageSize, true);
        }


        public List<Appointment> GetAllAppointments(int? page = null, int? pageSize = null)
        {
            return GetAllAppointmentsHelper(page, pageSize, false);
        }



        private List<Appointment> GetAllAppointmentsHelper(int? page, int? pageSize, bool upcomingOnly)
        {
            if ((page == null || pageSize == null) && (page != null || pageSize != null))
                throw new InvalidOperationException($"{nameof(page)} and {nameof(pageSize)} should both be null or non null");

            DateTime currentDate = DateTime.UtcNow;

            var appointments = appContext.Appointments.Include(a => a.Date).Include(a => a.Patient.ApplicationUser).Include(a => a.Provider.ApplicationUser);
            IOrderedQueryable<Appointment> orderedAppointmensts;

            if (upcomingOnly)
                orderedAppointmensts = appointments.Where(a => a.Date.StartDate > currentDate).OrderByDescending(a => a.Id);
            else
                orderedAppointmensts = appContext.Appointments.OrderByDescending(a => a.Id);


            if (page != null)
                return appointments.Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value).ToList();
            else
                return appointments.ToList();
        }



        public bool TestCanDeleteAppointment(int id)
        {
            //Todo: Check for any foreign key violations

            return true;
        }

        private ApplicationDbContext appContext
        {
            get { return (ApplicationDbContext)_context; }
        }
    }
}
