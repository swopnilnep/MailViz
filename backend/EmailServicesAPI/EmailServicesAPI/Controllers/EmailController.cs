using System;
using System.Linq;
using System.Web.Http;
using static EmailServicesAPI.Context.DatabaseContext;

namespace EmailServicesAPI.Controllers
{
    public class EmailController : ApiController
    {
        private VenContext db = new VenContext(
            System.Configuration
            .ConfigurationManager
            .ConnectionStrings["EmailDetailsEntities"].ConnectionString
            );

        [HttpGet]
        public IHttpActionResult Get()
        {
            try
            {

                var result = (
                                from emailAddress in db.EmailAddresses
                                select new
                                {
                                    emailAddress.Id,
                                    emailAddress.Recipient,
                                    emailAddress.Sender,
                                    emailAddress.Date,
                                }
                            ).OrderBy(x => x.Id)
                            .Take(1000);

                return Ok(result);
            }
            catch (Exception e)
            {
                return InternalServerError();
            }
        }

    }
}
