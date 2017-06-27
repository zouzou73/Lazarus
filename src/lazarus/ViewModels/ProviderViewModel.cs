using DAL.Core;
using DAL.Models;
using FluentValidation;
using lazarus.Helpers;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;


namespace lazarus.ViewModels
{
    public class ProviderViewModel
    {
        public int Id { get; set; }
        [Required]
        public string ServiceId { get; set; }
        public string WorkPhoneNumber { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        [Required]
        public Gender Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        [Required]
        public string ApplicationUserId { get; set; }
        public UserViewModel ApplicationUser { get; set; }
        [Required]
        public int? DepartmentId { get; set; }
        public string DepartmentName { get; set; }
    }
}
