using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class LabTest
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Request { get; set; }
        public string Result { get; set; }
        public string LabComments { get; set; }
        public string PhysicianComments { get; set; }


        public int PatientId { get; set; }
        public Patient Patient { get; set; }

        public int? LabTechnicianId { get; set; }
        public Provider LabTechnician { get; set; }

        public int? ConsultationId { get; set; }
        public Consultation Consultation { get; set; }


        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
    }
}
