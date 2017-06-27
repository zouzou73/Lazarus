using DAL.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class Appointment
    {
        public int Id { get; set; }
        public string Symptoms { get; set; }
        public bool IsCritical { get; set; }
        public DateTime PreferredDate { get; set; }
        public AppointmentStatus Status { get; set; }

        public int? DateId { get; set; }
        public AvailableTime Date { get; set; }

        public int PatientId { get; set; }
        public Patient Patient { get; set; }

        public int? PreferredProviderId { get; set; }
        public Provider PreferredProvider { get; set; }

        public int? ProviderId { get; set; }
        public Provider Provider { get; set; }

        public int? ConfirmedByProviderId { get; set; }
        public Provider ConfirmedByProvider { get; set; }


        public ICollection<Consultation> Consultations { get; set; }


        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
    }
}
