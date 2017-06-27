using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Core
{
    public struct TimeSlot
    {
        public TimeSlot(DateTime start, TimeSpan duration)
        {
            this.Start = start;
            this.Duration = duration;
        }


        public DateTime Start { get; set; }
        public TimeSpan Duration { get; set; }
    }
}
