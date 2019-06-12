using EmailServicesAPI.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using static EmailServicesAPI.Context.DatabaseContext;

namespace EmailServicesAPI.Controllers
{
    public class EmailController : ApiController
    {


        // Creating an Instace of DatabaseContext class
        private VenContext db = new VenContext(System.Configuration.ConfigurationManager.ConnectionStrings["EmailDetailsEntities"].ConnectionString);

        // Creating a method to return Json data
        [HttpGet]
        public IHttpActionResult Get()
        {
            try
            {

                //var result = "Some Json Response";

                //var result = db.EmailAddresses.OrderBy(x => x.Id)
                                    //.Take(100) ;

                var result = (
                                from emailAddress in db.EmailAddresses
                                select new
                                {
                                    emailAddress.Id,
                                    emailAddress.Recipient,
                                    emailAddress.Sender,
                                    emailAddress.Date,
                                    //emailAddress.Year
                                }
                            ).OrderBy(x => x.Id)
                            .Take(1000);

                // Prepare data to be returned using Linq
                return Ok(result);
            }
            catch (Exception e)
            {
                // If any exception occurs, Internal Server Error
                return InternalServerError();
            }
        }

    }
}
