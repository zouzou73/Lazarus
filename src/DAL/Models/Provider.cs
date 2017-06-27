using DAL.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class Provider
    {
        public int Id { get; set; }
        public string ServiceId { get; set; }
        public string WorkPhoneNumber { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public bool IsActive { get; set; }
        public Gender Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }


        public string ApplicationUserId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }

        public int? DepartmentId { get; set; }
        public Department Department { get; set; }


        public ICollection<AvailableTime> WorkingHours { get; set; }
        public ICollection<Appointment> Appointments { get; set; }
        public ICollection<Consultation> Consultations { get; set; }
        public ICollection<LabTest> LabTests { get; set; }


        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
    }
}
