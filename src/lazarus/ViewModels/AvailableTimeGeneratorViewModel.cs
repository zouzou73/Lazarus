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
    public class AvailableTimeGeneratorViewModel
    {
        [Required]
        public int ProviderId { get; set; }
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }
        public TimeSpan? Interval { get; set; }
        public TimeSlot[] Breaks { get; set; }
    }
}
