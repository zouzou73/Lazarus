using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DAL.Repositories.Interfaces;
using DAL.Core;

namespace DAL.Repositories
{
    public class ProviderRepository : Repository<Provider>, IProviderRepository
    {
        //Todo: Erase provider configuration before returning provider(s)


        public ProviderRepository(DbContext context) : base(context)
        { }


        public ProviderWithRoles GetProvider(int providerId)
        {
            var provider = appContext.Providers.Include(p => p.ApplicationUser.Roles).Include(p => p.Department).Where(p => p.Id == providerId).FirstOrDefault();
            return GetProviderWithRoles(provider);
        }


        public ProviderWithRoles GetProviderByUserId(string userId)
        {
            var provider = appContext.Providers.Include(p => p.ApplicationUser.Roles).Include(p => p.Department).Where(p => p.ApplicationUserId == userId).SingleOrDefault();
            return GetProviderWithRoles(provider);
        }



        public List<ProviderWithRoles> GetAllProviders(int? page, int? pageSize)
        {
            if ((page == null || pageSize == null) && (page != null || pageSize != null))
                throw new InvalidOperationException($"{nameof(page)} and {nameof(pageSize)} should both be null or non null");

            List<Provider> providers;

            if (page.HasValue)
                providers = appContext.Providers.Where(p => p.IsActive).Include(p => p.ApplicationUser.Roles).Include(p => p.Department).OrderBy(p => p.Id).Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value).ToList();
            else
                providers = appContext.Providers.Where(p => p.IsActive).Include(p => p.ApplicationUser.Roles).Include(p => p.Department).OrderBy(p => p.Id).ToList();

            return GetProviderWithRoles(providers);
        }


        public List<ApplicationRole> GetNonAdminProviderRoles(int? page, int? pageSize)
        {
            if ((page == null || pageSize == null) && (page != null || pageSize != null))
                throw new InvalidOperationException($"{nameof(page)} and {nameof(pageSize)} should both be null or non null");

            var adminsPermissions = ApplicationPermissions.GetPermissionsForAdminsValues().ToList();
            var providerPermissions = ApplicationPermissions.GetPermissionsForProvidersValues().ToList();

            var providerOnlyRoles = appContext.Roles.Where(r => r.Claims.Any(c => providerPermissions.Contains(c.ClaimValue)) && r.Claims.All(c => !adminsPermissions.Contains(c.ClaimValue)));

            if (page.HasValue)
                return providerOnlyRoles.OrderBy(p => p.Id).Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value).ToList();
            else
                return providerOnlyRoles.OrderBy(p => p.Id).ToList();
        }


        public List<ApplicationRole> GetAllProviderRoles(int? page, int? pageSize)
        {
            if ((page == null || pageSize == null) && (page != null || pageSize != null))
                throw new InvalidOperationException($"{nameof(page)} and {nameof(pageSize)} should both be null or non null");

            var providerPermissions = ApplicationPermissions.GetPermissionsForProvidersValues().ToList();

            var providerOnlyRoles = appContext.Roles.Where(r => r.Claims.Any(c => providerPermissions.Contains(c.ClaimValue)));

            if (page.HasValue)
                return providerOnlyRoles.OrderBy(p => p.Id).Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value).ToList();
            else
                return providerOnlyRoles.OrderBy(p => p.Id).ToList();
        }


        public bool GetIsProvider(string[] userRoles)
        {
            if (userRoles == null || !userRoles.Any())
                return false;

            List<string> loweredTestRoles = userRoles.Select(r => r.ToLowerInvariant()).ToList();
            List<string> providerRoles = GetAllProviderRoles(null, null).Select(r => r.Name.ToLowerInvariant()).ToList();

            return loweredTestRoles.Any(r => providerRoles.Contains(r));
        }


        public AvailableTime GetProviderTime(int availableTimeId)
        {
            return appContext.AvailableTimes.Include(t => t.Provider).Where(t => t.Id == availableTimeId).FirstOrDefault();
        }


        public AvailableTime DeleteProviderTime(int availableTimeId)
        {
            AvailableTime availableTime = appContext.AvailableTimes.Find(availableTimeId);

            if (availableTime == null)
                return null;

            appContext.AvailableTimes.Remove(availableTime);

            return availableTime;
        }


        public bool ReleaseProviderTime(int availableTimeId)
        {
            AvailableTime availableTime = appContext.AvailableTimes.Find(availableTimeId);

            if (availableTime == null)
                return false;

            availableTime.IsBooked = false;

            return true;
        }


        public List<ProviderWithRoles> FindAvailableProviders(DateTime start, DateTime? end, int? page, int? pageSize)
        {
            if ((page == null || pageSize == null) && (page != null || pageSize != null))
                throw new InvalidOperationException($"{nameof(page)} and {nameof(pageSize)} should both be null or non null");


            IQueryable<AvailableTime> availableDates;

            if (end.HasValue)
                availableDates = appContext.AvailableTimes.Where(t => !t.IsReserved && !t.IsBooked && t.StartDate >= start && t.StartDate < end.Value);
            else
                availableDates = appContext.AvailableTimes.Where(t => !t.IsReserved && !t.IsBooked && t.StartDate >= start);


            IOrderedQueryable<Provider> availableProviders = availableDates.Select(t => t.Provider).Include(p => p.ApplicationUser.Roles).Include(p => p.Department).OrderBy(p => p.Id);
            List<Provider> providers;

            if (page.HasValue)
                providers = availableProviders.Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value).ToList();
            else
                providers = availableProviders.ToList();

            return GetProviderWithRoles(providers);
        }



        public (ProviderWithRoles provider, AvailableTime availableTime)? FindAvailableProvider(Appointment appointment)
        {
            DateTime minDate = new[] { appointment.PreferredDate, DateTime.UtcNow }.Max();
            DateTime maxDate = appointment.PreferredDate.Date.AddDays(1);

            List<AvailableTime> availableDates = appContext.AvailableTimes
                .Where(t => !t.IsReserved && !t.IsBooked && t.StartDate >= minDate && t.StartDate < maxDate)
                .ToList();

            if (appointment.Date != null)
                availableDates.Add(appointment.Date);


            AvailableTime closestTime;

            if (appointment.IsCritical)
            {
                closestTime = availableDates
                    .OrderBy(t => Math.Abs((t.StartDate - appointment.PreferredDate).Ticks))
                    .ThenByDescending(a => a.ProviderId == appointment.PreferredProviderId)
                    .FirstOrDefault();
            }
            else
            {
                closestTime = availableDates
                    .OrderByDescending(a => a.ProviderId == appointment.PreferredProviderId)
                    .ThenBy(t => Math.Abs((t.StartDate - appointment.PreferredDate).Ticks))
                    .FirstOrDefault();
            }


            if (appointment.DateId.HasValue && appointment.DateId != closestTime.Id)
                ReleaseProviderTime(appointment.DateId.Value);

            if (closestTime != null)
                return (GetProvider(closestTime.ProviderId), closestTime);

            return null;
        }



        public List<AvailableTime> GenerateAvailableTime(Provider provider, DateTime start, DateTime end, TimeSpan interval, TimeSlot[] breaks, bool attachToContext = true)
        {
            if (start > end)
                throw new InvalidOperationException($"{nameof(start)} cannot be less than ${nameof(end)}");

            if (interval <= TimeSpan.Zero)
                throw new InvalidOperationException($"{nameof(interval)} cannot be less than or equal to ${nameof(TimeSpan.Zero)}");


            List<AvailableTime> availableTimes = new List<AvailableTime>();

            for (DateTime i = start; i < end; i = i.AddTicks(interval.Ticks))
            {
                AvailableTime availableTime = new AvailableTime(i, interval, provider);

                if (availableTime.EndDate <= end && !GetIsWithinBreakTime(availableTime))
                    availableTimes.Add(availableTime);
            }


            bool GetIsWithinBreakTime(AvailableTime testTime)
            {
                if (breaks == null)
                    return false;

                return
                    breaks.Any(b => testTime.StartDate >= b.Start && testTime.StartDate < b.Start.Date.Add(b.Duration)) ||
                    breaks.Any(b => testTime.EndDate > b.Start && testTime.EndDate < b.Start.Date.Add(b.Duration));
            };


            if (attachToContext)
                appContext.AvailableTimes.AddRange(availableTimes);

            return availableTimes;
        }



        public List<AvailableTime> GetActiveWorkingHours(int? providerId, int? page, int? pageSize)
        {
            if ((page == null || pageSize == null) && (page != null || pageSize != null))
                throw new InvalidOperationException($"{nameof(page)} and {nameof(pageSize)} should both be null or non null");

            DateTime currentDate = DateTime.UtcNow;

            IQueryable<AvailableTime> availableDates;

            if (providerId.HasValue)
                availableDates = appContext.AvailableTimes.Where(t => t.ProviderId == providerId.Value && t.StartDate > currentDate);
            else
                availableDates = appContext.AvailableTimes.Where(t => t.StartDate > currentDate);

            if (page.HasValue)
                return availableDates.OrderBy(t => t.Id).Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value).ToList();
            else
                return availableDates.ToList();
        }


        public List<AvailableTime> GetActiveWorkingHours(List<AvailableTime> workingHours)
        {
            DateTime currentDate = DateTime.UtcNow;
            return workingHours.Where(t => t.StartDate > currentDate).ToList();
        }



        public bool TestCanDeleteProvider(int id)
        {
            return true;
        }


        public bool TestCanDeleteAvailableTime(int id)
        {
            return true;
        }



        private ProviderWithRoles GetProviderWithRoles(Provider provider)
        {
            if (provider == null)
                return null;

            var userRoleIds = provider.ApplicationUser.Roles.Select(r => r.RoleId).ToList();

            var roles = appContext.Roles
                .Where(r => userRoleIds.Contains(r.Id))
                .Select(r => r.Name)
                .ToArray();

            return new ProviderWithRoles(provider, roles);
        }


        private List<ProviderWithRoles> GetProviderWithRoles(List<Provider> providers)
        {
            if (providers == null)
                return null;

            if (!providers.Any())
                return new List<ProviderWithRoles>(0);


            var userRoleIds = providers.SelectMany(p => p.ApplicationUser.Roles.Select(r => r.RoleId)).ToList();

            var roles = appContext.Roles
                .Where(r => userRoleIds.Contains(r.Id))
                .ToArray();

            return providers.Select(p => new ProviderWithRoles(p, roles.Where(r => p.ApplicationUser.Roles.Select(ur => ur.RoleId).Contains(r.Id)).Select(r => r.Name).ToArray())).ToList();
        }


        private ApplicationDbContext appContext
        {
            get { return (ApplicationDbContext)_context; }
        }
    }
}
