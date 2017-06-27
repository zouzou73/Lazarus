using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DAL.Repositories.Interfaces;
using DAL.Core;

namespace DAL.Repositories
{
    public class PatientRepository : Repository<Patient>, IPatientRepository
    {
        //Todo: Erase patient configuration before returning patient(s)

        public PatientRepository(DbContext context) : base(context)
        { }


        public PatientWithRoles GetPatient(int patientId)
        {
            var patient = appContext.Patients.Include(p => p.ApplicationUser.Roles).Where(p => p.Id == patientId).FirstOrDefault();
            return GetPatientWithRoles(patient);
        }


        public PatientWithRoles GetPatientByUserId(string userId)
        {
            var patient = appContext.Patients.Include(p => p.ApplicationUser.Roles).Where(p => p.ApplicationUserId == userId).SingleOrDefault();
            return GetPatientWithRoles(patient);
        }



        public List<PatientWithRoles> GetAllPatients(int? page, int? pageSize)
        {
            if ((page == null || pageSize == null) && (page != null || pageSize != null))
                throw new InvalidOperationException($"{nameof(page)} and {nameof(pageSize)} should both be null or non null");

            List<Patient> patients;

            if (page.HasValue)
                patients = appContext.Patients.Where(p => p.IsActive).Include(p => p.ApplicationUser.Roles).OrderBy(p => p.Id).Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value).ToList();
            else
                patients = appContext.Patients.Where(p => p.IsActive).Include(p => p.ApplicationUser.Roles).OrderBy(p => p.Id).ToList();

            return GetPatientWithRoles(patients);
        }


        public List<ApplicationRole> GetNonAdminPatientRoles(int? page, int? pageSize)
        {
            if ((page == null || pageSize == null) && (page != null || pageSize != null))
                throw new InvalidOperationException($"{nameof(page)} and {nameof(pageSize)} should both be null or non null");

            var adminsPermissions = ApplicationPermissions.GetPermissionsForAdminsValues().ToList();
            var patientPermissions = ApplicationPermissions.GetPermissionsForPatientsValues().ToList();

            var patientOnlyRoles = appContext.Roles.Where(r => r.Claims.Any(c => patientPermissions.Contains(c.ClaimValue)) && r.Claims.All(c => !adminsPermissions.Contains(c.ClaimValue)));

            if (page.HasValue)
                return patientOnlyRoles.OrderBy(p => p.Id).Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value).ToList();
            else
                return patientOnlyRoles.OrderBy(p => p.Id).ToList();
        }


        public List<ApplicationRole> GetAllPatientRoles(int? page, int? pageSize)
        {
            if ((page == null || pageSize == null) && (page != null || pageSize != null))
                throw new InvalidOperationException($"{nameof(page)} and {nameof(pageSize)} should both be null or non null");

            var patientPermissions = ApplicationPermissions.GetPermissionsForPatientsValues().ToList();

            var patientOnlyRoles = appContext.Roles.Where(r => r.Claims.Any(c => patientPermissions.Contains(c.ClaimValue)));

            if (page.HasValue)
                return patientOnlyRoles.OrderBy(p => p.Id).Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value).ToList();
            else
                return patientOnlyRoles.OrderBy(p => p.Id).ToList();
        }


        public bool GetIsPatient(string[] userRoles)
        {
            if (userRoles == null || !userRoles.Any())
                return false;

            List<string> loweredTestRoles = userRoles.Select(r => r.ToLowerInvariant()).ToList();
            List<string> patientRoles = GetAllPatientRoles(null, null).Select(r => r.Name.ToLowerInvariant()).ToList();

            return loweredTestRoles.Any(r => patientRoles.Contains(r));
        }


        public bool TestCanDeletePatient(int id)
        {
            return true;
        }

        private PatientWithRoles GetPatientWithRoles(Patient patient)
        {
            if (patient == null)
                return null;

            var userRoleIds = patient.ApplicationUser.Roles.Select(r => r.RoleId).ToList();

            var roles = appContext.Roles
                .Where(r => userRoleIds.Contains(r.Id))
                .Select(r => r.Name)
                .ToArray();

            return new PatientWithRoles(patient, roles);
        }


        private List<PatientWithRoles> GetPatientWithRoles(List<Patient> patients)
        {
            if (patients == null)
                return null;

            if (!patients.Any())
                return new List<PatientWithRoles>(0);


            var userRoleIds = patients.SelectMany(p => p.ApplicationUser.Roles.Select(r => r.RoleId)).ToList();

            var roles = appContext.Roles
                .Where(r => userRoleIds.Contains(r.Id))
                .ToArray();

            return patients.Select(p => new PatientWithRoles(p, roles.Where(r => p.ApplicationUser.Roles.Select(ur => ur.RoleId).Contains(r.Id)).Select(r => r.Name).ToArray())).ToList();
        }


        private ApplicationDbContext appContext
        {
            get { return (ApplicationDbContext)_context; }
        }
    }
}
