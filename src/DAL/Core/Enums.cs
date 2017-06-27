using System;
using System.ComponentModel;
using System.Linq;

namespace DAL.Core
{
    public enum Gender
    {
        None,
        Female,
        Male
    }

    public enum BloodGroup
    {
        None,
        [DisplayName("O+")]
        O_Positive,
        [DisplayName("O-")]
        O_Negative,
        [DisplayName("A+")]
        A_Positive,
        [DisplayName("A-")]
        A_Negative,
        [DisplayName("B+")]
        B_Positive,
        [DisplayName("B-")]
        B_Negative,
        [DisplayName("AB+")]
        AB_Positive,
        [DisplayName("AB-")]
        AB_Negative
    }

    public enum AppointmentStatus
    {
        PendingApproval,
        Rescheduled,
        Cancelled,
        Rejected,
        Confirm,
        Confirmed,
        Closed
    }

    public enum AppointmentRole
    {
        None,
        Consultant,
        Client
    }

    public enum NotificationType
    {
        General,
        AppointmentRequest,
        AppointmentApproved,
        AppointmentCancelled,
        AppointmentRejected,
        AppointmentConfirmed,
        AppointmentRescheduled,
        AppointmentClosed
    }
}
