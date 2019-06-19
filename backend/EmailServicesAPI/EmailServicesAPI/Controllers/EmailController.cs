using System;
using System.Linq;
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

    //public class PeopleController : ApiController
    //{

    //    private VenContext db =
    //         VenioWebApiHelper.getDatabaseContext();

    //    [HttpGet]
    //    public IHttpActionResult Get()
    //    {
    //        try
    //        {

    //            var results = (
    //                from people in db.EmailAddressList
    //                select new
    //                {
    //                    people.Id,
    //                    people.EmailName
    //                }
    //                          ).ToList();

    //            return Ok(results);
    //        }
    //        catch (Exception e)
    //        {
    //            return InternalServerError();
    //        }
    //    }

    //}

    public class PeopleController : ApiController
    {
        private VenContext db
            = VenioWebApiHelper.getDatabaseContext();

        [HttpGet]
        public IHttpActionResult Get()
        {

            var emailAddresses = db.EmailAddresses.ToList();

            //Create a new variable with all
            // recieved emails and user id
            var tbl_emails_received =
                emailAddresses
                .GroupBy(x => new { x.RecepientID })
                .Select(x => new
                {
                    x.Key.RecepientID,
                    EmailsRecieved = x.Count()

                });

            // Create a new variable with all
            // sent emails and usr id
            var tbl_emails_sent =
                emailAddresses
                .GroupBy(x => new { x.SenderID })
                .Select(x => new
                {
                    x.Key.SenderID,
                    EmailsSent = x.Count()
                });

            // Join the above two tables
            // and add a column TotalEmails
            var tbl_usr_counts = (
                    from er in tbl_emails_received
                    join es in tbl_emails_sent
                    on er.RecepientID equals es.SenderID
                    select new
                    {
                        Id = er.RecepientID,
                        //er.EmailsRecieved,
                        //es.EmailsSent,
                        TotalEmails = er.EmailsRecieved + es.EmailsSent,
                    }
                );

            // Merge the 'tbl_usr_counts' table
            // With the name and EmailName of Each User
            var tbl_usr_counts_and_info = (
                    from personCounts in tbl_usr_counts
                    join personName in db.EmailAddressList.ToList()
                    on personCounts.Id equals personName.Id
                    select new
                    {
                        personName.Id,
                        personCounts.TotalEmails,
                        personName.EmailAddress,
                        personName.EmailName,
                        personName.DomainName
                    }
                );

            try
            {
                return Ok(

                    tbl_usr_counts_and_info.ToDictionary(x => x.Id)

                    );
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
