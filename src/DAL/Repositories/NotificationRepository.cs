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
    public class NotificationRepository : Repository<Notification>, INotificationRepository
    {
        public NotificationRepository(DbContext context) : base(context)
        {

        }


        public List<Notification> GetNotifications(int[] ids)
        {
            return appContext.Notifications.Where(n => ids.Contains(n.Id)).ToList();
        }



        public List<Notification> GetNewNotificationsByUserId(string userId, bool includePinned, DateTime? lastNotificationDate)
        {
            return appContext.Notifications.Where(n => n.TargetUserId == userId).OrderByDescending(n => n.IsPinned).ThenByDescending(n => n.DateCreated).ToList();

            //Todo: For now reloading everything. Use Below Code to only load additions
            /*
            if (lastNotificationDate != null)
            {
                return appContext.Notifications
                    .Where(n => n.TargetUserId == userId && ((includePinned && n.IsPinned) || n.DateCreated >= lastNotificationDate))
                    .OrderByDescending(n => n.IsPinned).
                    ThenByDescending(n => n.DateCreated)
                    .ToList();
            }
            else
            {
                return appContext.Notifications
                    .Where(n => n.TargetUserId == userId && ((includePinned && n.IsPinned) || !n.IsRead))
                    .OrderByDescending(n => n.IsPinned)
                    .ThenByDescending(n => n.DateCreated)
                    .ToList();
            }
            */
        }

        public List<Notification> GetPinnedAndUnreadNotificationsByUserId(string userId)
        {
            return appContext.Notifications.Where(n => n.TargetUserId == userId && (!n.IsRead || n.IsPinned)).OrderByDescending(n => n.IsPinned).ThenByDescending(n => n.DateCreated).ToList();
        }


        public List<Notification> GetUserAllNotifications(string userId, int? page, int? pageSize)
        {
            if ((page == null || pageSize == null) && (page != null || pageSize != null))
                throw new InvalidOperationException($"{nameof(page)} and {nameof(pageSize)} should both be null or non null");

            var userNotificationsQuery = appContext.Notifications.Where(n => n.TargetUserId == userId).OrderByDescending(n => n.IsPinned).ThenByDescending(n => n.DateCreated);

            if (page.HasValue)
                return userNotificationsQuery.Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value).ToList();
            else
                return userNotificationsQuery.ToList();
        }



        public List<Notification> GetAllNotifications(int? page, int? pageSize)
        {
            if ((page == null || pageSize == null) && (page != null || pageSize != null))
                throw new InvalidOperationException($"{nameof(page)} and {nameof(pageSize)} should both be null or non null");

            if (page.HasValue)
                return appContext.Notifications.OrderByDescending(n => n.DateCreated).Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value).ToList();
            else
                return appContext.Notifications.OrderByDescending(n => n.DateCreated).ToList();
        }





        private ApplicationDbContext appContext
        {
            get { return (ApplicationDbContext)_context; }
        }
    }
}
