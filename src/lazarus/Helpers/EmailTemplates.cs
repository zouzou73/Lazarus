using DAL.Models;
using MailKit.Net.Smtp;
using MimeKit;
using System;
using Microsoft.Extensions.Logging;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace lazarus.Helpers
{
    public static class EmailTemplates
    {
        static IHostingEnvironment _hostingEnvironment;
        static string appointmentConfirmationEmailForPatientTemplate;
        static string appointmentConfirmationEmailForDoctorTemplate;


        public static void Initialize(IHostingEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }



        public static string GetAppointmentConfirmationEmailForPatient(string patientName, string doctorName, DateTime appointmentDate, DateTime requestDate)
        {
            if (appointmentConfirmationEmailForPatientTemplate == null)
                appointmentConfirmationEmailForPatientTemplate = ReadPhysicalFile("Helpers/Templates/AppointmentConfirmationEmailForPatient.template");


            string emailMessage = appointmentConfirmationEmailForPatientTemplate;

            emailMessage = emailMessage.Replace("{patient}", patientName);
            emailMessage = emailMessage.Replace("{doctor}", doctorName);
            emailMessage = emailMessage.Replace("{appointmentDate}", appointmentDate.ToString());
            emailMessage = emailMessage.Replace("{requestDate}", requestDate.ToString());

            return emailMessage;
        }


        public static string GetAppointmentConfirmationEmailForDoctor(string patientName, string doctorName, DateTime appointmentDate, DateTime requestDate)
        {
            if (appointmentConfirmationEmailForDoctorTemplate == null)
                appointmentConfirmationEmailForDoctorTemplate = ReadPhysicalFile("Helpers/Templates/AppointmentConfirmationEmailForDoctor.template");


            string emailMessage = appointmentConfirmationEmailForDoctorTemplate;

            emailMessage = emailMessage.Replace("{patient}", patientName);
            emailMessage = emailMessage.Replace("{doctor}", doctorName);
            emailMessage = emailMessage.Replace("{appointmentDate}", appointmentDate.ToString());
            emailMessage = emailMessage.Replace("{requestDate}", requestDate.ToString());

            return emailMessage;
        }




        private static string ReadPhysicalFile(string path)
        {
            if (_hostingEnvironment == null)
                throw new InvalidOperationException($"{nameof(EmailTemplates)} is not initialized");

            IFileInfo fileInfo = _hostingEnvironment.ContentRootFileProvider.GetFileInfo(path);

            if (!fileInfo.Exists)
                throw new FileNotFoundException($"Template file located at \"{path}\" was not found");

            using (var fs = fileInfo.CreateReadStream())
            {
                using (var sr = new StreamReader(fs))
                {
                    return sr.ReadToEnd();
                }
            }
        }
    }
}
