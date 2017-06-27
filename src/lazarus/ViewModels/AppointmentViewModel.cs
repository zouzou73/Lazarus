using DAL.Core;
using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;


namespace lazarus.ViewModels
{
    public class AppointmentViewModel
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Symptoms is required")]
        public string Symptoms { get; set; }
        public bool IsCritical { get; set; }
        public DateTime? PreferredDate { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public AppointmentStatus Status { get; set; }
        public AppointmentRole Role { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; }
        public int? PreferredProviderId { get; set; }
        public string PreferredProviderName { get; set; }
        public int? ProviderId { get; set; }
        public string ProviderName { get; set; }
    }
}
