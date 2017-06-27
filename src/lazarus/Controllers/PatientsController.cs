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
using DAL.Core;

namespace lazarus.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class PatientsController : Controller
    {
        readonly IUnitOfWork _unitOfWork;
        readonly ILogger _logger;

        private const string GetPatientByIdActionName = "GetPatientById";


        public PatientsController(IUnitOfWork unitOfWork, ILogger<PatientsController> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }



        [HttpGet("{id}", Name = GetPatientByIdActionName)]
        [Produces(typeof(PatientViewModel))]
        public IActionResult GetPatientById(int id)
        {
            var patient = _unitOfWork.Patients.GetPatient(id);

            if (patient != null)
                return Ok(Mapper.Map<PatientViewModel>(patient));
            else
                return NotFound(id);
        }



        [HttpGet("me")]
        [Produces(typeof(PatientViewModel))]
        public IActionResult GetCurrentUserPatient()
        {
            string userId = Utilities.GetUserId(this.User);

            return GetPatientByUserId(userId);
        }



        [HttpGet("{userId:guid}")]
        [Produces(typeof(PatientViewModel))]
        public IActionResult GetPatientByUserId(string userId)
        {
            var patient = _unitOfWork.Patients.GetPatientByUserId(userId);

            if (patient != null)
                return Ok(Mapper.Map<PatientViewModel>(patient));
            else
                return NotFound(userId);
        }



        [HttpGet("{page:int?}/{pageSize:int?}")]
        [Produces(typeof(List<PatientViewModel>))]
        public IActionResult GetAllPatients(int? page, int? pageSize)
        {
            int? page_ = page < 0 ? (int?)null : page;
            int? pageSize_ = pageSize < 0 ? (int?)null : pageSize;
            var patientVMs = Mapper.Map<List<PatientViewModel>>(_unitOfWork.Patients.GetAllPatients(page_, pageSize_));

            return Ok(patientVMs);
        }




        [HttpPost]
        public IActionResult CreatePatient([FromBody]PatientEditViewModel patientVM)
        {
            if (ModelState.IsValid)
            {
                if (patientVM == null)
                    return BadRequest($"{nameof(patientVM)} cannot be null");


                PatientWithRoles patientWithRoles = _unitOfWork.Patients.GetPatientByUserId(patientVM.ApplicationUserId);
                Patient patient;

                if (patientWithRoles != null)
                {
                    int idBackup = patientWithRoles.Patient.Id;

                    patient = patientWithRoles.Patient;
                    Mapper.Map<PatientEditViewModel, Patient>(patientVM, patient);
                    patient.Id = idBackup;
                    patient.IsActive = true;
                    patient.DateModified = DateTime.UtcNow;
                }
                else
                {
                    patient = Mapper.Map<Patient>(patientVM);
                    patient.IsActive = true;
                    patient.DateCreated = patient.DateModified = DateTime.UtcNow;
                    _unitOfWork.Patients.Add(patient);
                }

                _unitOfWork.SaveChanges();

                patientWithRoles = _unitOfWork.Patients.GetPatientByUserId(patient.ApplicationUserId);
                var patientResultVM = Mapper.Map<PatientViewModel>(patientWithRoles);

                return CreatedAtAction(GetPatientByIdActionName, new { id = patientResultVM.Id }, patientResultVM);
            }

            return BadRequest(ModelState);
        }



        [HttpPut("{id}")]
        //Security: Test if user has permission to assign assigned roles
        public IActionResult UpdatePatient(int id, [FromBody]PatientEditViewModel patientVM)
        {
            if (ModelState.IsValid)
            {
                if (patientVM == null)
                    return BadRequest($"{nameof(patientVM)} cannot be null");

                if (patientVM.Id != 0 && id != patientVM.Id)
                    return BadRequest("Conflicting patient id in parameter and model data");


                Patient patient = _unitOfWork.Patients.Get(id);

                if (patient == null)
                    return NotFound(id);


                Mapper.Map<PatientEditViewModel, Patient>(patientVM, patient);
                patient.DateModified = DateTime.UtcNow;

                _unitOfWork.SaveChanges();

                return NoContent();
            }

            return BadRequest(ModelState);
        }



        [HttpDelete("{id}")]
        [Produces(typeof(PatientViewModel))]
        public IActionResult DeletePatient(int id)
        {
            if (!_unitOfWork.Patients.TestCanDeletePatient(id))
                return BadRequest("Patient cannot be deleted. Remove all dependencies and try again");


            Patient patient = _unitOfWork.Patients.Get(id);

            if (patient == null)
                return NotFound(id);

            PatientViewModel patientVM = Mapper.Map<PatientViewModel>(patient);

            _unitOfWork.Patients.Remove(patient); //Todo: Delete user account too
            _unitOfWork.SaveChanges();

            return Ok(patientVM);
        }



        [HttpGet("roles/{page:int?}/{pageSize:int?}")]
        [Produces(typeof(List<RoleViewModel>))]
        public IActionResult GetNonAdminPatientRoles(int? page, int? pageSize)
        {
            int? page_ = page < 0 ? (int?)null : page;
            int? pageSize_ = pageSize < 0 ? (int?)null : pageSize;
            var roleVMs = Mapper.Map<List<RoleViewModel>>(_unitOfWork.Patients.GetNonAdminPatientRoles(page_, pageSize_));

            return Ok(roleVMs);
        }




        private void AddErrors(IEnumerable<string> errors)
        {
            foreach (var error in errors)
            {
                ModelState.AddModelError(string.Empty, error);
            }
        }

    }
}
