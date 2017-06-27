using AutoMapper;
using DAL.Core;
using DAL.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace lazarus.ViewModels
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<ApplicationUser, UserViewModel>()
                .ForMember(d => d.Roles, map => map.Ignore())
                .ReverseMap();

            CreateMap<ApplicationUser, UserEditViewModel>()
                .ForMember(d => d.Roles, map => map.Ignore())
                .ReverseMap();

            CreateMap<ApplicationUser, UserPatchViewModel>()
                .ReverseMap();

            CreateMap<ApplicationRole, RoleViewModel>()
                .ForMember(d => d.Permissions, map => map.MapFrom(s => s.Claims))
                .ForMember(d => d.UsersCount, map => map.ResolveUsing(s => s.Users?.Count ?? 0))
                .ReverseMap();

            CreateMap<IdentityRoleClaim<string>, ClaimViewModel>()
                .ForMember(d => d.Type, map => map.MapFrom(s => s.ClaimType))
                .ForMember(d => d.Value, map => map.MapFrom(s => s.ClaimValue))
                .ReverseMap();

            CreateMap<ApplicationPermission, PermissionViewModel>()
                .ReverseMap();

            CreateMap<IdentityRoleClaim<string>, PermissionViewModel>()
                .ConvertUsing(s => Mapper.Map<PermissionViewModel>(ApplicationPermissions.GetPermissionByValue(s.ClaimValue)));

            CreateMap<Department, DepartmentViewModel>()
                .ReverseMap();

            CreateMap<Notification, NotificationViewModel>()
                .ForMember(d => d.Date, map => map.MapFrom(s => s.DateCreated))
                .ReverseMap();

            CreateMap<Appointment, AppointmentViewModel>()
                .ForMember(d => d.StartDate, map => map.MapFrom(s => s.Date.StartDate))
                .ForMember(d => d.EndDate, map => map.MapFrom(s => s.Date.EndDate))
                .ForMember(d => d.PatientName, map => map.MapFrom(s => s.Patient.ApplicationUser.FriendlyName))
                .ForMember(d => d.PreferredProviderName, map => map.MapFrom(s => s.PreferredProvider.ApplicationUser.FriendlyName))
                .ForMember(d => d.ProviderName, map => map.MapFrom(s => s.Provider.ApplicationUser.FriendlyName))
                .ReverseMap();

            CreateMap<Consultation, ConsultationViewModel>()
                .ForMember(d => d.AppointmentDate, map => map.MapFrom(s => s.Appointment.Date.StartDate))
                .ForMember(d => d.PatientName, map => map.MapFrom(s => s.Patient.ApplicationUser.FriendlyName))
                .ForMember(d => d.ProviderName, map => map.MapFrom(s => s.Provider.ApplicationUser.FriendlyName))
                .ForMember(d => d.Date, map => map.MapFrom(s => s.DateCreated))
                .ReverseMap();

            CreateMap<Provider, ProviderViewModel>()
                .ForMember(d => d.DepartmentName, map => map.MapFrom(s => s.Department.Name))
                .ReverseMap();

            CreateMap<Provider, ProviderEditViewModel>()
                .ReverseMap();

            CreateMap<ProviderWithRoles, ProviderViewModel>()
                .ConvertUsing(s =>
                {
                    var vm = Mapper.Map<ProviderViewModel>(s.Provider);
                    vm.DepartmentName = s.Provider.Department?.Name;
                    vm.ApplicationUser.Roles = s.Roles;

                    return vm;
                });

            CreateMap<Patient, PatientViewModel>()
                .ReverseMap();

            CreateMap<Patient, PatientEditViewModel>()
                .ReverseMap();

            CreateMap<PatientWithRoles, PatientViewModel>()
                .ConvertUsing(s =>
                {
                    var vm = Mapper.Map<PatientViewModel>(s.Patient);
                    vm.ApplicationUser.Roles = s.Roles;


                    return vm;
                });

            CreateMap<AvailableTime, AvailableTimeViewModel>()
                .ForMember(d => d.ProviderName, map => map.MapFrom(s => s.Provider.ApplicationUser.FriendlyName))
                .ReverseMap();

        }
    }
}
