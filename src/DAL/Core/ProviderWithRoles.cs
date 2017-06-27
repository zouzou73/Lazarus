using DAL.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class ProviderWithRoles
    {
        public ProviderWithRoles()
        {
        }

        public ProviderWithRoles(Provider provider, string[] roles)
        {
            this.Provider = provider;
            this.Roles = roles;
        }

        public Provider Provider { get; set; }
        public string[] Roles { get; set; }
    }
}
