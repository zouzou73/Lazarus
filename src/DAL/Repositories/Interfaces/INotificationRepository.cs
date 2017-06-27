using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DAL.Repositories.Interfaces
{
    public interface INotificationRepository : IRepository<Notification>
    {
        List<Notification> GetNotifications(int[] ids);
        List<Notification> GetNewNotificationsByUserId(string userId, bool includePinned, DateTime? lastNotificationDate);
        List<Notification> GetPinnedAndUnreadNotificationsByUserId(string userId);
        List<Notification> GetAllNotifications(int? page, int? pageSize);
        List<Notification> GetUserAllNotifications(string userId, int? page, int? pageSize);
    }
}
