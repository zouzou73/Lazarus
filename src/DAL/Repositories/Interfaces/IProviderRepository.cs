using DAL.Core;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DAL.Repositories.Interfaces
{
    public interface IProviderRepository : IRepository<Provider>
    {
        AvailableTime DeleteProviderTime(int availableTimeId);
        (ProviderWithRoles provider, AvailableTime availableTime)? FindAvailableProvider(Appointment appointment);
        List<ProviderWithRoles> FindAvailableProviders(DateTime start, DateTime? end, int? page, int? pageSize);
        List<AvailableTime> GenerateAvailableTime(Provider provider, DateTime start, DateTime end, TimeSpan interval, TimeSlot[] breaks, bool attachToContext = true);
        List<AvailableTime> GetActiveWorkingHours(List<AvailableTime> workingHours);
        List<AvailableTime> GetActiveWorkingHours(int? providerId, int? page, int? pageSize);
        List<ApplicationRole> GetAllProviderRoles(int? page, int? pageSize);
        List<ProviderWithRoles> GetAllProviders(int? page, int? pageSize);
        bool GetIsProvider(string[] userRoles);
        List<ApplicationRole> GetNonAdminProviderRoles(int? page, int? pageSize);
        ProviderWithRoles GetProvider(int providerId);
        ProviderWithRoles GetProviderByUserId(string userId);
        AvailableTime GetProviderTime(int availableTimeId);
        bool ReleaseProviderTime(int availableTimeId);
        bool TestCanDeleteAvailableTime(int id);
        bool TestCanDeleteProvider(int id);
    }
}
