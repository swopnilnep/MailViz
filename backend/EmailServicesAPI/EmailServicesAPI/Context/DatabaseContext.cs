using EmailServicesAPI.Models;
using System.Data.Entity;

namespace EmailServicesAPI.Context
{
    public class DatabaseContext : DbContext
    {

        public class VenContext : DbContext
        {
            public VenContext(string connectionstring)
                : base(connectionstring) { }

            public DbSet<EmailAddresses> EmailAddresses { get; set; }
            public DbSet<EmailAddressList> EmailAddressList { get; set; }
            public DbSet<EmailMeta> EmailMeta { get; set; }
        }

    }
}