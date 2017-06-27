using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;


namespace lazarus.ViewModels
{
    public class ConsultationViewModel
    {
        public int Id { get; set; }
        public string Symptoms { get; set; }
        public string Prognosis { get; set; }
        public string Prescriptions { get; set; }
        public string Comments { get; set; }

        [Required(ErrorMessage = "PatientId is required")]
        [Range(1, int.MaxValue, ErrorMessage = "PatientId is required")]
        public int PatientId { get; set; }
        public string PatientName { get; set; }

        [Required(ErrorMessage = "ProviderId is required")]
        [Range(1, int.MaxValue, ErrorMessage = "ProviderId is required")]
        public int ProviderId { get; set; }
        public string ProviderName { get; set; }
        public int? AppointmentId { get; set; }
        public DateTime? AppointmentDate { get; set; }
        public int? NextAppointmentId { get; set; }

        public int? ParentId { get; set; }
        public DateTime? Date { get; set; }
    }
}
