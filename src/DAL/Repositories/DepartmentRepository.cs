using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DAL.Repositories.Interfaces;

namespace DAL.Repositories
{
    public class DepartmentRepository : Repository<Department>, IDepartmentRepository
    {
        public DepartmentRepository(DbContext context) : base(context)
        { }


        public (Department department, int userCount) GetDepartment(int departmentId)
        {
            var results = appContext.Departments.Where(d => d.Id == departmentId)
                .Select(d => new { Department = d, UserCount = d.Providers.Count })
                .FirstOrDefault();

            return (results.Department, results.UserCount);
        }


        public List<(Department department, int userCount)> GetDepartments(int? page, int? pageSize)
        {
            if ((page == null || pageSize == null) && (page != null || pageSize != null))
                throw new InvalidOperationException($"{nameof(page)} and {nameof(pageSize)} should both be null or non null");


            IQueryable<Department> departmentsQuery;

            if (page.HasValue)
                departmentsQuery = appContext.Departments.OrderBy(p => p.Id).Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value);
            else
                departmentsQuery = appContext.Departments.OrderBy(p => p.Id);

            var departments = departmentsQuery.Select(d => new { Department = d, UserCount = d.Providers.Count }).ToList();

            List<(Department, int)> results = new List<(Department, int)>(departments.Count);
            departments.ForEach(d => results.Add((d.Department, d.UserCount)));

            return results;
        }


        public bool TestCanDeleteDepartment(int id)
        {
            return true;
        }



        private ApplicationDbContext appContext
        {
            get { return (ApplicationDbContext)_context; }
        }
    }
}
