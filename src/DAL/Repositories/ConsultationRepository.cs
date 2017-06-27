using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DAL.Repositories.Interfaces;

namespace DAL.Repositories
{
    public class ConsultationRepository : Repository<Consultation>, IConsultationRepository
    {
        public ConsultationRepository(DbContext context) : base(context)
        { }


        public Consultation GetConsultation(int consultationId)
        {
            return appContext.Consultations.Include(c => c.Appointment.Date).Include(c => c.Patient.ApplicationUser).Include(c => c.Provider.ApplicationUser)
                .Where(c => c.Id == consultationId).FirstOrDefault();
        }


        public List<Consultation> GetConsultationsByAppointmentId(int appointmentId)
        {
            return appContext.Consultations.Include(c => c.Appointment.Date).Include(c => c.Patient.ApplicationUser).Include(c => c.Provider.ApplicationUser)
                .Where(a => a.AppointmentId == appointmentId).OrderByDescending(c => c.DateCreated).ToList();
        }


        public List<Consultation> GetProviderConsultations(string userId, int? page = null, int? pageSize = null)
        {
            if ((page == null || pageSize == null) && (page != null || pageSize != null))
                throw new InvalidOperationException($"{nameof(page)} and {nameof(pageSize)} should both be null or non null");

            var consultations = appContext.Consultations.Include(c => c.Appointment.Date).Include(c => c.Patient.ApplicationUser).Include(c => c.Provider.ApplicationUser)
                .Where(a => a.Provider.ApplicationUserId == userId).OrderByDescending(c => c.DateCreated);

            if (page != null)
                return consultations.Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value).ToList();
            else
                return consultations.ToList();
        }


        public List<Consultation> GetProviderConsultations(int providerId, int? page = null, int? pageSize = null)
        {
            if ((page == null || pageSize == null) && (page != null || pageSize != null))
                throw new InvalidOperationException($"{nameof(page)} and {nameof(pageSize)} should both be null or non null");

            var consultations = appContext.Consultations.Include(c => c.Appointment.Date).Include(c => c.Patient.ApplicationUser).Include(c => c.Provider.ApplicationUser)
                .Where(a => a.ProviderId == providerId).OrderByDescending(c => c.DateCreated);

            if (page != null)
                return consultations.Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value).ToList();
            else
                return consultations.ToList();
        }


        public List<Consultation> GetPatientHistory(string userId, int? page = null, int? pageSize = null)
        {
            if ((page == null || pageSize == null) && (page != null || pageSize != null))
                throw new InvalidOperationException($"{nameof(page)} and {nameof(pageSize)} should both be null or non null");

            var history = appContext.Consultations.Include(c => c.Appointment.Date).Include(c => c.Patient.ApplicationUser).Include(c => c.Provider.ApplicationUser)
                .Where(a => a.Patient.ApplicationUserId == userId).OrderByDescending(c => c.DateCreated);

            if (page != null)
                return history.Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value).ToList();
            else
                return history.ToList();
        }


        public List<Consultation> GetPatientHistory(int patientId, int? page = null, int? pageSize = null)
        {
            if ((page == null || pageSize == null) && (page != null || pageSize != null))
                throw new InvalidOperationException($"{nameof(page)} and {nameof(pageSize)} should both be null or non null");

            var history = appContext.Consultations.Include(c => c.Appointment.Date).Include(c => c.Patient.ApplicationUser).Include(c => c.Provider.ApplicationUser)
                .Where(a => a.PatientId == patientId).OrderByDescending(a => a.DateCreated);

            if (page != null)
                return history.Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value).ToList();
            else
                return history.ToList();
        }


        public List<Consultation> GetAllConsultations(int? page, int? pageSize)
        {
            if ((page == null || pageSize == null) && (page != null || pageSize != null))
                throw new InvalidOperationException($"{nameof(page)} and {nameof(pageSize)} should both be null or non null");


            var consultations = appContext.Consultations.Include(c => c.Appointment.Date).Include(c => c.Patient.ApplicationUser).Include(c => c.Provider.ApplicationUser).OrderByDescending(a => a.DateCreated);

            if (page != null)
                return consultations.Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value).ToList();
            else
                return consultations.ToList();
        }


        public bool TestCanDeleteConsultation(int id)
        {
            return true;
        }



        private ApplicationDbContext appContext
        {
            get { return (ApplicationDbContext)_context; }
        }
    }
}
