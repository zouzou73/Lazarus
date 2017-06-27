using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DAL.Repositories.Interfaces
{
    public interface IDepartmentRepository : IRepository<Department>
    {
        (Department department, int userCount) GetDepartment(int departmentId);
        List<(Department department, int userCount)> GetDepartments(int? page, int? pageSize);
        bool TestCanDeleteDepartment(int id);


    }
}
