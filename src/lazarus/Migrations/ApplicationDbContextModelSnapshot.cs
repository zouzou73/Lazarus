using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using DAL;
using DAL.Core;

namespace lazarus.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.2")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("DAL.Models.ApplicationRole", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Description");

                    b.Property<string>("Name")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasName("RoleNameIndex");

                    b.ToTable("AspNetRoles");
                });

            modelBuilder.Entity("DAL.Models.ApplicationUser", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("AccessFailedCount");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Configuration");

                    b.Property<string>("Email")
                        .HasMaxLength(256);

                    b.Property<bool>("EmailConfirmed");

                    b.Property<string>("FullName");

                    b.Property<bool>("IsEnabled");

                    b.Property<string>("JobTitle");

                    b.Property<bool>("LockoutEnabled");

                    b.Property<DateTimeOffset?>("LockoutEnd");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256);

                    b.Property<string>("PasswordHash");

                    b.Property<string>("PhoneNumber");

                    b.Property<bool>("PhoneNumberConfirmed");

                    b.Property<string>("SecurityStamp");

                    b.Property<bool>("TwoFactorEnabled");

                    b.Property<string>("UserName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasName("UserNameIndex");

                    b.ToTable("AspNetUsers");
                });

            modelBuilder.Entity("DAL.Models.Appointment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("ConfirmedByProviderId");

                    b.Property<DateTime>("DateCreated");

                    b.Property<int?>("DateId");

                    b.Property<DateTime>("DateModified");

                    b.Property<bool>("IsCritical");

                    b.Property<int>("PatientId");

                    b.Property<DateTime>("PreferredDate");

                    b.Property<int?>("PreferredProviderId");

                    b.Property<int?>("ProviderId");

                    b.Property<int>("Status");

                    b.Property<string>("Symptoms");

                    b.HasKey("Id");

                    b.HasIndex("ConfirmedByProviderId");

                    b.HasIndex("DateCreated");

                    b.HasIndex("DateId");

                    b.HasIndex("DateModified");

                    b.HasIndex("PatientId");

                    b.HasIndex("PreferredProviderId");

                    b.HasIndex("ProviderId");

                    b.ToTable("AppAppointments");
                });

            modelBuilder.Entity("DAL.Models.AvailableTime", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Comment")
                        .HasMaxLength(100);

                    b.Property<DateTime>("DateCreated");

                    b.Property<DateTime>("DateModified");

                    b.Property<DateTime>("EndDate");

                    b.Property<bool>("IsBooked");

                    b.Property<bool>("IsReserved");

                    b.Property<int>("ProviderId");

                    b.Property<DateTime>("StartDate");

                    b.HasKey("Id");

                    b.HasIndex("DateCreated");

                    b.HasIndex("DateModified");

                    b.HasIndex("EndDate");

                    b.HasIndex("IsBooked");

                    b.HasIndex("IsReserved");

                    b.HasIndex("ProviderId");

                    b.HasIndex("StartDate");

                    b.ToTable("AppAvailableTimes");
                });

            modelBuilder.Entity("DAL.Models.Consultation", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("AppointmentId");

                    b.Property<string>("Comments");

                    b.Property<DateTime>("DateCreated");

                    b.Property<DateTime>("DateModified");

                    b.Property<int?>("NextAppointmentId");

                    b.Property<int?>("ParentId");

                    b.Property<int>("PatientId");

                    b.Property<string>("Prescriptions");

                    b.Property<string>("Prognosis");

                    b.Property<int>("ProviderId");

                    b.Property<string>("Symptoms");

                    b.HasKey("Id");

                    b.HasIndex("AppointmentId");

                    b.HasIndex("DateCreated");

                    b.HasIndex("DateModified");

                    b.HasIndex("NextAppointmentId");

                    b.HasIndex("ParentId");

                    b.HasIndex("PatientId");

                    b.HasIndex("ProviderId");

                    b.ToTable("AppConsultations");
                });

            modelBuilder.Entity("DAL.Models.Department", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("DateCreated");

                    b.Property<DateTime>("DateModified");

                    b.Property<string>("Description")
                        .HasMaxLength(500);

                    b.Property<string>("Icon")
                        .HasMaxLength(256)
                        .IsUnicode(false);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.HasKey("Id");

                    b.HasIndex("DateCreated");

                    b.HasIndex("DateModified");

                    b.HasIndex("Name");

                    b.ToTable("AppDepartments");
                });

            modelBuilder.Entity("DAL.Models.LabTest", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("ConsultationId");

                    b.Property<DateTime>("DateCreated");

                    b.Property<DateTime>("DateModified");

                    b.Property<string>("LabComments");

                    b.Property<int?>("LabTechnicianId");

                    b.Property<int>("PatientId");

                    b.Property<string>("PhysicianComments");

                    b.Property<string>("Request");

                    b.Property<string>("Result");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.HasKey("Id");

                    b.HasIndex("ConsultationId");

                    b.HasIndex("DateCreated");

                    b.HasIndex("DateModified");

                    b.HasIndex("LabTechnicianId");

                    b.HasIndex("PatientId");

                    b.ToTable("AppLabTests");
                });

            modelBuilder.Entity("DAL.Models.Notification", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Body")
                        .HasMaxLength(500);

                    b.Property<DateTime>("DateCreated");

                    b.Property<DateTime>("DateModified");

                    b.Property<string>("EmailFailedErrorMessage")
                        .HasMaxLength(200)
                        .IsUnicode(false);

                    b.Property<DateTime?>("EmailSentDate");

                    b.Property<string>("Header")
                        .HasMaxLength(100);

                    b.Property<bool>("IsEmailRequired");

                    b.Property<bool>("IsPinned");

                    b.Property<bool>("IsRead");

                    b.Property<string>("ReferenceId")
                        .IsRequired()
                        .HasMaxLength(100)
                        .IsUnicode(false);

                    b.Property<string>("TargetUserId");

                    b.Property<int>("Type");

                    b.HasKey("Id");

                    b.HasIndex("DateCreated");

                    b.HasIndex("DateModified");

                    b.HasIndex("IsPinned");

                    b.HasIndex("TargetUserId");

                    b.ToTable("AppNotifications");
                });

            modelBuilder.Entity("DAL.Models.Patient", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Address")
                        .HasMaxLength(500);

                    b.Property<string>("ApplicationUserId")
                        .IsRequired();

                    b.Property<int>("BloodGroup");

                    b.Property<string>("City")
                        .HasMaxLength(50);

                    b.Property<DateTime>("DateCreated");

                    b.Property<DateTime>("DateModified");

                    b.Property<DateTime?>("DateOfBirth")
                        .HasColumnType("Date");

                    b.Property<int>("Gender");

                    b.Property<bool>("IsActive");

                    b.HasKey("Id");

                    b.HasIndex("ApplicationUserId")
                        .IsUnique();

                    b.HasIndex("BloodGroup");

                    b.HasIndex("DateCreated");

                    b.HasIndex("DateModified");

                    b.HasIndex("DateOfBirth");

                    b.HasIndex("Gender");

                    b.HasIndex("IsActive");

                    b.ToTable("AppPatients");
                });

            modelBuilder.Entity("DAL.Models.Provider", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Address")
                        .HasMaxLength(500);

                    b.Property<string>("ApplicationUserId")
                        .IsRequired();

                    b.Property<string>("City")
                        .HasMaxLength(50);

                    b.Property<DateTime>("DateCreated");

                    b.Property<DateTime>("DateModified");

                    b.Property<DateTime?>("DateOfBirth")
                        .HasColumnType("Date");

                    b.Property<int?>("DepartmentId");

                    b.Property<int>("Gender");

                    b.Property<bool>("IsActive");

                    b.Property<string>("ServiceId")
                        .HasMaxLength(100);

                    b.Property<string>("WorkPhoneNumber")
                        .HasMaxLength(30)
                        .IsUnicode(false);

                    b.HasKey("Id");

                    b.HasIndex("ApplicationUserId")
                        .IsUnique();

                    b.HasIndex("DateCreated");

                    b.HasIndex("DateModified");

                    b.HasIndex("DepartmentId");

                    b.HasIndex("Gender");

                    b.HasIndex("IsActive");

                    b.HasIndex("ServiceId");

                    b.ToTable("AppProviders");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("RoleId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider");

                    b.Property<string>("ProviderKey");

                    b.Property<string>("ProviderDisplayName");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("RoleId");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("LoginProvider");

                    b.Property<string>("Name");

                    b.Property<string>("Value");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens");
                });

            modelBuilder.Entity("OpenIddict.Models.OpenIddictApplication", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClientId");

                    b.Property<string>("ClientSecret");

                    b.Property<string>("DisplayName");

                    b.Property<string>("LogoutRedirectUri");

                    b.Property<string>("RedirectUri");

                    b.Property<string>("Type");

                    b.HasKey("Id");

                    b.HasIndex("ClientId")
                        .IsUnique();

                    b.ToTable("OpenIddictApplications");
                });

            modelBuilder.Entity("OpenIddict.Models.OpenIddictAuthorization", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ApplicationId");

                    b.Property<string>("Scope");

                    b.Property<string>("Subject");

                    b.HasKey("Id");

                    b.HasIndex("ApplicationId");

                    b.ToTable("OpenIddictAuthorizations");
                });

            modelBuilder.Entity("OpenIddict.Models.OpenIddictScope", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Description");

                    b.HasKey("Id");

                    b.ToTable("OpenIddictScopes");
                });

            modelBuilder.Entity("OpenIddict.Models.OpenIddictToken", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ApplicationId");

                    b.Property<string>("AuthorizationId");

                    b.Property<string>("Subject");

                    b.Property<string>("Type");

                    b.HasKey("Id");

                    b.HasIndex("ApplicationId");

                    b.HasIndex("AuthorizationId");

                    b.ToTable("OpenIddictTokens");
                });

            modelBuilder.Entity("DAL.Models.Appointment", b =>
                {
                    b.HasOne("DAL.Models.Provider", "ConfirmedByProvider")
                        .WithMany()
                        .HasForeignKey("ConfirmedByProviderId");

                    b.HasOne("DAL.Models.AvailableTime", "Date")
                        .WithMany("Appointments")
                        .HasForeignKey("DateId");

                    b.HasOne("DAL.Models.Patient", "Patient")
                        .WithMany("Appointments")
                        .HasForeignKey("PatientId");

                    b.HasOne("DAL.Models.Provider", "PreferredProvider")
                        .WithMany()
                        .HasForeignKey("PreferredProviderId");

                    b.HasOne("DAL.Models.Provider", "Provider")
                        .WithMany("Appointments")
                        .HasForeignKey("ProviderId");
                });

            modelBuilder.Entity("DAL.Models.AvailableTime", b =>
                {
                    b.HasOne("DAL.Models.Provider", "Provider")
                        .WithMany("WorkingHours")
                        .HasForeignKey("ProviderId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("DAL.Models.Consultation", b =>
                {
                    b.HasOne("DAL.Models.Appointment", "Appointment")
                        .WithMany("Consultations")
                        .HasForeignKey("AppointmentId");

                    b.HasOne("DAL.Models.Appointment", "NextAppointment")
                        .WithMany()
                        .HasForeignKey("NextAppointmentId");

                    b.HasOne("DAL.Models.Consultation", "Parent")
                        .WithMany("Children")
                        .HasForeignKey("ParentId");

                    b.HasOne("DAL.Models.Patient", "Patient")
                        .WithMany("Consultations")
                        .HasForeignKey("PatientId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("DAL.Models.Provider", "Provider")
                        .WithMany("Consultations")
                        .HasForeignKey("ProviderId");
                });

            modelBuilder.Entity("DAL.Models.LabTest", b =>
                {
                    b.HasOne("DAL.Models.Consultation", "Consultation")
                        .WithMany("LabTests")
                        .HasForeignKey("ConsultationId");

                    b.HasOne("DAL.Models.Provider", "LabTechnician")
                        .WithMany("LabTests")
                        .HasForeignKey("LabTechnicianId");

                    b.HasOne("DAL.Models.Patient", "Patient")
                        .WithMany("LabTests")
                        .HasForeignKey("PatientId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("DAL.Models.Notification", b =>
                {
                    b.HasOne("DAL.Models.ApplicationUser", "TargetUser")
                        .WithMany("Notifications")
                        .HasForeignKey("TargetUserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("DAL.Models.Patient", b =>
                {
                    b.HasOne("DAL.Models.ApplicationUser", "ApplicationUser")
                        .WithOne()
                        .HasForeignKey("DAL.Models.Patient", "ApplicationUserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("DAL.Models.Provider", b =>
                {
                    b.HasOne("DAL.Models.ApplicationUser", "ApplicationUser")
                        .WithOne()
                        .HasForeignKey("DAL.Models.Provider", "ApplicationUserId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("DAL.Models.Department", "Department")
                        .WithMany("Providers")
                        .HasForeignKey("DepartmentId");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("DAL.Models.ApplicationRole")
                        .WithMany("Claims")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("DAL.Models.ApplicationUser")
                        .WithMany("Claims")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("DAL.Models.ApplicationUser")
                        .WithMany("Logins")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserRole<string>", b =>
                {
                    b.HasOne("DAL.Models.ApplicationRole")
                        .WithMany("Users")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("DAL.Models.ApplicationUser")
                        .WithMany("Roles")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("OpenIddict.Models.OpenIddictAuthorization", b =>
                {
                    b.HasOne("OpenIddict.Models.OpenIddictApplication", "Application")
                        .WithMany("Authorizations")
                        .HasForeignKey("ApplicationId");
                });

            modelBuilder.Entity("OpenIddict.Models.OpenIddictToken", b =>
                {
                    b.HasOne("OpenIddict.Models.OpenIddictApplication", "Application")
                        .WithMany("Tokens")
                        .HasForeignKey("ApplicationId");

                    b.HasOne("OpenIddict.Models.OpenIddictAuthorization", "Authorization")
                        .WithMany("Tokens")
                        .HasForeignKey("AuthorizationId");
                });
        }
    }
}
