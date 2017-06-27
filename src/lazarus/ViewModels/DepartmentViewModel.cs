using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;


namespace lazarus.ViewModels
{
    public class DepartmentViewModel
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Department name is required")]
        public string Name { get; set; }
        public string Description { get; set; }
        public string Icon { get; set; }
        public int UsersCount { get; set; }
    }
}
