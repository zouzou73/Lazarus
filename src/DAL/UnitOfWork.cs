using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Repositories;
using DAL.Repositories.Interfaces;
using Microsoft.Extensions.Logging;

namespace DAL
{
    public class UnitOfWork : IUnitOfWork
    {
        readonly ApplicationDbContext _context;

        IAppointmentRepository _appointments;
        IConsultationRepository _consultations;
        IDepartmentRepository _departments;
        ILabTestRepository _labTests;
        INotificationRepository _notifications;
        IPatientRepository _patients;
        IProviderRepository _providers;



        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
        }



        public IAppointmentRepository Appointments
        {
            get
            {
                if (_appointments == null)
                    _appointments = new AppointmentRepository(_context);

                return _appointments;
            }
        }



        public IConsultationRepository Consultations
        {
            get
            {
                if (_consultations == null)
                    _consultations = new ConsultationRepository(_context);

                return _consultations;
            }
        }



        public IDepartmentRepository Departments
        {
            get
            {
                if (_departments == null)
                    _departments = new DepartmentRepository(_context);

                return _departments;
            }
        }



        public ILabTestRepository LabTests
        {
            get
            {
                if (_labTests == null)
                    _labTests = new LabTestRepository(_context);

                return _labTests;
            }
        }



        public INotificationRepository Notifications
        {
            get
            {
                if (_notifications == null)
                    _notifications = new NotificationRepository(_context);

                return _notifications;
            }
        }



        public IPatientRepository Patients
        {
            get
            {
                if (_patients == null)
                    _patients = new PatientRepository(_context);

                return _patients;
            }
        }



        public IProviderRepository Providers
        {
            get
            {
                if (_providers == null)
                    _providers = new ProviderRepository(_context);

                return _providers;
            }
        }




        public int SaveChanges()
        {
            return _context.SaveChanges();
        }
    }
}
