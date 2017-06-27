using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DAL;
using lazarus.ViewModels;
using AutoMapper;
using DAL.Models;
using lazarus.Helpers;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using DAL.Core;
using Microsoft.AspNetCore.Http;

namespace lazarus.Controllers
{
    [Authorize]
    //[Route("api/[controller]/[action]")]
    [Route("api/[controller]")]
    public class AppointmentsController : Controller
    {
        readonly IUnitOfWork _unitOfWork;
        readonly ILogger _logger;

        Patient __patient;
        Provider __provider;

        private const string GetAppointmentByIdActionName = "GetAppointmentById";


        public AppointmentsController(IUnitOfWork unitOfWork, ILogger<AppointmentsController> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }



        [HttpGet("Test")]
        public IActionResult Test()
        {
            return Ok(EmailSender.SendTestEmail());
        }



        [HttpGet("Test2/{id}")]
        [Produces(typeof(AppointmentViewModel))]
        public IActionResult Test2(int id)
        {
            var appointment = _unitOfWork.Appointments.GetAppointmentsByPatientId(id);

            return Ok(appointment);
        }



        [HttpGet("{id}", Name = GetAppointmentByIdActionName)]
        [Produces(typeof(AppointmentViewModel))]
        public IActionResult GetAppointmentById(int id)
        {
            var appointment = _unitOfWork.Appointments.Get(id);

            if (appointment != null)
                return Ok(Mapper.Map<Appointment, AppointmentViewModel>(appointment,
                    opt => opt.AfterMap((s, d) => SetUserRole(s, d))));
            else
                return NotFound(id);
        }



        [HttpGet("{page:int}/{pageSize:int}")]
        [Produces(typeof(List<AppointmentViewModel>))]
        public IActionResult GetAllUpcomingAppointments(int page, int pageSize)
        {
            int? page_ = page < 0 ? (int?)null : page;
            int? pageSize_ = pageSize < 0 ? (int?)null : pageSize;

            var appointmentVMs = Mapper.Map<List<AppointmentViewModel>>(_unitOfWork.Appointments.GetAllUpcomingAppointments(page_, pageSize_),
                opt => opt.AfterMap((s, d) => SetUserRole(s, d)));

            return Ok(appointmentVMs);
        }



        [HttpGet("{userId:guid?}/{page:int?}/{pageSize:int?}")]
        [Produces(typeof(List<AppointmentViewModel>))]
        public IActionResult GetUserUpcomingAppointments(string userId, int? page, int? pageSize)
        {
            int? page_ = page < 0 ? (int?)null : page;
            int? pageSize_ = pageSize < 0 ? (int?)null : pageSize;

            if (string.IsNullOrWhiteSpace(userId))
                userId = Utilities.GetUserId(this.User);

            var appointmentVMs = Mapper.Map<List<AppointmentViewModel>>(_unitOfWork.Appointments.GetUserUpcomingAppointments(userId, page_, pageSize_),
                opt => opt.AfterMap((s, d) => SetUserRole(s, d)));

            return Ok(appointmentVMs);
        }



        [HttpGet("today/{userId:guid?}/{page:int?}/{pageSize:int?}")]
        [Produces(typeof(List<AppointmentViewModel>))]
        public IActionResult GetUserTodayAppointments(string userId, int? page, int? pageSize)
        {
            int? page_ = page < 0 ? (int?)null : page;
            int? pageSize_ = pageSize < 0 ? (int?)null : pageSize;

            if (string.IsNullOrWhiteSpace(userId))
                userId = Utilities.GetUserId(this.User);

            var appointmentVMs = Mapper.Map<List<AppointmentViewModel>>(_unitOfWork.Appointments.GetUserAppointmentsForToday(userId),
                opt => opt.AfterMap((s, d) => SetUserRole(s, d)));

            return Ok(appointmentVMs);
        }



        [HttpGet("all/{page:int}/{pageSize:int}")]
        [Produces(typeof(List<AppointmentViewModel>))]
        public IActionResult GetAllAppointments(int page, int pageSize)
        {
            int? page_ = page < 0 ? (int?)null : page;
            int? pageSize_ = pageSize < 0 ? (int?)null : pageSize;

            var appointmentVMs = Mapper.Map<List<AppointmentViewModel>>(_unitOfWork.Appointments.GetAllAppointments(page_, pageSize_),
                opt => opt.AfterMap((s, d) => SetUserRole(s, d)));

            return Ok(appointmentVMs);
        }



        [HttpGet("all/{userId:guid?}/{page:int?}/{pageSize:int?}")]
        [Produces(typeof(List<AppointmentViewModel>))]
        public IActionResult GetAllUserAppointments(string userId, int? page, int? pageSize)
        {
            int? page_ = page < 0 ? (int?)null : page;
            int? pageSize_ = pageSize < 0 ? (int?)null : pageSize;

            if (string.IsNullOrWhiteSpace(userId))
                userId = Utilities.GetUserId(this.User);

            var appointmentVMs = Mapper.Map<List<AppointmentViewModel>>(_unitOfWork.Appointments.GetUserAllAppointments(userId, page_, pageSize_),
                opt => opt.AfterMap((s, d) => SetUserRole(s, d)));

            return Ok(appointmentVMs);
        }



        [HttpPost]
        public IActionResult CreateAppointment([FromBody]AppointmentViewModel appointmentVM)
        {
            if (ModelState.IsValid)
            {
                if (appointmentVM == null) //Todo check whether it is ever null
                    return BadRequest($"{nameof(appointmentVM)} cannot be null");

                PatientWithRoles patientWithRoles = _unitOfWork.Patients.GetPatient(appointmentVM.PatientId);

                if (patientWithRoles == null)
                    return BadRequest($"Patient with the ID {nameof(appointmentVM.PatientId)} does not exist");


                Appointment appointment = Mapper.Map<Appointment>(appointmentVM);
                appointment.Patient = patientWithRoles.Patient;
                appointment.DateModified = appointment.DateCreated = DateTime.UtcNow;

                BookAppointment(appointment, patientWithRoles.Patient);

                _unitOfWork.SaveChanges();

                appointmentVM = Mapper.Map<Appointment, AppointmentViewModel>(appointment,
                    opt => opt.AfterMap((s, d) => SetUserRole(s, d)));

                if (appointmentVM.Status != AppointmentStatus.Rejected)
                    return CreatedAtAction(GetAppointmentByIdActionName, new { id = appointmentVM.Id }, appointmentVM);
                else
                    return Ok(appointmentVM);
            }

            return BadRequest(ModelState);
        }




        [HttpPut("{id}")]
        public IActionResult UpdateAppointment(int id, [FromBody]AppointmentViewModel appointmentVM)
        {
            if (ModelState.IsValid)
            {
                if (appointmentVM == null)
                    return BadRequest($"{nameof(appointmentVM)} cannot be null");

                if (appointmentVM.Id != 0 && id != appointmentVM.Id)
                    return BadRequest("Conflicting appointment id in parameter and model data");


                Appointment appointment = _unitOfWork.Appointments.GetAppointment(id);

                if (appointment == null)
                    return NotFound(id);

                bool requiresRebooking = false;

                if (appointment.Status != AppointmentStatus.Cancelled)
                {
                    requiresRebooking = appointment.PreferredDate != appointmentVM.PreferredDate || appointment.PreferredProviderId != appointmentVM.PreferredProviderId;

                    Mapper.Map<AppointmentViewModel, Appointment>(appointmentVM, appointment);
                    appointment.DateModified = DateTime.UtcNow;

                    if (requiresRebooking)
                        BookAppointment(appointment, appointment.Patient);
                }
                else if (appointment.DateId.HasValue)
                {
                    _unitOfWork.Providers.ReleaseProviderTime(appointment.DateId.Value);
                }


                _unitOfWork.SaveChanges();

                //Todo: Zorah: - Send notifications for updates if date has changed or appointment is cancelled/ rescheduled

                if (requiresRebooking)
                {
                    appointmentVM = Mapper.Map<Appointment, AppointmentViewModel>(appointment,
                        opt => opt.AfterMap((s, d) => SetUserRole(s, d)));

                    return Ok(appointmentVM);
                }
                else
                {
                    return NoContent();
                }
            }

            return BadRequest(ModelState);
        }



        [HttpDelete("{id}")]
        [Produces(typeof(AppointmentViewModel))]
        public IActionResult DeleteAppointment(int id)
        {
            if (!_unitOfWork.Appointments.TestCanDeleteAppointment(id))
                return BadRequest("Appointment cannot be deleted. Remove all dependencies and try again");

            Appointment appointment = _unitOfWork.Appointments.Get(id);

            if (appointment == null)
                return NotFound(id);

            if (appointment.Date?.StartDate > DateTime.UtcNow)
                _unitOfWork.Providers.ReleaseProviderTime(appointment.DateId.Value);

            AppointmentViewModel appointmentVM = Mapper.Map<Appointment, AppointmentViewModel>(appointment,
                opt => opt.AfterMap((s, d) => SetUserRole(s, d)));

            _unitOfWork.Appointments.Remove(appointment);
            _unitOfWork.SaveChanges();

            return Ok(appointmentVM);
        }



        private void BookAppointment(Appointment appointment, Patient patient)
        {
            //int? oldAppointmentDateId = appointment.DateId; //Todo: Change notification message when appointment is being updated/rescheduled

            (ProviderWithRoles providerWithRoles, AvailableTime availableTime)? availableProvider = _unitOfWork.Providers.FindAvailableProvider(appointment);


            if (SystemConfigurations.AutoProcessAppointments && availableProvider != null)
            {
                availableProvider.Value.availableTime.DateModified = DateTime.UtcNow;
                availableProvider.Value.availableTime.IsBooked = true;

                appointment.Provider = availableProvider.Value.providerWithRoles.Provider;
                appointment.Date = availableProvider.Value.availableTime;
                appointment.Status = AppointmentStatus.Confirmed;

                Notification patientNotification = new Notification()
                {
                    ReferenceId = SystemConfigurations.SystemIDs.AppointmentNotifications,
                    Header = NotificationMessages.GetPatientAppointmentConfirmedHeader(appointment.Date.StartDate),
                    Body = NotificationMessages.GetPatientAppointmentConfirmedMessage(appointment.Provider.ApplicationUser.FriendlyName, appointment.Date.StartDate, appointment.DateCreated),
                    IsEmailRequired = true,
                    Type = NotificationType.AppointmentConfirmed,
                    TargetUser = patient.ApplicationUser,
                    DateCreated = appointment.DateCreated,
                    DateModified = appointment.DateModified
                };

                string patientNotificationEmail = EmailTemplates.GetAppointmentConfirmationEmailForPatient(
                    appointment.Patient.ApplicationUser.FriendlyName,
                    appointment.Provider.ApplicationUser.FriendlyName,
                    appointment.Date.StartDate,
                    appointment.DateCreated);



                Notification providerNotification = new Notification()
                {
                    ReferenceId = SystemConfigurations.SystemIDs.AppointmentNotifications,
                    Header = NotificationMessages.GetProviderAppointmentConfirmedHeader(appointment.Date.StartDate),
                    Body = NotificationMessages.GetProviderAppointmentConfirmedMessage(patient.ApplicationUser.FriendlyName, appointment.Date.StartDate),
                    IsEmailRequired = true,
                    Type = NotificationType.AppointmentConfirmed,
                    TargetUser = appointment.Provider.ApplicationUser,
                    DateCreated = appointment.DateCreated,
                    DateModified = appointment.DateModified
                };

                string providerNotificationEmail = EmailTemplates.GetAppointmentConfirmationEmailForDoctor(
                    appointment.Patient.ApplicationUser.FriendlyName,
                    appointment.Provider.ApplicationUser.FriendlyName,
                    appointment.Date.StartDate,
                    appointment.DateCreated);


                if (appointment.Id < 1)
                    _unitOfWork.Appointments.Add(appointment);

                _unitOfWork.Notifications.Add(patientNotification);
                _unitOfWork.Notifications.Add(providerNotification);
                _unitOfWork.SaveChanges();

                Task.Run(() => EmailSender.SendEmailAsync(patientNotification, patientNotificationEmail));
                Task.Run(() => EmailSender.SendEmailAsync(providerNotification, providerNotificationEmail));
            }
            else if (SystemConfigurations.ManualProcessAppointments)
            {
                appointment.Status = AppointmentStatus.PendingApproval;
                //Todo: Add nurse notification for manual assignment
            }
            else
            {
                appointment.Status = AppointmentStatus.Rejected;
            }
        }


        private void SetUserRole(Appointment appointment, AppointmentViewModel appointmentVM) => appointmentVM.Role = GetAppointmentRole(appointment);




        private void SetUserRole(object source, object destination)
        {
            List<Appointment> appointments = (List<Appointment>)source;
            List<AppointmentViewModel> appointmentVMs = (List<AppointmentViewModel>)destination;

            if (appointments.Count != appointmentVMs.Count)
                throw new InvalidOperationException($"ItemCount in {nameof(source)} is different from ItemCount in {nameof(destination)}");


            for (int i = 0; i < appointments.Count; i++)
            {
                SetUserRole(appointments[i], appointmentVMs[i]);
            }
        }



        private AppointmentRole GetAppointmentRole(Appointment appointment)
        {
            if (CurrentPatient?.Id == appointment.PatientId)
                return AppointmentRole.Client;

            if (CurrentProvider?.Id == appointment.ProviderId)
                return AppointmentRole.Consultant;

            return AppointmentRole.None;
        }


        private void AddErrors(IEnumerable<string> errors)
        {
            foreach (var error in errors)
            {
                ModelState.AddModelError(string.Empty, error);
            }
        }



        public Patient CurrentPatient
        {
            get
            {
                if (__patient == null)
                {
                    __patient = _unitOfWork.Patients.GetPatientByUserId(Utilities.GetUserId(this.User))?.Patient;

                    if (__patient == null)
                        __patient = new Patient();
                }

                return __patient.Id > 0 ? __patient : null;
            }
        }

        public Provider CurrentProvider
        {
            get
            {
                if (__provider == null)
                {
                    __provider = _unitOfWork.Providers.GetProviderByUserId(Utilities.GetUserId(this.User))?.Provider;

                    if (__provider == null)
                        __provider = new Provider();
                }

                return __provider.Id > 0 ? __provider : null;
            }
        }
    }
}
