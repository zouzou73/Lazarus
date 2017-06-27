using DAL.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public interface IUnitOfWork
    {
        IAppointmentRepository Appointments { get; }
        IConsultationRepository Consultations { get; }
        IDepartmentRepository Departments { get; }
        ILabTestRepository LabTests { get; }
        INotificationRepository Notifications { get; }
        IPatientRepository Patients { get; }
        IProviderRepository Providers { get; }


        int SaveChanges();
    }
}
