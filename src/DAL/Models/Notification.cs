using DAL.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class Notification
    {
        public int Id { get; set; }
        public string ReferenceId { get; set; }
        public string Header { get; set; }
        public string Body { get; set; }
        public bool IsEmailRequired { get; set; }
        public bool IsRead { get; set; }
        public bool IsPinned { get; set; }
        public DateTime? EmailSentDate { get; set; }
        public string EmailFailedErrorMessage { get; set; }
        public NotificationType Type { get; set; }


        public string TargetUserId { get; set; }
        public ApplicationUser TargetUser { get; set; }


        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
    }
}
