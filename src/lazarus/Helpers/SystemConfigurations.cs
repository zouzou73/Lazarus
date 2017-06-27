using System;
using System.Linq;

namespace lazarus.Helpers
{
    /// <summary>
    /// This is a quickfix to save generic configuration.
    /// Todo: will move each configuration into appropriate system/user configuration space
    /// </summary>
    public static class SystemConfigurations
    {
        public static void LoadConfiguration(bool autoProcessAppointments, bool manualProcessAppointments, TimeSpan appointmentDuration)
        {
            AutoProcessAppointments = autoProcessAppointments;
            ManualProcessAppointments = manualProcessAppointments;
            AppointmentDuration = appointmentDuration;
        }


        public static bool AutoProcessAppointments { get; private set; } = true;
        public static bool ManualProcessAppointments { get; private set; } = false;
        public static TimeSpan AppointmentDuration { get; private set; } = TimeSpan.FromMinutes(30);



        public static class SystemIDs
        {
            public const string AppointmentNotifications = "AppointmentNotifications";
        }

    }
}
