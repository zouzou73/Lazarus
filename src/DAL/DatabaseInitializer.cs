using DAL.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Core;
using DAL.Core.Interfaces;
using AP = DAL.Core.ApplicationPermissions;

namespace DAL
{
    public interface IDatabaseInitializer
    {
        Task SeedAsync();
    }




    public class DatabaseInitializer : IDatabaseInitializer
    {
        private readonly ApplicationDbContext _context;
        private readonly IAccountManager _accountManager;
        private readonly ILogger _logger;

        public DatabaseInitializer(ApplicationDbContext context, IAccountManager accountManager, ILogger<DatabaseInitializer> logger)
        {
            _accountManager = accountManager;
            _context = context;
            _logger = logger;
        }

        public async Task SeedAsync()
        {
            await _context.Database.MigrateAsync().ConfigureAwait(false);

            if (!await _context.Users.AnyAsync())
            {
                const string adminRoleName = "administrator";
                const string doctorRoleName = "doctor";
                const string nurseRoleName = "nurse";
                const string patientRoleName = "patient";

                string[] doctorPermissions = new string[] {
                    AP.ViewUsers,
                    AP.ViewRoles,
                    AP.ViewAppointments, AP.AcceptAppointments,
                    AP.ViewConsultations,
                    AP.ViewPatients,
                    AP.ViewProviders
                };

                string[] nursePermissions = new string[] {
                    AP.ViewUsers,
                    AP.ViewRoles,
                    AP.ViewAppointments, AP.ManageAppointments,
                    AP.ViewConsultations,
                    AP.ViewPatients,AP.ManagePatients,
                    AP.ViewProviders,AP.ManageProviders
                };

                string[] patientPermissions = new string[] {
                    AP.RequestAppointments
                };

                await ensureRoleAsync(adminRoleName, "Default administrator", ApplicationPermissions.GetAllPermissionValues());
                await ensureRoleAsync(doctorRoleName, "Default doctor", doctorPermissions);
                await ensureRoleAsync(nurseRoleName, "Default nurse", nursePermissions);
                await ensureRoleAsync(patientRoleName, "Default patient", patientPermissions);

                var adminUser = await createUserAsync("admin", "tempP@ss123", "Inbuilt Administrator", "admin@ebenmonney.com", "+1 (123) 000-0000", new string[] { adminRoleName });
                var doctor = await createUserAsync("doctor", "tempP@ss123", "Inbuilt Doctor", "doctor@ebenmonney.com", "+1 (123) 000-0001", new string[] { doctorRoleName });
                var nurse = await createUserAsync("nurse", "tempP@ss123", "Inbuilt Nurse", "nurse@ebenmonney.com", "+1 (123) 000-0001", new string[] { nurseRoleName });
                var patient = await createUserAsync("patient", "tempP@ss123", "Inbuilt Patient", "patient@ebenmonney.com", "+1 (123) 000-0001", new string[] { patientRoleName });


                var currentDate = DateTime.UtcNow;

                Department dpmnt_1 = new Department
                {
                    Name = "General",
                    Description = "General Practice",
                    DateCreated = currentDate,
                    DateModified = currentDate
                };

                Department dpmnt_2 = new Department
                {
                    Name = "Pharmacy",
                    Description = "Hospital Pharmacy",
                    DateCreated = currentDate,
                    DateModified = currentDate
                };

                Department dpmnt_3 = new Department
                {
                    Name = "Dentistry",
                    Description = "Dentists",
                    DateCreated = currentDate,
                    DateModified = currentDate
                };
                Department dpmnt_4 = new Department
                {
                    Name = "Ophthalmology",
                    Description = "Eye Clinic",
                    DateCreated = currentDate,
                    DateModified = currentDate
                };

                Department dpmnt_5 = new Department
                {
                    Name = "Laboratory",
                    Description = "Hospital Laboratories",
                    DateCreated = currentDate,
                    DateModified = currentDate
                };

                Department dpmnt_6 = new Department
                {
                    Name = "Radiology",
                    Description = "X-ray, MRI/CT Scan, etc",
                    DateCreated = currentDate,
                    DateModified = currentDate
                };

                Department dpmnt_7 = new Department
                {
                    Name = "Psychiatry",
                    Description = "Mental Health",
                    DateCreated = currentDate,
                    DateModified = currentDate
                };

                Department dpmnt_8 = new Department
                {
                    Name = "Records",
                    Description = "Medical records",
                    DateCreated = currentDate,
                    DateModified = currentDate
                };



                Provider prvdr_1 = new Provider
                {
                    ApplicationUser = doctor,
                    ServiceId = "DCT0001",
                    WorkPhoneNumber = "+1 (123) 000-0201",
                    Address = "Ridge Hospital, Block D, Accra, Ghana",
                    City = "Accra",
                    IsActive = true,
                    Gender = Gender.Male,
                    Department = dpmnt_1,
                    DateCreated = currentDate,
                    DateModified = currentDate
                };

                Provider prvdr_2 = new Provider
                {
                    ApplicationUser = nurse,
                    ServiceId = "NRS0001",
                    WorkPhoneNumber = "+1 (123) 000-0561",
                    Address = "Ridge Hospital, Central OPD, Accra, Ghana",
                    City = "Accra",
                    IsActive = true,
                    Gender = Gender.Female,
                    Department = dpmnt_8,
                    DateCreated = currentDate,
                    DateModified = currentDate
                };



                Patient ptnt_1 = new Patient
                {
                    ApplicationUser = patient,
                    BloodGroup = BloodGroup.A_Positive,
                    Address = @"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.
                    Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet",
                    City = "Accra",
                    IsActive = true,
                    Gender = Gender.Male,
                    DateOfBirth = DateTime.ParseExact("27/01/1993", "dd/MM/yyyy", null),
                    DateCreated = currentDate,
                    DateModified = currentDate,
                    Appointments = new List<Appointment>()
                    {
                        new Appointment(){
                            PreferredDate = currentDate.AddDays(1),
                            Symptoms = "Tooth ache, sore mouth",
                            Status = AppointmentStatus.Cancelled,
                            Provider = prvdr_1,
                            DateCreated = currentDate,
                            DateModified = currentDate
                        },
                         new Appointment(){
                            PreferredDate = currentDate.AddDays(2),
                            Symptoms = "Severe Headache, Body Weakness, Loss of appetite, high temperature",
                            Status = AppointmentStatus.PendingApproval,
                            IsCritical = true,
                            DateCreated = currentDate,
                            DateModified = currentDate
                        }
                    }
                };


                _context.Departments.Add(dpmnt_1);
                _context.Departments.Add(dpmnt_2);
                _context.Departments.Add(dpmnt_3);
                _context.Departments.Add(dpmnt_4);
                _context.Departments.Add(dpmnt_5);
                _context.Departments.Add(dpmnt_6);
                _context.Departments.Add(dpmnt_7);
                _context.Departments.Add(dpmnt_8);

                _context.Providers.Add(prvdr_1);
                _context.Providers.Add(prvdr_2);

                _context.Patients.Add(ptnt_1);

                await _context.SaveChangesAsync();
            }
        }



        private async Task ensureRoleAsync(string roleName, string description, string[] claims)
        {
            if ((await _accountManager.GetRoleByNameAsync(roleName)) == null)
            {
                ApplicationRole applicationRole = new ApplicationRole(roleName, description);

                var result = await this._accountManager.CreateRoleAsync(applicationRole, claims);

                if (!result.Item1)
                    throw new Exception($"Seeding \"{description}\" role failed. Errors: {string.Join(Environment.NewLine, result.Item2)}");
            }
        }

        private async Task<ApplicationUser> createUserAsync(string userName, string password, string fullName, string email, string phoneNumber, string[] roles)
        {
            ApplicationUser applicationUser = new ApplicationUser
            {
                UserName = userName,
                FullName = fullName,
                Email = email,
                PhoneNumber = phoneNumber,
                EmailConfirmed = true,
                IsEnabled = true
            };

            var result = await _accountManager.CreateUserAsync(applicationUser, roles, password);

            if (!result.Item1)
                throw new Exception($"Seeding \"{userName}\" user failed. Errors: {string.Join(Environment.NewLine, result.Item2)}");


            return applicationUser;
        }
    }
}
