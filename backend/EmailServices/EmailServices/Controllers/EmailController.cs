using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using EmailDataAccess;

namespace EmailServices.Controllers
{
    public class EmailController : ApiController
    {

        // Get all email addresses (and related entires)
        public IEnumerable< tbl_ex_EmailAddresses > Get()
        {

            using (EmailDetailsEntities entities = new EmailDetailsEntities())
            {
                return entities.tbl_ex_EmailAddresses.ToList();
            }

        }

        // Get email address by id (and related entries)
        public tbl_ex_EmailAddresses Get(int id)
        {
            using(EmailDetailsEntities entities = new EmailDetailsEntities)
            {
                return entities.tbl_ex_EmailAddresses.FirstOrDefault(e => e.EmailAddressID == id);
            }
        }

    }
}
