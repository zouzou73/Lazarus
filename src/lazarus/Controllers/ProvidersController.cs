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
    public class ProvidersController : Controller
    {
        readonly IUnitOfWork _unitOfWork;
        readonly ILogger _logger;

        private const string GetProviderByIdActionName = "GetProviderById";
        private const string GetWorkingHoursByProviderIdActionName = "GetWorkingHoursByProviderId";


        public ProvidersController(IUnitOfWork unitOfWork, ILogger<ProvidersController> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }



        [HttpGet("dummy")]
        public IActionResult Dummy()
        {
            AvailableTimeGeneratorViewModel dummy = new AvailableTimeGeneratorViewModel
            {
                ProviderId = 1,
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddHours(6),
                Interval = TimeSpan.FromMinutes(30),
                Breaks = new TimeSlot[] { new TimeSlot(DateTime.UtcNow.AddHours(2), TimeSpan.FromHours(1)), new TimeSlot(DateTime.UtcNow.AddHours(4), TimeSpan.FromHours(1)) }
            };

            return Ok(dummy);
        }




        [HttpGet("{id}", Name = GetProviderByIdActionName)]
        [Produces(typeof(ProviderViewModel))]
        public IActionResult GetProviderById(int id)
        {
            var provider = _unitOfWork.Providers.GetProvider(id);

            if (provider != null)
                return Ok(Mapper.Map<ProviderViewModel>(provider));
            else
                return NotFound(id);
        }



        [HttpGet("me")]
        [Produces(typeof(ProviderViewModel))]
        public IActionResult GetCurrentUserProvider()
        {
            string userId = Utilities.GetUserId(this.User);

            return GetProviderByUserId(userId);
        }



        [HttpGet("{userId:guid}")]
        [Produces(typeof(ProviderViewModel))]
        public IActionResult GetProviderByUserId(string userId)
        {
            var provider = _unitOfWork.Providers.GetProviderByUserId(userId);

            if (provider != null)
                return Ok(Mapper.Map<ProviderViewModel>(provider));
            else
                return NotFound(userId);
        }



        [HttpGet("{page:int?}/{pageSize:int?}")]
        [Produces(typeof(List<ProviderViewModel>))]
        public IActionResult GetAllProviders(int? page, int? pageSize)
        {
            int? page_ = page < 0 ? (int?)null : page;
            int? pageSize_ = pageSize < 0 ? (int?)null : pageSize;
            var providerVMs = Mapper.Map<List<ProviderViewModel>>(_unitOfWork.Providers.GetAllProviders(page_, pageSize_));

            return Ok(providerVMs);
        }



        [HttpGet("{start:datetime}/{end:datetime?}/{page:int?}/{pageSize:int?}")]
        [Produces(typeof(List<ProviderViewModel>))]
        public IActionResult GetAllAvailableProviders(DateTime start, DateTime? end, int? page, int? pageSize)
        {
            int? page_ = page < 0 ? (int?)null : page;
            int? pageSize_ = pageSize < 0 ? (int?)null : pageSize;
            var providerVMs = Mapper.Map<List<ProviderViewModel>>(_unitOfWork.Providers.FindAvailableProviders(start, end, page_, pageSize_));

            return Ok(providerVMs);
        }



        [HttpPost]
        public IActionResult CreateProvider([FromBody]ProviderEditViewModel providerVM)
        {
            if (ModelState.IsValid)
            {
                if (providerVM == null)
                    return BadRequest($"{nameof(providerVM)} cannot be null");


                ProviderWithRoles providerWithRoles = _unitOfWork.Providers.GetProviderByUserId(providerVM.ApplicationUserId);
                Provider provider;

                if (providerWithRoles != null)
                {
                    int idBackup = providerWithRoles.Provider.Id;

                    provider = providerWithRoles.Provider;
                    Mapper.Map<ProviderEditViewModel, Provider>(providerVM, provider);
                    provider.Id = idBackup;
                    provider.IsActive = true;
                    provider.DateModified = DateTime.UtcNow;
                }
                else
                {
                    provider = Mapper.Map<Provider>(providerVM);
                    provider.IsActive = true;
                    provider.DateCreated = provider.DateModified = DateTime.UtcNow;
                    _unitOfWork.Providers.Add(provider);
                }

                _unitOfWork.SaveChanges();

                providerWithRoles = _unitOfWork.Providers.GetProviderByUserId(provider.ApplicationUserId);
                var providerResultVM = Mapper.Map<ProviderViewModel>(providerWithRoles);

                return CreatedAtAction(GetProviderByIdActionName, new { id = providerResultVM.Id }, providerResultVM);
            }

            return BadRequest(ModelState);
        }



        [HttpPut("{id}")]
        //Security: Test if user has permission to assign assigned roles
        public IActionResult UpdateProvider(int id, [FromBody]ProviderEditViewModel providerVM)
        {
            if (ModelState.IsValid)
            {
                if (providerVM == null)
                    return BadRequest($"{nameof(providerVM)} cannot be null");

                if (providerVM.Id != 0 && id != providerVM.Id)
                    return BadRequest("Conflicting provider id in parameter and model data");


                Provider provider = _unitOfWork.Providers.Get(id);

                if (provider == null)
                    return NotFound(id);


                Mapper.Map<ProviderEditViewModel, Provider>(providerVM, provider);
                provider.DateModified = DateTime.UtcNow;

                _unitOfWork.SaveChanges();

                return NoContent();
            }

            return BadRequest(ModelState);
        }



        [HttpDelete("{id}")]
        [Produces(typeof(ProviderViewModel))]
        public IActionResult DeleteProvider(int id)
        {
            if (!_unitOfWork.Providers.TestCanDeleteProvider(id))
                return BadRequest("Provider cannot be deleted. Remove all dependencies and try again");


            Provider provider = _unitOfWork.Providers.Get(id);

            if (provider == null)
                return NotFound(id);

            ProviderViewModel providerVM = Mapper.Map<ProviderViewModel>(provider);

            _unitOfWork.Providers.Remove(provider); //Todo: Delete user account too
            _unitOfWork.SaveChanges();

            return Ok(providerVM);
        }






        [HttpGet("roles/{page:int?}/{pageSize:int?}")]
        [Produces(typeof(List<RoleViewModel>))]
        public IActionResult GetNonAdminProviderRoles(int? page, int? pageSize)
        {
            int? page_ = page < 0 ? (int?)null : page;
            int? pageSize_ = pageSize < 0 ? (int?)null : pageSize;
            var roleVMs = Mapper.Map<List<RoleViewModel>>(_unitOfWork.Providers.GetNonAdminProviderRoles(page_, pageSize_));

            return Ok(roleVMs);
        }




        [HttpGet("hours/me")]
        [Produces(typeof(List<AvailableTimeViewModel>))]
        public IActionResult GetCurrentUserWorkingHours()
        {
            string userId = Utilities.GetUserId(this.User);

            var providerWithRoles = _unitOfWork.Providers.GetProviderByUserId(userId);

            if (providerWithRoles == null)
                return NotFound(userId);

            return GetWorkingHoursHelper(providerWithRoles.Provider.Id, null, null);
        }


        [HttpGet("hours/{id:int?}", Name = GetWorkingHoursByProviderIdActionName)]
        [Produces(typeof(List<AvailableTimeViewModel>))]
        public IActionResult GetWorkingHoursByProviderId(int? id)
        {
            return GetWorkingHoursHelper(id, null, null);
        }


        [HttpGet("hours/{id:int}/{page:int}/{pageSize:int}")]
        [Produces(typeof(List<AvailableTimeViewModel>))]
        public IActionResult GetWorkingHoursByProviderId(int id, int page, int pageSize)
        {
            return GetWorkingHoursHelper(id, page, pageSize);
        }


        [HttpGet("hours/{page:int}/{pageSize:int}")]
        [Produces(typeof(List<AvailableTimeViewModel>))]
        public IActionResult GetWorkingHours(int page, int pageSize)
        {
            return GetWorkingHoursHelper(null, page, pageSize);
        }



        [HttpPost("hours")]
        public IActionResult GenerateAvailableTimes([FromBody]AvailableTimeGeneratorViewModel generatorParams)
        {
            if (ModelState.IsValid)
            {
                if (generatorParams == null)
                    return BadRequest($"{nameof(generatorParams)} cannot be null");

                var providerWithRoles = _unitOfWork.Providers.GetProvider(generatorParams.ProviderId);

                if (providerWithRoles == null)
                    return NotFound($"{nameof(generatorParams.ProviderId)}: {generatorParams.ProviderId}");

                List<AvailableTime> newHours = _unitOfWork.Providers.GenerateAvailableTime(providerWithRoles.Provider, generatorParams.StartDate, generatorParams.EndDate,
                    generatorParams.Interval ?? SystemConfigurations.AppointmentDuration, generatorParams.Breaks);

                _unitOfWork.SaveChanges();

                var newHoursVM = Mapper.Map<List<AvailableTimeViewModel>>(newHours);


                return CreatedAtAction(GetWorkingHoursByProviderIdActionName, new { id = providerWithRoles.Provider.Id }, newHoursVM);
            }

            return BadRequest(ModelState);
        }



        [HttpPut("hours/{id}")]
        public IActionResult UpdateAvailability(int id, [FromBody]AvailableTimeViewModel availableTimeVM)
        {
            if (ModelState.IsValid)
            {
                if (availableTimeVM == null)
                    return BadRequest($"{nameof(availableTimeVM)} cannot be null");

                if (availableTimeVM.Id != 0 && id != availableTimeVM.Id)
                    return BadRequest("Conflicting provider id in parameter and model data");


                AvailableTime availableTime = _unitOfWork.Providers.GetProviderTime(id);

                if (availableTime == null)
                    return NotFound(id);


                Mapper.Map<AvailableTimeViewModel, AvailableTime>(availableTimeVM, availableTime);
                availableTime.DateModified = DateTime.UtcNow;

                _unitOfWork.SaveChanges();

                return NoContent();
            }

            return BadRequest(ModelState);
        }


        [HttpDelete("hours/{id}")]
        [Produces(typeof(AvailableTimeViewModel))]
        public IActionResult DeleteAvailability(int id)
        {
            if (!_unitOfWork.Providers.TestCanDeleteAvailableTime(id))
                return BadRequest("Availability cannot be deleted. Remove all dependencies and try again");


            AvailableTime availableTime = _unitOfWork.Providers.DeleteProviderTime(id);

            if (availableTime == null)
                return NotFound(id);

            AvailableTimeViewModel availabilityVM = Mapper.Map<AvailableTimeViewModel>(availableTime);

            _unitOfWork.SaveChanges();

            return Ok(availabilityVM);
        }










        private IActionResult GetWorkingHoursHelper(int? providerId, int? page, int? pageSize)
        {
            if (providerId.HasValue)
            {
                var provider = _unitOfWork.Providers.Get(providerId.Value);

                if (provider == null)
                    return NotFound(providerId);
            }

            List<AvailableTimeViewModel> workingHoursVM = Mapper.Map<List<AvailableTimeViewModel>>(_unitOfWork.Providers.GetActiveWorkingHours(providerId, page, pageSize));

            return Ok(workingHoursVM);
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
