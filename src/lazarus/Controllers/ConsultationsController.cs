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
    public class ConsultationsController : Controller
    {
        readonly IUnitOfWork _unitOfWork;
        readonly ILogger _logger;

        Patient __patient;
        Provider __provider;

        private const string GetConsultationByIdActionName = "GetConsultationById";


        public ConsultationsController(IUnitOfWork unitOfWork, ILogger<ConsultationsController> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }


        [HttpGet("{id}", Name = GetConsultationByIdActionName)]
        [Produces(typeof(ConsultationViewModel))]
        public IActionResult GetConsultationById(int id)
        {
            var consultation = _unitOfWork.Consultations.GetConsultation(id);

            if (consultation != null)
                return Ok(Mapper.Map<ConsultationViewModel>(consultation));
            else
                return NotFound(id);
        }



        [HttpGet("appointment/{appointmentId:int}")]
        [Produces(typeof(List<ConsultationViewModel>))]
        public IActionResult GetConsultationsForAppointment(int appointmentId)
        {
            var consultations = _unitOfWork.Consultations.GetConsultationsByAppointmentId(appointmentId);
            var consultationVMs = Mapper.Map<List<ConsultationViewModel>>(consultations);

            return Ok(consultationVMs);
        }



        [HttpGet("provider/{providerId:int?}/{page:int?}/{pageSize:int?}")]
        [Produces(typeof(List<ConsultationViewModel>))]
        public IActionResult GetProviderConsultations(int? providerId, int? page, int? pageSize)
        {
            int? page_ = page < 0 ? (int?)null : page;
            int? pageSize_ = pageSize < 0 ? (int?)null : pageSize;

            if (providerId == null)
            {
                if (CurrentProvider == null)
                    return NotFound();
                else
                    providerId = CurrentProvider.Id;
            }

            var consultations = _unitOfWork.Consultations.GetProviderConsultations(providerId.Value, page_, pageSize_);
            var consultationVMs = Mapper.Map<List<ConsultationViewModel>>(consultations);

            return Ok(consultationVMs);
        }



        [HttpGet("provider/{userId:guid}/{page:int?}/{pageSize:int?}")]
        [Produces(typeof(List<ConsultationViewModel>))]
        public IActionResult GetProviderConsultations(string userId, int? page, int? pageSize)
        {
            int? page_ = page < 0 ? (int?)null : page;
            int? pageSize_ = pageSize < 0 ? (int?)null : pageSize;

            if (string.IsNullOrWhiteSpace(userId))
                userId = Utilities.GetUserId(this.User);

            var consultations = _unitOfWork.Consultations.GetProviderConsultations(userId, page_, pageSize_);
            var consultationVMs = Mapper.Map<List<ConsultationViewModel>>(consultations);

            return Ok(consultationVMs);
        }



        [HttpGet("patient/{patientId:int?}/{page:int?}/{pageSize:int?}")]
        [Produces(typeof(List<ConsultationViewModel>))]
        public IActionResult GetPatientHistory(int? patientId, int? page, int? pageSize)
        {
            int? page_ = page < 0 ? (int?)null : page;
            int? pageSize_ = pageSize < 0 ? (int?)null : pageSize;

            if (patientId == null)
            {
                if (CurrentPatient == null)
                    return NotFound();
                else
                    patientId = CurrentPatient.Id;
            }

            var consultations = _unitOfWork.Consultations.GetPatientHistory(patientId.Value, page_, pageSize_);
            var consultationVMs = Mapper.Map<List<ConsultationViewModel>>(consultations);

            return Ok(consultationVMs);
        }



        [HttpGet("patient/{userId:guid}/{page:int?}/{pageSize:int?}")]
        [Produces(typeof(List<ConsultationViewModel>))]
        public IActionResult GetPatientHistory(string userId, int? page, int? pageSize)
        {
            int? page_ = page < 0 ? (int?)null : page;
            int? pageSize_ = pageSize < 0 ? (int?)null : pageSize;

            if (string.IsNullOrWhiteSpace(userId))
                userId = Utilities.GetUserId(this.User);

            var consultations = _unitOfWork.Consultations.GetPatientHistory(userId, page_, pageSize_);
            var consultationVMs = Mapper.Map<List<ConsultationViewModel>>(consultations);

            return Ok(consultationVMs);
        }



        [HttpGet]
        [Produces(typeof(List<ConsultationViewModel>))]
        public IActionResult GetAllConsultations()
        {
            return GetAllConsultations(1, 1000);
        }



        [HttpGet("{page:int}/{pageSize:int}")]
        [Produces(typeof(List<ConsultationViewModel>))]
        public IActionResult GetAllConsultations(int page, int pageSize)
        {
            int? page_ = page < 0 ? (int?)null : page;
            int? pageSize_ = pageSize < 0 ? (int?)null : pageSize;

            var consultationVMs = Mapper.Map<List<ConsultationViewModel>>(_unitOfWork.Consultations.GetAllConsultations(page_, pageSize_));

            return Ok(consultationVMs);
        }



        [HttpPost]
        public IActionResult CreateConsultation([FromBody]ConsultationViewModel consultationVM)
        {
            if (ModelState.IsValid)
            {
                if (consultationVM == null)
                    return BadRequest($"{nameof(consultationVM)} cannot be null");

                Consultation consultation = Mapper.Map<Consultation>(consultationVM);
                consultation.DateModified = consultation.DateCreated = DateTime.UtcNow;

                _unitOfWork.Consultations.Add(consultation);
                _unitOfWork.SaveChanges();

                consultationVM = Mapper.Map<ConsultationViewModel>(consultation);

                return CreatedAtAction(GetConsultationByIdActionName, new { id = consultationVM.Id }, consultationVM);
            }

            return BadRequest(ModelState);
        }




        [HttpPut("{id}")]
        public IActionResult UpdateConsultation(int id, [FromBody]ConsultationViewModel consultationVM)
        {
            if (ModelState.IsValid)
            {
                if (consultationVM == null)
                    return BadRequest($"{nameof(consultationVM)} cannot be null");

                if (consultationVM.Id != 0 && id != consultationVM.Id)
                    return BadRequest("Conflicting consultation id in parameter and model data");


                Consultation consultation = _unitOfWork.Consultations.GetConsultation(id);

                if (consultation == null)
                    return NotFound(id);


                Mapper.Map<ConsultationViewModel, Consultation>(consultationVM, consultation);
                consultation.Id = id;
                consultation.DateModified = DateTime.UtcNow;

                _unitOfWork.SaveChanges();

                return NoContent();
            }

            return BadRequest(ModelState);
        }



        [HttpDelete("{id}")]
        [Produces(typeof(ConsultationViewModel))]
        public IActionResult DeleteConsultation(int id)
        {
            if (!_unitOfWork.Consultations.TestCanDeleteConsultation(id))
                return BadRequest("Consultation cannot be deleted. Remove all dependencies and try again");

            Consultation consultation = _unitOfWork.Consultations.Get(id);

            if (consultation == null)
                return NotFound(id);

            ConsultationViewModel consultationVM = Mapper.Map<Consultation, ConsultationViewModel>(consultation);

            _unitOfWork.Consultations.Remove(consultation);
            _unitOfWork.SaveChanges();

            return Ok(consultationVM);
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
