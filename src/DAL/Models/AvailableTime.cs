using DAL.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class AvailableTime
    {
        public AvailableTime()
        {
        }

        public AvailableTime(DateTime startDate, DateTime endDate, Provider provider)
        {
            this.StartDate = startDate;
            this.EndDate = endDate;
            this.Provider = provider;
            this.DateCreated = this.DateModified = DateTime.UtcNow;
        }

        public AvailableTime(DateTime startDate, TimeSpan duration, Provider provider)
        {
            this.StartDate = startDate;
            this.EndDate = startDate.Add(duration);
            this.Provider = provider;
            this.DateCreated = this.DateModified = DateTime.UtcNow;
        }


        public int Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsBooked { get; set; }
        public bool IsReserved { get; set; }
        public string Comment { get; set; }


        public int ProviderId { get; set; }
        public Provider Provider { get; set; }


        public ICollection<Appointment> Appointments { get; set; }


        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }




        //---FUTURE VERSIONS---
        //vNext: IsPublic - Set to make this available time accessible to patients. Set to false to make it only accessible to staff/providers
    }
}
