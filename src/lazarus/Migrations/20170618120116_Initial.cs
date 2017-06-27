using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace lazarus.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    Name = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(maxLength: 256, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    AccessFailedCount = table.Column<int>(nullable: false),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    Configuration = table.Column<string>(nullable: true),
                    Email = table.Column<string>(maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(nullable: false),
                    FullName = table.Column<string>(nullable: true),
                    IsEnabled = table.Column<bool>(nullable: false),
                    JobTitle = table.Column<string>(nullable: true),
                    LockoutEnabled = table.Column<bool>(nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(nullable: true),
                    NormalizedEmail = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(maxLength: 256, nullable: true),
                    PasswordHash = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(nullable: false),
                    SecurityStamp = table.Column<string>(nullable: true),
                    TwoFactorEnabled = table.Column<bool>(nullable: false),
                    UserName = table.Column<string>(maxLength: 256, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppDepartments",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    DateCreated = table.Column<DateTime>(nullable: false),
                    DateModified = table.Column<DateTime>(nullable: false),
                    Description = table.Column<string>(maxLength: 500, nullable: true),
                    Icon = table.Column<string>(unicode: false, maxLength: 256, nullable: true),
                    Name = table.Column<string>(maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppDepartments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    LoginProvider = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                });

            migrationBuilder.CreateTable(
                name: "OpenIddictApplications",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    ClientId = table.Column<string>(nullable: true),
                    ClientSecret = table.Column<string>(nullable: true),
                    DisplayName = table.Column<string>(nullable: true),
                    LogoutRedirectUri = table.Column<string>(nullable: true),
                    RedirectUri = table.Column<string>(nullable: true),
                    Type = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OpenIddictApplications", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OpenIddictScopes",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    Description = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OpenIddictScopes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true),
                    RoleId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppNotifications",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Body = table.Column<string>(maxLength: 500, nullable: true),
                    DateCreated = table.Column<DateTime>(nullable: false),
                    DateModified = table.Column<DateTime>(nullable: false),
                    EmailFailedErrorMessage = table.Column<string>(unicode: false, maxLength: 200, nullable: true),
                    EmailSentDate = table.Column<DateTime>(nullable: true),
                    Header = table.Column<string>(maxLength: 100, nullable: true),
                    IsEmailRequired = table.Column<bool>(nullable: false),
                    IsPinned = table.Column<bool>(nullable: false),
                    IsRead = table.Column<bool>(nullable: false),
                    ReferenceId = table.Column<string>(unicode: false, maxLength: 100, nullable: false),
                    TargetUserId = table.Column<string>(nullable: true),
                    Type = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppNotifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppNotifications_AspNetUsers_TargetUserId",
                        column: x => x.TargetUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppPatients",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Address = table.Column<string>(maxLength: 500, nullable: true),
                    ApplicationUserId = table.Column<string>(nullable: false),
                    BloodGroup = table.Column<int>(nullable: false),
                    City = table.Column<string>(maxLength: 50, nullable: true),
                    DateCreated = table.Column<DateTime>(nullable: false),
                    DateModified = table.Column<DateTime>(nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "Date", nullable: true),
                    Gender = table.Column<int>(nullable: false),
                    IsActive = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppPatients", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppPatients_AspNetUsers_ApplicationUserId",
                        column: x => x.ApplicationUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true),
                    UserId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(nullable: false),
                    ProviderKey = table.Column<string>(nullable: false),
                    ProviderDisplayName = table.Column<string>(nullable: true),
                    UserId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    RoleId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppProviders",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Address = table.Column<string>(maxLength: 500, nullable: true),
                    ApplicationUserId = table.Column<string>(nullable: false),
                    City = table.Column<string>(maxLength: 50, nullable: true),
                    DateCreated = table.Column<DateTime>(nullable: false),
                    DateModified = table.Column<DateTime>(nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "Date", nullable: true),
                    DepartmentId = table.Column<int>(nullable: true),
                    Gender = table.Column<int>(nullable: false),
                    IsActive = table.Column<bool>(nullable: false),
                    ServiceId = table.Column<string>(maxLength: 100, nullable: true),
                    WorkPhoneNumber = table.Column<string>(unicode: false, maxLength: 30, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppProviders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppProviders_AspNetUsers_ApplicationUserId",
                        column: x => x.ApplicationUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppProviders_AppDepartments_DepartmentId",
                        column: x => x.DepartmentId,
                        principalTable: "AppDepartments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "OpenIddictAuthorizations",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    ApplicationId = table.Column<string>(nullable: true),
                    Scope = table.Column<string>(nullable: true),
                    Subject = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OpenIddictAuthorizations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OpenIddictAuthorizations_OpenIddictApplications_ApplicationId",
                        column: x => x.ApplicationId,
                        principalTable: "OpenIddictApplications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AppAvailableTimes",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Comment = table.Column<string>(maxLength: 100, nullable: true),
                    DateCreated = table.Column<DateTime>(nullable: false),
                    DateModified = table.Column<DateTime>(nullable: false),
                    EndDate = table.Column<DateTime>(nullable: false),
                    IsBooked = table.Column<bool>(nullable: false),
                    IsReserved = table.Column<bool>(nullable: false),
                    ProviderId = table.Column<int>(nullable: false),
                    StartDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppAvailableTimes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppAvailableTimes_AppProviders_ProviderId",
                        column: x => x.ProviderId,
                        principalTable: "AppProviders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OpenIddictTokens",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    ApplicationId = table.Column<string>(nullable: true),
                    AuthorizationId = table.Column<string>(nullable: true),
                    Subject = table.Column<string>(nullable: true),
                    Type = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OpenIddictTokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OpenIddictTokens_OpenIddictApplications_ApplicationId",
                        column: x => x.ApplicationId,
                        principalTable: "OpenIddictApplications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OpenIddictTokens_OpenIddictAuthorizations_AuthorizationId",
                        column: x => x.AuthorizationId,
                        principalTable: "OpenIddictAuthorizations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AppAppointments",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ConfirmedByProviderId = table.Column<int>(nullable: true),
                    DateCreated = table.Column<DateTime>(nullable: false),
                    DateId = table.Column<int>(nullable: true),
                    DateModified = table.Column<DateTime>(nullable: false),
                    IsCritical = table.Column<bool>(nullable: false),
                    PatientId = table.Column<int>(nullable: false),
                    PreferredDate = table.Column<DateTime>(nullable: false),
                    PreferredProviderId = table.Column<int>(nullable: true),
                    ProviderId = table.Column<int>(nullable: true),
                    Status = table.Column<int>(nullable: false),
                    Symptoms = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppAppointments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppAppointments_AppProviders_ConfirmedByProviderId",
                        column: x => x.ConfirmedByProviderId,
                        principalTable: "AppProviders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AppAppointments_AppAvailableTimes_DateId",
                        column: x => x.DateId,
                        principalTable: "AppAvailableTimes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AppAppointments_AppPatients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "AppPatients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AppAppointments_AppProviders_PreferredProviderId",
                        column: x => x.PreferredProviderId,
                        principalTable: "AppProviders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AppAppointments_AppProviders_ProviderId",
                        column: x => x.ProviderId,
                        principalTable: "AppProviders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AppConsultations",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    AppointmentId = table.Column<int>(nullable: true),
                    Comments = table.Column<string>(nullable: true),
                    DateCreated = table.Column<DateTime>(nullable: false),
                    DateModified = table.Column<DateTime>(nullable: false),
                    NextAppointmentId = table.Column<int>(nullable: true),
                    ParentId = table.Column<int>(nullable: true),
                    PatientId = table.Column<int>(nullable: false),
                    Prescriptions = table.Column<string>(nullable: true),
                    Prognosis = table.Column<string>(nullable: true),
                    ProviderId = table.Column<int>(nullable: false),
                    Symptoms = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppConsultations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppConsultations_AppAppointments_AppointmentId",
                        column: x => x.AppointmentId,
                        principalTable: "AppAppointments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AppConsultations_AppAppointments_NextAppointmentId",
                        column: x => x.NextAppointmentId,
                        principalTable: "AppAppointments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AppConsultations_AppConsultations_ParentId",
                        column: x => x.ParentId,
                        principalTable: "AppConsultations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AppConsultations_AppPatients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "AppPatients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppConsultations_AppProviders_ProviderId",
                        column: x => x.ProviderId,
                        principalTable: "AppProviders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AppLabTests",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ConsultationId = table.Column<int>(nullable: true),
                    DateCreated = table.Column<DateTime>(nullable: false),
                    DateModified = table.Column<DateTime>(nullable: false),
                    LabComments = table.Column<string>(nullable: true),
                    LabTechnicianId = table.Column<int>(nullable: true),
                    PatientId = table.Column<int>(nullable: false),
                    PhysicianComments = table.Column<string>(nullable: true),
                    Request = table.Column<string>(nullable: true),
                    Result = table.Column<string>(nullable: true),
                    Title = table.Column<string>(maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppLabTests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppLabTests_AppConsultations_ConsultationId",
                        column: x => x.ConsultationId,
                        principalTable: "AppConsultations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AppLabTests_AppProviders_LabTechnicianId",
                        column: x => x.LabTechnicianId,
                        principalTable: "AppProviders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AppLabTests_AppPatients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "AppPatients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppAppointments_ConfirmedByProviderId",
                table: "AppAppointments",
                column: "ConfirmedByProviderId");

            migrationBuilder.CreateIndex(
                name: "IX_AppAppointments_DateCreated",
                table: "AppAppointments",
                column: "DateCreated");

            migrationBuilder.CreateIndex(
                name: "IX_AppAppointments_DateId",
                table: "AppAppointments",
                column: "DateId");

            migrationBuilder.CreateIndex(
                name: "IX_AppAppointments_DateModified",
                table: "AppAppointments",
                column: "DateModified");

            migrationBuilder.CreateIndex(
                name: "IX_AppAppointments_PatientId",
                table: "AppAppointments",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_AppAppointments_PreferredProviderId",
                table: "AppAppointments",
                column: "PreferredProviderId");

            migrationBuilder.CreateIndex(
                name: "IX_AppAppointments_ProviderId",
                table: "AppAppointments",
                column: "ProviderId");

            migrationBuilder.CreateIndex(
                name: "IX_AppAvailableTimes_DateCreated",
                table: "AppAvailableTimes",
                column: "DateCreated");

            migrationBuilder.CreateIndex(
                name: "IX_AppAvailableTimes_DateModified",
                table: "AppAvailableTimes",
                column: "DateModified");

            migrationBuilder.CreateIndex(
                name: "IX_AppAvailableTimes_EndDate",
                table: "AppAvailableTimes",
                column: "EndDate");

            migrationBuilder.CreateIndex(
                name: "IX_AppAvailableTimes_IsBooked",
                table: "AppAvailableTimes",
                column: "IsBooked");

            migrationBuilder.CreateIndex(
                name: "IX_AppAvailableTimes_IsReserved",
                table: "AppAvailableTimes",
                column: "IsReserved");

            migrationBuilder.CreateIndex(
                name: "IX_AppAvailableTimes_ProviderId",
                table: "AppAvailableTimes",
                column: "ProviderId");

            migrationBuilder.CreateIndex(
                name: "IX_AppAvailableTimes_StartDate",
                table: "AppAvailableTimes",
                column: "StartDate");

            migrationBuilder.CreateIndex(
                name: "IX_AppConsultations_AppointmentId",
                table: "AppConsultations",
                column: "AppointmentId");

            migrationBuilder.CreateIndex(
                name: "IX_AppConsultations_DateCreated",
                table: "AppConsultations",
                column: "DateCreated");

            migrationBuilder.CreateIndex(
                name: "IX_AppConsultations_DateModified",
                table: "AppConsultations",
                column: "DateModified");

            migrationBuilder.CreateIndex(
                name: "IX_AppConsultations_NextAppointmentId",
                table: "AppConsultations",
                column: "NextAppointmentId");

            migrationBuilder.CreateIndex(
                name: "IX_AppConsultations_ParentId",
                table: "AppConsultations",
                column: "ParentId");

            migrationBuilder.CreateIndex(
                name: "IX_AppConsultations_PatientId",
                table: "AppConsultations",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_AppConsultations_ProviderId",
                table: "AppConsultations",
                column: "ProviderId");

            migrationBuilder.CreateIndex(
                name: "IX_AppDepartments_DateCreated",
                table: "AppDepartments",
                column: "DateCreated");

            migrationBuilder.CreateIndex(
                name: "IX_AppDepartments_DateModified",
                table: "AppDepartments",
                column: "DateModified");

            migrationBuilder.CreateIndex(
                name: "IX_AppDepartments_Name",
                table: "AppDepartments",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_AppLabTests_ConsultationId",
                table: "AppLabTests",
                column: "ConsultationId");

            migrationBuilder.CreateIndex(
                name: "IX_AppLabTests_DateCreated",
                table: "AppLabTests",
                column: "DateCreated");

            migrationBuilder.CreateIndex(
                name: "IX_AppLabTests_DateModified",
                table: "AppLabTests",
                column: "DateModified");

            migrationBuilder.CreateIndex(
                name: "IX_AppLabTests_LabTechnicianId",
                table: "AppLabTests",
                column: "LabTechnicianId");

            migrationBuilder.CreateIndex(
                name: "IX_AppLabTests_PatientId",
                table: "AppLabTests",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_AppNotifications_DateCreated",
                table: "AppNotifications",
                column: "DateCreated");

            migrationBuilder.CreateIndex(
                name: "IX_AppNotifications_DateModified",
                table: "AppNotifications",
                column: "DateModified");

            migrationBuilder.CreateIndex(
                name: "IX_AppNotifications_IsPinned",
                table: "AppNotifications",
                column: "IsPinned");

            migrationBuilder.CreateIndex(
                name: "IX_AppNotifications_TargetUserId",
                table: "AppNotifications",
                column: "TargetUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AppPatients_ApplicationUserId",
                table: "AppPatients",
                column: "ApplicationUserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppPatients_BloodGroup",
                table: "AppPatients",
                column: "BloodGroup");

            migrationBuilder.CreateIndex(
                name: "IX_AppPatients_DateCreated",
                table: "AppPatients",
                column: "DateCreated");

            migrationBuilder.CreateIndex(
                name: "IX_AppPatients_DateModified",
                table: "AppPatients",
                column: "DateModified");

            migrationBuilder.CreateIndex(
                name: "IX_AppPatients_DateOfBirth",
                table: "AppPatients",
                column: "DateOfBirth");

            migrationBuilder.CreateIndex(
                name: "IX_AppPatients_Gender",
                table: "AppPatients",
                column: "Gender");

            migrationBuilder.CreateIndex(
                name: "IX_AppPatients_IsActive",
                table: "AppPatients",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_AppProviders_ApplicationUserId",
                table: "AppProviders",
                column: "ApplicationUserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppProviders_DateCreated",
                table: "AppProviders",
                column: "DateCreated");

            migrationBuilder.CreateIndex(
                name: "IX_AppProviders_DateModified",
                table: "AppProviders",
                column: "DateModified");

            migrationBuilder.CreateIndex(
                name: "IX_AppProviders_DepartmentId",
                table: "AppProviders",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_AppProviders_Gender",
                table: "AppProviders",
                column: "Gender");

            migrationBuilder.CreateIndex(
                name: "IX_AppProviders_IsActive",
                table: "AppProviders",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_AppProviders_ServiceId",
                table: "AppProviders",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_OpenIddictApplications_ClientId",
                table: "OpenIddictApplications",
                column: "ClientId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OpenIddictAuthorizations_ApplicationId",
                table: "OpenIddictAuthorizations",
                column: "ApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_OpenIddictTokens_ApplicationId",
                table: "OpenIddictTokens",
                column: "ApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_OpenIddictTokens_AuthorizationId",
                table: "OpenIddictTokens",
                column: "AuthorizationId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppLabTests");

            migrationBuilder.DropTable(
                name: "AppNotifications");

            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "OpenIddictScopes");

            migrationBuilder.DropTable(
                name: "OpenIddictTokens");

            migrationBuilder.DropTable(
                name: "AppConsultations");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "OpenIddictAuthorizations");

            migrationBuilder.DropTable(
                name: "AppAppointments");

            migrationBuilder.DropTable(
                name: "OpenIddictApplications");

            migrationBuilder.DropTable(
                name: "AppAvailableTimes");

            migrationBuilder.DropTable(
                name: "AppPatients");

            migrationBuilder.DropTable(
                name: "AppProviders");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "AppDepartments");
        }
    }
}
