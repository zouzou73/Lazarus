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
    public class DepartmentsController : Controller
    {
        readonly IUnitOfWork _unitOfWork;
        readonly ILogger _logger;

        private const string GetDepartmentByIdActionName = "GetDepartmentById";


        public DepartmentsController(IUnitOfWork unitOfWork, ILogger<DepartmentsController> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }
         


        [HttpGet("{id}", Name = GetDepartmentByIdActionName)]
        [Produces(typeof(DepartmentViewModel))]
        public IActionResult GetDepartmentById(int id)
        {
            var departmentAndUsercount = _unitOfWork.Departments.GetDepartment(id);

            if (departmentAndUsercount.department != null)
                return Ok(ConvertToDepartmentViewModel(departmentAndUsercount));
            else
                return NotFound(id);
        }



        [HttpGet("{page:int?}/{pageSize:int?}")]
        [Produces(typeof(List<DepartmentViewModel>))]
        public IActionResult GetAllDepartments(int? page, int? pageSize)
        {
            int? page_ = page < 0 ? (int?)null : page;
            int? pageSize_ = pageSize < 0 ? (int?)null : pageSize;

            var departments = _unitOfWork.Departments.GetDepartments(page_, pageSize_);

            List<DepartmentViewModel> departmentVMs = new List<DepartmentViewModel>(departments.Count);
            departments.ForEach(r => departmentVMs.Add(ConvertToDepartmentViewModel(r)));

            return Ok(departmentVMs);
        }



        [HttpPost]
        public IActionResult CreateDepartment([FromBody]DepartmentViewModel departmentVM)
        {
            if (ModelState.IsValid)
            {
                if (departmentVM == null)
                    return BadRequest($"{nameof(departmentVM)} cannot be null");


                Department department = Mapper.Map<Department>(departmentVM);
                department.DateCreated = department.DateModified = DateTime.UtcNow;

                _unitOfWork.Departments.Add(department);
                _unitOfWork.SaveChanges();

                departmentVM = Mapper.Map<DepartmentViewModel>(department);

                return CreatedAtAction(GetDepartmentByIdActionName, new { id = departmentVM.Id }, departmentVM);
            }

            return BadRequest(ModelState);
        }




        [HttpPut("{id}")]
        public IActionResult UpdateDepartment(int id, [FromBody]DepartmentViewModel departmentVM)
        {
            if (ModelState.IsValid)
            {
                if (departmentVM == null)
                    return BadRequest($"{nameof(departmentVM)} cannot be null");

                if (departmentVM.Id != 0 && id != departmentVM.Id)
                    return BadRequest("Conflicting department id in parameter and model data");


                Department department = _unitOfWork.Departments.Get(id);

                if (department == null)
                    return NotFound(id);


                Mapper.Map<DepartmentViewModel, Department>(departmentVM, department);
                department.DateModified = DateTime.UtcNow;

                _unitOfWork.SaveChanges();

                return NoContent();
            }

            return BadRequest(ModelState);
        }



        [HttpDelete("{id}")]
        [Produces(typeof(DepartmentViewModel))]
        public IActionResult DeleteDepartment(int id)
        {
            if (!_unitOfWork.Departments.TestCanDeleteDepartment(id))
                return BadRequest("Department cannot be deleted. Remove all dependencies and try again");


            Department department = _unitOfWork.Departments.Get(id);

            if (department == null)
                return NotFound(id);

            DepartmentViewModel departmentVM = Mapper.Map<DepartmentViewModel>(department);

            _unitOfWork.Departments.Remove(department);
            _unitOfWork.SaveChanges();

            return Ok(departmentVM);
        }




        private DepartmentViewModel ConvertToDepartmentViewModel((Department department, int userCount) departmentAndUserCount)
        {
            DepartmentViewModel departmentVM = Mapper.Map<DepartmentViewModel>(departmentAndUserCount.department);
            departmentVM.UsersCount = departmentAndUserCount.userCount;

            return departmentVM;
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
