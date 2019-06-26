using System;
using System.Linq;
using System.Web.Http;
using static EmailServicesAPI.Context.DatabaseContext;

namespace EmailServicesAPI.Controllers
{
    public class PeopleController : ApiController
    {
        // Response
            // Returns a dictionary of objects, each representing a person
            // Each person object is itself a Map structured
            // object with an 'id' as key and other values
            // which are EmailsSent, EmailsReceived, 
            // DomainName, EmailName, and EmailAddress.
        // Parameters
            // startDate (optional) : DateTime object
            // endDate (optional) : DateTime object
        // Note
            // This will NOT throw an error when the startDate
            // or endDate format is incorrect. Instead, it will
            // take 'DateTime.MaxValue' and 'DateTime.MinValue'
            // The correct format is YYYY-MM-DDThh:mm:ss

        private VenContext db
            = VenioWebApiHelper.getDatabaseContext();

        [HttpGet]
        public IHttpActionResult Get(
            // Optional Parameters
            [FromUri] DateTime? startDate = null,
            [FromUri] DateTime? endDate = null
            )
        {

            // Check the dateStart and dateEnd values
            // from the GET request
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


            // Convert the database to a list (or any iterable
            // interface) so that each of the variables
            // further querying from this variable will
            // be a list or an array
            var emailAddresses = db.EmailAddresses
                .ToList();

            // Create a new variable with all
            // recieved emails and user id

            long unknownsID = 
                VenioWebApiHelper.getUnknowns();

            var tbl_emails_received =
                emailAddresses
                .Where(
                    x => x.Date >= startDate && x.Date <= endDate
                    )
                .Where(tbl =>
                        tbl.RecepientID != unknownsID
                        &&
                        tbl.SenderID != unknownsID)
                .GroupBy(x => new { x.RecepientID })
                .Select(x => new
                {
                    x.Key.RecepientID,
                    EmailsRecieved = x.Count()

                });

            // Create a new variable with all
            // sent emails and user id
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

            // Combine the above two tables, tbl_emails_recieved
            // and tbl_emails sent by doing an outer left join
            // of the two tables to include all the
            // emailsSent and emailRecieved values
            // ( Convert null values to 0 )
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
            // DateTime start : DateTime object in the 
            // format 'YYYY-MM-DDTHH:MM:SS:mmm'
            // DateTime end : Same as above

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
                long unknownsID = 
                    VenioWebApiHelper.getUnknowns();

                // Exclude the unknown IDs from the table
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
                        tbl.RecepientID != unknownsID 
                        && 
                        tbl.SenderID != unknownsID)
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
        ///
        /// 
        /// Response
        /// 
        /// Returns an object of objects which include a 'domains'
        /// object, 'participants' object and 'timeseries' object,
        /// which represent participants, domains involved in an interaction
        /// This endpoint corresponds with the node or edge details
        /// section in the people-network-graph.
        /// 
        /// Parameters
        /// 
        /// senderID : (required) 
        /// recipientID : (optional)
        /// startDate : (optional)
        /// endDate : (optional)
        /// 
        ///

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
                            x.Date,
                            x.FileID,
                            x.SenderID,
                            x.RecepientID
                        }).ToList();


                // Count of emails sent by the 'SenderID' to 'recepientID'
                // Only one row if recepientID is specified as param
                var li_participants = 
                    li_emails_sender
                    .GroupBy(x => new { x.RecepientID })
                    .Select(x =>
                        new
                        {
                            x.Key.RecepientID,
                            EmailsReceived = x.Count()
                        });

                var tbl_union =
                    li_emails_sender
                    .Select(x =>
                           x.RecepientID)
                        .Union(
                           li_emails_sender
                           .Select( x => 
                                x.SenderID )
                        );

                // 'tbl_domain_count' is a linear
                // list of ids
                var tbl_domain_count =
                    (
                        from personId in tbl_union
                        join personRef in db.EmailAddressList.ToList()
                        on personId equals personRef.Id

                        select new
                        {
                            personRef.DomainName,
                            personRef.Id
                        }
                    )
                    .GroupBy( x => new { x.DomainName })
                    .Select( x =>
                        new
                        {
                            x.Key.DomainName,
                            TotalEmails = x.Count()
                        }
                    )
                    .OrderByDescending(x => 
                        x.TotalEmails
                        );
                    

                return Ok( 
                    new
                    {
                        participants = li_participants,
                        domains = tbl_domain_count
                    }
                );
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

            VenContext db = getDatabaseContext();

            long unknownsID = Convert.ToInt64((
                from ead in db.EmailAddressList
                where ead.EmailName == "[NO_NAME]"
                && ead.EmailAddress == "[NO_ADDRESS]"
                select ead.Id
            ).ToList().ElementAt(0));

            return unknownsID;

        }
    }

}
