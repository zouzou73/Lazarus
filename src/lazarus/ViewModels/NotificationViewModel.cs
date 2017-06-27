using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;


namespace lazarus.ViewModels
{
    public class NotificationViewModel
    {
        public int Id { get; set; }
        public string Header { get; set; }
        public string Body { get; set; }
        public bool IsRead { get; set; }
        public bool IsPinned { get; set; }
        public DateTime Date { get; set; }
    }
}
