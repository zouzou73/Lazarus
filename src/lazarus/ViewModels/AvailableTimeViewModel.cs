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
    public class AvailableTimeViewModel
    {
        public int Id { get; set; }
        public int ProviderId { get; set; }
        public string ProviderName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsBooked { get; set; }
        public bool IsReserved { get; set; }
    }
}
