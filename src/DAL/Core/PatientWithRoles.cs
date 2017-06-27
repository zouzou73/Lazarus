using DAL.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class PatientWithRoles
    {
        public PatientWithRoles()
        {
        }

        public PatientWithRoles(Patient patient, string[] roles)
        {
            this.Patient = patient;
            this.Roles = roles;
        }

        public Patient Patient { get; set; }
        public string[] Roles { get; set; }
    }
}
