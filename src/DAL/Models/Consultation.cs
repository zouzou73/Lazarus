using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class Consultation
    {
        public int Id { get; set; }
        public string Symptoms { get; set; }
        public string Prognosis { get; set; }
        public string Prescriptions { get; set; }
        public string Comments { get; set; }


        public int PatientId { get; set; }
        public Patient Patient { get; set; }

        public int ProviderId { get; set; }
        public Provider Provider { get; set; }

        public int? AppointmentId { get; set; }
        public Appointment Appointment { get; set; }

        public int? NextAppointmentId { get; set; }
        public Appointment NextAppointment { get; set; }

        public int? ParentId { get; set; }
        public Consultation Parent { get; set; }


        public ICollection<Consultation> Children { get; set; }
        public ICollection<LabTest> LabTests { get; set; }


        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
    }
}
