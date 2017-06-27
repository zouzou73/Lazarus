using AspNet.Security.OpenIdConnect.Primitives;
using DAL.Core;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace lazarus.Helpers
{
    public static class Utilities
    {
        static ILoggerFactory _loggerFactory;


        public static void ConfigureLogger(ILoggerFactory loggerFactory)
        {
            _loggerFactory = loggerFactory;
        }


        public static ILogger CreateLogger<T>()
        {
            if (_loggerFactory == null)
            {
                throw new InvalidOperationException($"{nameof(ILogger)} is not configured. {nameof(ConfigureLogger)} must be called before use");
                //_loggerFactory = new LoggerFactory().AddConsole().AddDebug();
            }

            return _loggerFactory.CreateLogger<T>();
        }


        public static void QuickLog(string text, string filename)
        {
            string dirPath = Path.GetDirectoryName(filename);

            if (!Directory.Exists(dirPath))
                Directory.CreateDirectory(dirPath);

            using (StreamWriter writer = File.AppendText(filename))
            {
                writer.WriteLine($"{DateTime.Now} - {text}");
            }
        }




        public static string GetUserId(ClaimsPrincipal user)
        {
            return user.FindFirst(OpenIdConnectConstants.Claims.Subject)?.Value?.Trim();
        }


        //PatientIdentifier Claim not yet added on authentication
        public static int? GetPatientId(ClaimsPrincipal user)
        {
            if (user == null)
                return null;

            string patientId = user.FindFirst(CustomClaimTypes.PatientIdentifier)?.Value?.Trim();

            if (!string.IsNullOrWhiteSpace(patientId))
                return int.Parse(patientId);

            return null;
        }


        //ProviderIdentifier Claim not yet added on authentication
        public static int? GetProviderId(ClaimsPrincipal user)
        {
            if (user == null)
                return null;

            string providerId = user.FindFirst(CustomClaimTypes.ProviderIdentifier)?.Value?.Trim();

            if (!string.IsNullOrWhiteSpace(providerId))
                return int.Parse(providerId);

            return null;
        }


        public static string[] GetRoles(ClaimsPrincipal identity)
        {
            return identity.Claims
                .Where(c => c.Type == OpenIdConnectConstants.Claims.Role)
                .Select(c => c.Value)
                .ToArray();
        }
    }
}
