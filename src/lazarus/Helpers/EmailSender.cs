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

namespace lazarus.Helpers
{
    public class EmailSender
    {
        internal static SmtpConfig Configuration;



        public static string SendTestEmail()
        {
            var emailTask = SendEmailAsync(Configuration.Name, Configuration.EmailAddress,
                "Ebenezer Monney", "eben.monney@gmail.com",
                "Test Email from Lazarus OPD " + DateTime.UtcNow, "Hey there,\nthis is a Lazarus OPD notification test email " + DateTime.UtcNow);

            emailTask.Wait();

            if (emailTask.Result.success)
                return "Success";

            return emailTask.Result.errorMsg;
        }



        public static bool SendEmail(Notification notification, string emailBody = null, SmtpConfig config = null, bool isHtml = true)
        {
            var emailTask = SendEmailAsync(notification, emailBody, config, isHtml);

            emailTask.Wait();

            return emailTask.Result;
        }


        public static async Task<bool> SendEmailAsync(Notification notification, string emailBody = null, SmtpConfig config = null, bool isHtml = true)
        {
            if (config == null)
                config = Configuration;

            string senderName = "No Reply";
            string senderEmail = config.EmailAddress;
            string recepientName = notification.TargetUser.FriendlyName;
            string recepientEmail = notification.TargetUser.Email;
            string messageHeader = notification.Header;
            string messageBody = emailBody != null ? emailBody : notification.Body;

            (bool success, string errorMsg) result = await SendEmailAsync(senderName, senderEmail, recepientName, recepientEmail, messageHeader, messageBody, config, isHtml);

            if (result.success)
            {
                notification.EmailSentDate = DateTime.UtcNow;
                notification.EmailFailedErrorMessage = null;
                return true;
            }
            else
            {
                notification.EmailFailedErrorMessage = result.errorMsg;
                return false;
            }
        }


        public static async Task<(bool success, string errorMsg)> SendEmailAsync(string senderName, string senderEmail,
            string recepientName, string recepientEmail,
            string subject, string body, SmtpConfig config = null, bool isHtml = true)
        {
            var from = new MailboxAddress(senderName, senderEmail);
            var to = new MailboxAddress(recepientName, recepientEmail);

            return await EmailSender.SendEmailAsync(from, new MailboxAddress[] { to }, subject, body, config, isHtml);
        }


        public static async Task<(bool success, string errorMsg)> SendEmailAsync(MailboxAddress sender, MailboxAddress[] recepients, string subject, string body, SmtpConfig config = null, bool isHtml = true)
        {
            MimeMessage message = new MimeMessage();

            message.From.Add(sender);
            message.To.AddRange(recepients);
            message.Subject = subject;
            message.Body = isHtml ? new BodyBuilder { HtmlBody = body }.ToMessageBody() : new TextPart("plain") { Text = body };

            try
            {
                if (config == null)
                    config = Configuration;

                using (var client = new SmtpClient())
                {
                    await client.ConnectAsync(config.Host, config.Port, config.UseSSL).ConfigureAwait(false);
                    client.AuthenticationMechanisms.Remove("XOAUTH2");

                    if (!string.IsNullOrWhiteSpace(config.Username))
                        await client.AuthenticateAsync(config.Username, config.Password).ConfigureAwait(false);

                    await client.SendAsync(message).ConfigureAwait(false);
                    await client.DisconnectAsync(true).ConfigureAwait(false);
                }

                return (true, null);
            }
            catch (Exception ex)
            {
                Utilities.CreateLogger<EmailSender>().LogError(LoggingEvents.SEND_EMAIL, ex, "An error occurred whilst sending email");
                return (false, ex.Message);
            }
        }
    }



    public class SmtpConfig
    {
        public string Host { get; set; }
        public int Port { get; set; }
        public bool UseSSL { get; set; }

        public string Name { get; set; }
        public string Username { get; set; }
        public string EmailAddress { get; set; }
        public string Password { get; set; }
    }
}
