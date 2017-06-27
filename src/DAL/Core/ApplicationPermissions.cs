using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.ObjectModel;

namespace DAL.Core
{
    public static class ApplicationPermissions
    {
        public static ReadOnlyCollection<ApplicationPermission> AllPermissions;


        public const string UsersPermissionGroupName = "User Permissions";
        public static ApplicationPermission ViewUsers = new ApplicationPermission("View Users", "users.view", UsersPermissionGroupName, "Permission to view other users account details");
        public static ApplicationPermission ManageUsers = new ApplicationPermission("Manage Users", "users.manage", UsersPermissionGroupName, "Permission to create, delete and modify other users account details");

        public const string RolesPermissionGroupName = "Role Permissions";
        public static ApplicationPermission ViewRoles = new ApplicationPermission("View Roles", "roles.view", RolesPermissionGroupName, "Permission to view available roles");
        public static ApplicationPermission ManageRoles = new ApplicationPermission("Manage Roles", "roles.manage", RolesPermissionGroupName, "Permission to create, delete and modify roles");
        public static ApplicationPermission AssignRoles = new ApplicationPermission("Assign Roles", "roles.assign", RolesPermissionGroupName, "Permission to assign roles to users");

        public const string AppointmentsPermissionGroupName = "Appointment Permissions";
        public static ApplicationPermission ViewAppointments = new ApplicationPermission("View Appointments", "appointments.view", AppointmentsPermissionGroupName, "Permission to view available appointments");
        public static ApplicationPermission ManageAppointments = new ApplicationPermission("Manage Appointments", "appointments.manage", AppointmentsPermissionGroupName, "Permission to create, delete and modify appointments - *Unique task for Nurses");
        public static ApplicationPermission RequestAppointments = new ApplicationPermission("Request Appointments", "appointments.request", AppointmentsPermissionGroupName, "Permission to request for an appointment - *Unique task for Patients");
        public static ApplicationPermission AcceptAppointments = new ApplicationPermission("Accept Appointments", "appointments.accept", AppointmentsPermissionGroupName, "Permission to accept or reject assigned appointments - *Unique task for Doctors");

        public const string ConsultationsPermissionGroupName = "Consultation Permissions";
        public static ApplicationPermission ViewConsultations = new ApplicationPermission("View Consultations", "consultations.view", ConsultationsPermissionGroupName, "Permission to view available consultations");

        public const string PatientsPermissionGroupName = "Patient Permissions";
        public static ApplicationPermission ViewPatients = new ApplicationPermission("View Patients", "patients.view", PatientsPermissionGroupName, "Permission to view available patients");
        public static ApplicationPermission ManagePatients = new ApplicationPermission("Manage Patients", "patients.manage", PatientsPermissionGroupName, "Permission to create, delete and modify patients");

        public const string ProvidersPermissionGroupName = "Provider Permissions";
        public static ApplicationPermission ViewProviders = new ApplicationPermission("View Providers", "providers.view", ProvidersPermissionGroupName, "Permission to view available providers");
        public static ApplicationPermission ManageProviders = new ApplicationPermission("Manage Providers", "providers.manage", ProvidersPermissionGroupName, "Permission to create, delete and modify providers");

        static ApplicationPermissions()
        {
            List<ApplicationPermission> allPermissions = new List<ApplicationPermission>()
            {
                ViewUsers,
                ManageUsers,

                ViewRoles,
                ManageRoles,
                AssignRoles,

                ViewAppointments,
                ManageAppointments,
                RequestAppointments,
                AcceptAppointments,

                ViewConsultations,

                ViewPatients,
                ManagePatients,

                ViewProviders,
                ManageProviders
            };

            AllPermissions = allPermissions.AsReadOnly();
        }

        public static ApplicationPermission GetPermissionByName(string permissionName)
        {
            return AllPermissions.Where(p => p.Name == permissionName).FirstOrDefault();
        }

        public static ApplicationPermission GetPermissionByValue(string permissionValue)
        {
            return AllPermissions.Where(p => p.Value == permissionValue).FirstOrDefault();
        }

        public static string[] GetAllPermissionValues()
        {
            return AllPermissions.Select(p => p.Value).ToArray();
        }

        public static string[] GetPermissionsForAdminsValues()
        {
            return new string[] { ManageUsers, ManageRoles, AssignRoles };
        }

        public static string[] GetPermissionsForDoctorsValues()
        {
            return new string[] { AcceptAppointments };
        }

        public static string[] GetPermissionsForNursesValues()
        {
            return new string[] { ManageAppointments };
        }

        public static string[] GetPermissionsForProvidersValues()
        {
            return GetPermissionsForDoctorsValues().Union(GetPermissionsForNursesValues()).ToArray();
        }

        public static string[] GetPermissionsForPatientsValues()
        {
            return new string[] { RequestAppointments };
        }
    }





    public class ApplicationPermission
    {
        public ApplicationPermission()
        { }

        public ApplicationPermission(string name, string value, string groupName, string description = null)
        {
            Name = name;
            Value = value;
            GroupName = groupName;
            Description = description;
        }



        public string Name { get; set; }
        public string Value { get; set; }
        public string GroupName { get; set; }
        public string Description { get; set; }


        public override string ToString()
        {
            return Value;
        }


        public static implicit operator string(ApplicationPermission permission)
        {
            return permission.Value;
        }
    }
}
