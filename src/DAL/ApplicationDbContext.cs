using DAL.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using OpenIddict;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
    {
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Consultation> Consultations { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<LabTest> LabTests { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Provider> Providers { get; set; }
        public DbSet<AvailableTime> AvailableTimes { get; set; }




        public ApplicationDbContext(DbContextOptions options) : base(options)
        { }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Appointment>().HasIndex(a => a.DateCreated);
            builder.Entity<Appointment>().HasIndex(a => a.DateModified);
            builder.Entity<Appointment>().HasOne(a => a.Patient).WithMany(p => p.Appointments).OnDelete(DeleteBehavior.Restrict);
            builder.Entity<Appointment>().HasOne(a => a.PreferredProvider).WithMany();
            builder.Entity<Appointment>().HasOne(a => a.ConfirmedByProvider).WithMany();
            builder.Entity<Appointment>().HasOne(a => a.Provider).WithMany(p => p.Appointments);
            builder.Entity<Appointment>().ToTable($"App{nameof(this.Appointments)}");

            builder.Entity<Consultation>().HasIndex(c => c.DateCreated);
            builder.Entity<Consultation>().HasIndex(c => c.DateModified);
            builder.Entity<Consultation>().HasOne(c => c.Parent).WithMany(c => c.Children).OnDelete(DeleteBehavior.Restrict);
            builder.Entity<Consultation>().HasOne(c => c.Appointment).WithMany(a => a.Consultations);
            builder.Entity<Consultation>().HasOne(c => c.Provider).WithMany(p => p.Consultations).OnDelete(DeleteBehavior.Restrict);
            builder.Entity<Consultation>().HasOne(c => c.NextAppointment).WithMany();
            builder.Entity<Consultation>().ToTable($"App{nameof(this.Consultations)}");

            builder.Entity<Department>().Property(d => d.Name).IsRequired().HasMaxLength(100);
            builder.Entity<Department>().HasIndex(d => d.Name);
            builder.Entity<Department>().Property(d => d.Description).HasMaxLength(500);
            builder.Entity<Department>().Property(d => d.Icon).IsUnicode(false).HasMaxLength(256);
            builder.Entity<Department>().HasIndex(d => d.DateCreated);
            builder.Entity<Department>().HasIndex(d => d.DateModified);
            builder.Entity<Department>().ToTable($"App{nameof(this.Departments)}");

            builder.Entity<LabTest>().Property(l => l.Title).IsRequired().HasMaxLength(100);
            builder.Entity<LabTest>().HasIndex(l => l.DateCreated);
            builder.Entity<LabTest>().HasIndex(l => l.DateModified);
            builder.Entity<LabTest>().ToTable($"App{nameof(this.LabTests)}");

            builder.Entity<Notification>().Property(n => n.ReferenceId).IsUnicode(false).IsRequired().HasMaxLength(100);
            builder.Entity<Notification>().Property(n => n.Header).HasMaxLength(100);
            builder.Entity<Notification>().Property(n => n.Body).HasMaxLength(500);
            builder.Entity<Notification>().Property(c => c.EmailFailedErrorMessage).IsUnicode(false).HasMaxLength(200);
            builder.Entity<Notification>().HasIndex(n => n.IsPinned);
            builder.Entity<Notification>().HasIndex(n => n.DateCreated);
            builder.Entity<Notification>().HasIndex(n => n.DateModified);
            builder.Entity<Notification>().HasOne(n => n.TargetUser).WithMany(u => u.Notifications).OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Notification>().ToTable($"App{nameof(this.Notifications)}");

            builder.Entity<Patient>().HasIndex(p => p.BloodGroup);
            builder.Entity<Patient>().HasIndex(p => p.ApplicationUserId).IsUnique();
            builder.Entity<Patient>().Property(p => p.Address).HasMaxLength(500);
            builder.Entity<Patient>().Property(p => p.City).HasMaxLength(50);
            builder.Entity<Patient>().HasIndex(p => p.IsActive);
            builder.Entity<Patient>().HasIndex(p => p.Gender);
            builder.Entity<Patient>().Property(p => p.DateOfBirth).HasColumnType("Date");
            builder.Entity<Patient>().HasIndex(p => p.DateOfBirth);
            builder.Entity<Patient>().HasIndex(p => p.DateCreated);
            builder.Entity<Patient>().HasIndex(p => p.DateModified);
            builder.Entity<Patient>().HasOne(p => p.ApplicationUser).WithOne().IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Patient>().ToTable($"App{nameof(this.Patients)}");

            builder.Entity<Provider>().Property(p => p.ServiceId).HasMaxLength(100);
            builder.Entity<Provider>().HasIndex(p => p.ServiceId);
            builder.Entity<Provider>().HasIndex(p => p.ApplicationUserId).IsUnique();
            builder.Entity<Provider>().Property(p => p.WorkPhoneNumber).IsUnicode(false).HasMaxLength(30);
            builder.Entity<Provider>().Property(p => p.Address).HasMaxLength(500);
            builder.Entity<Provider>().Property(p => p.City).HasMaxLength(50);
            builder.Entity<Provider>().HasIndex(p => p.IsActive);
            builder.Entity<Provider>().HasIndex(p => p.Gender);
            builder.Entity<Provider>().Property(p => p.DateOfBirth).HasColumnType("Date");
            builder.Entity<Provider>().HasIndex(p => p.DateCreated);
            builder.Entity<Provider>().HasIndex(p => p.DateModified);
            builder.Entity<Provider>().HasOne(p => p.ApplicationUser).WithOne().IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Provider>().ToTable($"App{nameof(this.Providers)}");

            builder.Entity<AvailableTime>().Property(t => t.Comment).HasMaxLength(100);
            builder.Entity<AvailableTime>().HasIndex(t => t.StartDate);
            builder.Entity<AvailableTime>().HasIndex(t => t.EndDate);
            builder.Entity<AvailableTime>().HasIndex(t => t.IsBooked);
            builder.Entity<AvailableTime>().HasIndex(t => t.IsReserved);
            builder.Entity<AvailableTime>().HasIndex(t => t.DateCreated);
            builder.Entity<AvailableTime>().HasIndex(t => t.DateModified);
            builder.Entity<AvailableTime>().ToTable($"App{nameof(this.AvailableTimes)}");
        }
    }
}
