using System;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using static EmailServicesAPI.Context.DatabaseContext;

namespace EmailServicesAPI.Controllers
{
    public class EmailController : ApiController
    {
        private VenContext db = 
            VenioWebApiHelper.getDatabaseContext();

        [HttpGet]
        public IHttpActionResult Get()
        {
            try
            {
                // Selects the ID that does not have a name or an email
                // address and stores it as an integer (64Bit Signed)
                long unknownsID = Convert.ToInt64((
                        from ead in db.EmailAddressList
                        where ead.EmailName == "[NO_NAME]"
                        && ead.EmailAddress == "[NO_ADDRESS]"
                        select ead.Id
                    ).ToList().ElementAt(0));

                var query = db.EmailAddresses
                    .Select(x =>
                       new
                       {
                           x.SenderID,
                           x.RecepientID,
                       }
                    )
                    .Where(d => d.RecepientID != unknownsID && d.SenderID != unknownsID)
                    .GroupBy(s => new { s.SenderID, s.RecepientID })
                    .Select(g =>
                       new
                       {
                           g.Key.SenderID,
                           g.Key.RecepientID,
                           EmailsSent = g.Count()
                       }
                    ).OrderByDescending(g => g.EmailsSent);

                return Ok(query);
            }
            catch (Exception e)
            {
                return InternalServerError();
            }
        }

    }

    public class PeopleController : ApiController
    {

        private VenContext db = 
             VenioWebApiHelper.getDatabaseContext();

        [HttpGet]
        public IHttpActionResult Get()
        {
            try
            {

                var results = (
                    from people in db.EmailAddressList
                          select new
                              {
                                  people.Id,
                                  people.EmailName
                              }
                              ).ToList();

                return Ok(results);
            }
            catch (Exception e)
            {
                return InternalServerError();
            }
        }

    }

    public class TimeController : ApiController
    {
        private VenContext db =
            VenioWebApiHelper.getDatabaseContext();

        [HttpGet]
        public IHttpActionResult getDateTime(
            [FromUri] DateTime start, [FromUri] DateTime end
            )
        {

            if (start > end)
                return Content(System.Net.HttpStatusCode.BadRequest,
                    "End Date cannot be before Start Date");

            try
            {
                // Selects the ID that does not have a name or an email
                // address and stores it as an integer (64Bit Signed)
                long unknownsID = Convert.ToInt64((
                        from ead in db.EmailAddressList
                        where ead.EmailName == "[NO_NAME]"
                        && ead.EmailAddress == "[NO_ADDRESS]"
                        select ead.Id
                    ).ToList().ElementAt(0));

                var query = db.EmailAddresses
                    .Where(tbl =>
                        tbl.Date <= end && tbl.Date >= start)
                    .Select(tbl =>
                       new
                       {
                           tbl.SenderID,
                           tbl.RecepientID,
                       }
                    )
                    .Where(tbl => 
                        tbl.RecepientID != unknownsID && tbl.SenderID != unknownsID)
                    .GroupBy(tbl => new { tbl.SenderID, tbl.RecepientID })
                    .Select(tbl =>
                       new
                       {
                           tbl.Key.SenderID,
                           tbl.Key.RecepientID,
                           EmailsSent = tbl.Count()
                       }
                    ).OrderByDescending(tbl => tbl.EmailsSent);

                return Ok(query);
            }
            catch (Exception e)
            {
                return InternalServerError();
            }
        }

    }

    public static class VenioWebApiHelper
    {

        //
        // Public Accessors
        //

        public static VenContext getDatabaseContext()
        {
            return new VenContext(
                System.Configuration
                .ConfigurationManager
                .ConnectionStrings["EmailDetailsEntities"]
                .ConnectionString
                );
        }
    }

}
