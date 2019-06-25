using System;
using System.Linq;
using System.Web.Http;
using static EmailServicesAPI.Context.DatabaseContext;

namespace EmailServicesAPI.Controllers
{
    public class PeopleController : ApiController
    {
        // Response
            // Returns a dictionary of 'Person' objects
            // Each person object is itself a Map structured
            // object with an 'id' as key and other values
            // which are EmailsSent, EmailsReceived, 
            // DomainName, EmailName, and EmailAddress.
        // Parameters

        private VenContext db
            = VenioWebApiHelper.getDatabaseContext();

        [HttpGet]
        public IHttpActionResult Get(
            [FromUri] DateTime? startDate = null,
            [FromUri] DateTime? endDate = null
            )
        {

            // Check the request dateStart and dateEnd values
            if (startDate.HasValue && endDate.HasValue)
            {

                if (startDate >= endDate)
                    return Content(
                        System.Net.HttpStatusCode.BadRequest,
                        "End Date cannot be same as or before Start Date");
            }
            else
            {
                //if (!endDate.HasValue) // 'end' has no value
                //    endDate = DateTime.MaxValue;
                //if (!startDate.HasValue) // 'start' has no value
                //    startDate = DateTime.MinValue;
            }

            var emailAddresses = db.EmailAddresses
                .ToList();

            //Create a new variable with all
            // recieved emails and user id
            var tbl_emails_received =
                emailAddresses
                .Where(
                    x => x.Date >= startDate && x.Date <= endDate
                    )
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
                .Where(
                    x => x.Date >= startDate && x.Date <= endDate
                    )
                .GroupBy(x => new { x.SenderID })
                .Select(x => new
                {
                    x.Key.SenderID,
                    EmailsSent = x.Count()
                });

            var tbl_usr_counts = (
                    from email in emailAddresses
                    join sent in tbl_emails_sent
                    on email.Id equals sent.SenderID
                into s
                    from sent in s.DefaultIfEmpty()
                    join received in tbl_emails_received
                    on email.Id equals received.RecepientID
                into r
                    from received in r.DefaultIfEmpty()
                    select new {
                        email.Id,

                        EmailsSent = 
                            ( sent == null )? 0 : sent.EmailsSent,
                        EmailsReceived = 
                            ( received == null)? 0 : received.EmailsRecieved,
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
                        personCounts.EmailsSent,
                        personCounts.EmailsReceived,
                        personName.EmailAddress,
                        personName.EmailName,
                        personName.DomainName,
                        
                    }
                );

            try
            {
                return Ok(

                    tbl_usr_counts_and_info
                    .OrderBy(x => x.Id)
                    .ToDictionary(x => x.Id)

                    );
            }
            catch (Exception e)
            {
                return InternalServerError();
            }
        }
    }

    public class InteractionsController : ApiController
    {
        // Response
            // Returns an array of Interactions; each interaction
            // contains a 'SenderID', 'RecepientID' and the number
            // of emails sent by the sender to the recepient, within the
            // specified timeframe.
        // Parameters
            // DateTime start : DateTime object in the format 'YYYY-MM-DD'
            // DateTime end

        private VenContext db =
            VenioWebApiHelper.getDatabaseContext();

        [HttpGet]
        public IHttpActionResult Get(
            [FromUri] DateTime? startDate = null, 
            [FromUri] DateTime? endDate = null
            )
        {

            // Check the request dateStart and dateEnd values
            if (startDate.HasValue && endDate.HasValue)
            {

                if (startDate >= endDate)
                    return Content(
                        System.Net.HttpStatusCode.BadRequest,
                        "End Date cannot be same as or before Start Date");
            } else
            {
                if (!endDate.HasValue) // 'end' has no value
                    endDate = DateTime.MaxValue;
                if (!startDate.HasValue) // 'start' has no value
                    startDate = DateTime.MinValue;
            }

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
                        tbl.Date >= startDate && tbl.Date <= endDate)
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
                           EmailCount = tbl.Count()
                       }
                    );

                return Ok(query.OrderBy(x => x.SenderID));
            }
            catch (Exception e)
            {
                return InternalServerError();
            }
        }

    }

    public class DetailsController : ApiController
    {
        // Response
        // Parameters

        private VenContext db =
            VenioWebApiHelper.getDatabaseContext();

        [HttpGet]
        public IHttpActionResult Get(

            // senderID required parameter. Initializes
            // to -2147483648 if not supplied
            [FromUri] int? senderID = int.MinValue,
            [FromUri] int? recipientID = null,
            [FromUri] DateTime? startDate = null,
            [FromUri] DateTime? endDate = null
            )
        {
            // Verify SenderID Value is Provided
            if (senderID == int.MinValue)
            {
                return Content(
                    System.Net.HttpStatusCode.BadRequest,
                    "Error: Please supply a value for senderID"
                    );
            }

            // Based on whether the query is being done
            // for a 'node' or an 'edge' in the frontend
            // Email Network Graph
            bool recipientIsProvided = false;
            if (recipientID != null)
            {
                recipientIsProvided = true;
            }

            // Check the request dateStart and dateEnd values
            if (startDate.HasValue && endDate.HasValue)
            {

                if (startDate >= endDate)
                    return Content(
                        System.Net.HttpStatusCode.BadRequest,
                        "End Date cannot be same as or before Start Date");
            }
            else
            {
                if (!endDate.HasValue) // 'end' has no value
                    endDate = DateTime.MaxValue;
                if (!startDate.HasValue) // 'start' has no value
                    startDate = DateTime.MinValue;
            }

            try
            {

                // Create a table of all emails sent by one person
                var tbl_emails_sender =
                    db.EmailAddresses
                    .Where(x => 
                            (x.SenderID == senderID)
                        &&
                            (x.Date >= startDate && x.Date <= endDate)
                        );

                if ( recipientIsProvided )
                {
                    tbl_emails_sender = tbl_emails_sender
                        .Where(x => x.RecepientID == recipientID);
                }

                var li_emails_sender = tbl_emails_sender
                    .Select(x =>
                        new
                        {
                            x.Id,
                            x.FileID,
                            x.SenderID,
                            x.RecepientID,
                            x.Date
                        }).ToList();


                // Count of emails sent by the 'SenderID' to 'recepientID'
                // Only one row if recepientID is specified as param
                var li_participants = li_emails_sender
                    .GroupBy(x => new { x.RecepientID })
                    .Select(x =>
                        new
                        {
                            x.Key.RecepientID,
                            EmailsReceived = x.Count()
                        });

                return Ok( li_participants );
            }
            catch (Exception e)
            {
                return InternalServerError();
            }
        }

    }

    public static class VenioWebApiHelper
    {

        // Purpose
            // Setup the Venio Database Context
            // by initializing the Connection
            // Using the Configuration Strings

        public static VenContext getDatabaseContext()
        {
            return new VenContext(
                System.Configuration
                .ConfigurationManager
                .ConnectionStrings["EmailDetailsEntities"]
                .ConnectionString
                );
        }

        public static long getUnknowns()
        {
            // Return the id that contains the unknown values
            long l = 0;
            return l;
        }
    }

}
