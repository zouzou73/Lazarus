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
    public class NotificationsController : Controller
    {
        readonly IUnitOfWork _unitOfWork;
        readonly ILogger _logger;

        private const string GetNotificationByIdActionName = "GetNotificationById";


        public NotificationsController(IUnitOfWork unitOfWork, ILogger<NotificationsController> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }



        [HttpGet("{id}", Name = GetNotificationByIdActionName)]
        [Produces(typeof(NotificationViewModel))]
        public IActionResult GetNotificationById(int id)
        {
            var notification = _unitOfWork.Notifications.Get(id);

            if (notification != null)
                return Ok(Mapper.Map<NotificationViewModel>(notification));
            else
                return NotFound(id);
        }



        [HttpGet("me")]
        [Produces(typeof(List<NotificationViewModel>))]
        public IActionResult GetCurrentUserPinnedAndUnreadNotifications()
        {
            string userId = Utilities.GetUserId(this.User);

            return GetPinnedAndUnreadNotificationsByUserId(userId);
        }


        [HttpGet("me/new/{lastNotificationDate:datetime?}")]
        [Produces(typeof(List<NotificationViewModel>))]
        public IActionResult GetCurrentUserNewNotifications(DateTime? lastNotificationDate)
        {
            string userId = Utilities.GetUserId(this.User);

            var notifications = _unitOfWork.Notifications.GetNewNotificationsByUserId(userId, true, lastNotificationDate);

            if (notifications != null)
                return Ok(Mapper.Map<List<NotificationViewModel>>(notifications));
            else
                return NotFound(userId);
        }



        [HttpGet("{userId:guid}")]
        [Produces(typeof(List<NotificationViewModel>))]
        public IActionResult GetPinnedAndUnreadNotificationsByUserId(string userId)
        {
            var notifications = _unitOfWork.Notifications.GetPinnedAndUnreadNotificationsByUserId(userId);

            if (notifications != null)
                return Ok(Mapper.Map<List<NotificationViewModel>>(notifications));
            else
                return NotFound(userId);
        }



        [HttpGet("{userId:guid?}/{page:int?}/{pageSize:int?}")]
        [Produces(typeof(List<NotificationViewModel>))]
        public IActionResult GetAllUserNotifications(string userId, int? page, int? pageSize)
        {
            int? page_ = page < 0 ? (int?)null : page;
            int? pageSize_ = pageSize < 0 ? (int?)null : pageSize;

            if (string.IsNullOrWhiteSpace(userId))
                userId = Utilities.GetUserId(this.User);

            var notificationsVMs = Mapper.Map<List<NotificationViewModel>>(_unitOfWork.Notifications.GetUserAllNotifications(userId, page_, pageSize_));

            return Ok(notificationsVMs);
        }



        [HttpGet("all/{page:int}/{pageSize:int}")]
        [Produces(typeof(List<NotificationViewModel>))]
        public IActionResult GetAllNotifications(int page, int pageSize)
        {
            int? page_ = page < 0 ? (int?)null : page;
            int? pageSize_ = pageSize < 0 ? (int?)null : pageSize;

            var notificationsVMs = Mapper.Map<List<NotificationViewModel>>(_unitOfWork.Notifications.GetAllNotifications(page_, pageSize_));

            return Ok(notificationsVMs);
        }



        [HttpPut("pin/{id}")]
        public IActionResult PinUnpinNotification(int id, [FromBody]bool? isPinned)
        {
            if (ModelState.IsValid)
            {
                Notification notification = _unitOfWork.Notifications.Get(id);

                if (notification == null)
                    return NotFound(id);

                if (isPinned == null)
                    isPinned = !notification.IsPinned;

                notification.IsPinned = isPinned.Value;
                notification.IsRead = true;
                notification.DateModified = DateTime.UtcNow;

                _unitOfWork.SaveChanges();

                return NoContent();
            }

            return BadRequest(ModelState);
        }



        [HttpPut("read/{isRead:bool}")]
        public IActionResult ReadUnreadNotification(bool isRead, [FromBody]int[] ids)
        {
            if (ModelState.IsValid)
            {
                var notifications = _unitOfWork.Notifications.GetNotifications(ids);

                notifications.ForEach(n =>
                {
                    n.IsRead = isRead;
                    n.DateModified = DateTime.UtcNow;
                });

                _unitOfWork.SaveChanges();

                return NoContent();
            }

            return BadRequest(ModelState);
        }



        [HttpDelete("{id}")]
        [Produces(typeof(NotificationViewModel))]
        public IActionResult DeleteNotification(int id)
        {
            Notification notification = _unitOfWork.Notifications.Get(id);

            if (notification == null)
                return NotFound(id);

            NotificationViewModel notificationVM = Mapper.Map<NotificationViewModel>(notification);

            _unitOfWork.Notifications.Remove(notification);
            _unitOfWork.SaveChanges();

            return Ok(notificationVM);
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
