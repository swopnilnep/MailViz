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

        // Get all data for all email address ids
        public IEnumerable< tbl_ex_EmailAddresses > Get()
        {

            using (EmailDetailsEntities entities = new EmailDetailsEntities())
            {
                return entities.tbl_ex_EmailAddresses.ToList();
            }

        }

        // Get data by email address id
        public tbl_ex_EmailAddresses Get(int id)
        {
            using(EmailDetailsEntities entities = new EmailDetailsEntities())
            {
                return entities.tbl_ex_EmailAddresses.FirstOrDefault(e => e.EmailAddressID == id);
            }
        }



    }
}
