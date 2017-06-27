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
    public class PatientViewModel
    {
        public int Id { get; set; }
        public BloodGroup BloodGroup { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        [Required]
        public Gender Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        [Required]
        public string ApplicationUserId { get; set; }
        public UserViewModel ApplicationUser { get; set; }
    }
}
