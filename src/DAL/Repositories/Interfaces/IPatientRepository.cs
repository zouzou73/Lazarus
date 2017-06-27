using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DAL.Repositories.Interfaces
{
    public interface IPatientRepository : IRepository<Patient>
    {
        List<ApplicationRole> GetAllPatientRoles(int? page, int? pageSize);
        List<PatientWithRoles> GetAllPatients(int? page, int? pageSize);
        bool GetIsPatient(string[] userRoles);
        List<ApplicationRole> GetNonAdminPatientRoles(int? page, int? pageSize);
        PatientWithRoles GetPatient(int patientId);
        PatientWithRoles GetPatientByUserId(string userId);
        bool TestCanDeletePatient(int id);
    }
}
