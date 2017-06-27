using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DAL.Repositories.Interfaces
{
    public interface IConsultationRepository : IRepository<Consultation>
    {
        List<Consultation> GetAllConsultations(int? page, int? pageSize);
        Consultation GetConsultation(int consultationId);
        List<Consultation> GetConsultationsByAppointmentId(int appointmentId);
        List<Consultation> GetPatientHistory(int patientId, int? page = null, int? pageSize = null);
        List<Consultation> GetPatientHistory(string userId, int? page = null, int? pageSize = null);
        List<Consultation> GetProviderConsultations(int providerId, int? page = null, int? pageSize = null);
        List<Consultation> GetProviderConsultations(string userId, int? page = null, int? pageSize = null);
        bool TestCanDeleteConsultation(int id);
    }
}
