using System;
using System.Linq;
using System.Web.Http;
using static EmailServicesAPI.Context.DatabaseContext;
using static System.Data.Entity.SqlServer.SqlFunctions;

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
            // The correct format is YYYY-MM-DDThh:mm:ss or
            // any other format that is supported in the C#
            // 'DateTime' class constructor

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
                VenioWebApiHelper.getUnknown();

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

        /// <summary>
        ///  
        /// Response
        ///     Returns an array of Interactions of all the people
        ///     (email addresses) in the database, in the given
        ///     timespan, who sent or recieved emails.
        ///     
        ///     Each 'Interaction' within the array contains a 
        ///     'SenderID', 'RecepientID' and the number of emails
        ///     sent by the sender to the recepient (in the specified
        ///     timeframe)
        ///     
        ///     If no timespan is provided, the default timespan that
        ///     will be taken is DateTime.MinValue and DateTime.MaxValue
        ///     respectively
        ///     
        /// Parameters
        ///     (required parameters)
        /// 
        ///     (optional parameters)
        ///     startDate : DateTime Object (accepts any format
        ///         in the DateTime class constructor)
        ///     endDate : DateTime Object (same as above)     
        ///     
        /// 
        /// </summary>

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
                    VenioWebApiHelper.getUnknown();

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
        /// 
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

    public class TimeAggregateController : ApiController
    {

        /// <summary>
        /// 
        /// Response
        ///     This  controller aggregates
        ///     count values based on the given timespan.
        ///     (Takes 0001/01/01 to 9999/12/31 if timespan
        ///     not provided). For each "viewBy" argument,
        ///     it groups by that argument and displays 
        ///     the number of emails grouped by that argument.
        ///     The default viewBy argument is "month". 
        ///     
        ///     In the default case,
        ///     the response would be 12 objects respective to
        ///     the 12 months with the count of emails in each
        ///     month.
        ///     
        /// Parameters
        /// 
        ///     senderID : number corresponding to senderIDs
        ///         in the database (required)
        /// 
        ///     recepientID : number corresponding to recepientIDs
        ///         in the database (optional)
        ///     startDate : DateTime object (optional)
        ///     endDate : DateTime object (optional)
        ///     viewBy : string
        ///     
        ///         Accepted Values for 'viewBy'
        ///             * "month" (12 * month of year)
        ///             * "weekday" (7 * day of week)
        ///             * "year" (all years in the timespan)
        ///             * "quarter" (4 * 3 month-intervals)
        ///             * "hour" (24 * hour of day)
        ///     
        /// </summary>

        private VenContext db
            = VenioWebApiHelper.getDatabaseContext();

        [HttpGet]
        public IHttpActionResult Get(

            // (required)
            [FromUri] int? senderID = int.MinValue, 

            // (optional)
            [FromUri] DateTime? startDate = null,
            [FromUri] DateTime? endDate = null,
            [FromUri] int? recepientID = int.MinValue,
            [FromUri] string viewBy = "month"

            )
        {
            try
            {

                var dateParts =
                    
                    (
                        from email in db.EmailAddresses
                        select new
                        {
                            email.FileID,
                            email.Date,
                            email.SenderID,
                            email.RecepientID
                        }
                    );

                if (senderID != int.MinValue) {
                    dateParts = dateParts
                        .Where(x =>
                            x.SenderID == senderID
                            );
                }
                else
                {
                    return Content(
                        System.Net.HttpStatusCode.BadRequest,
                        "'SenderID' is a required parameter");
                }

                if (recepientID != int.MinValue) dateParts =
                        dateParts
                        .Where(x =>
                           x.RecepientID == recepientID
                        );

                if (!startDate.HasValue)
                    startDate = DateTime.MinValue;

                if (!endDate.HasValue)
                    endDate = DateTime.MaxValue;

                dateParts = dateParts
                    .Where(x =>

                       startDate <= x.Date
                       &&
                       endDate >= x.Date

                    );

                Object result;

                var dateExtract = dateParts
                   .Select(x =>
                   new
                   {
                       x.FileID,
                       DayOfWeek = DatePart("weekday", x.Date),
                       Year = DatePart("year", x.Date),
                       Month = DatePart("month", x.Date),
                       Hour = DatePart("hour", x.Date),
                       Quarter = DatePart("quarter", x.Date)

                   });

                // Aggregate by the given viewBy param
                if ( viewBy == "month")
                {
                    result = dateExtract
                        .GroupBy(x => new { x.Month })
                        .Select(x => new
                        {
                            x.Key.Month,
                            totalEmails = x.Count()
                        });
                }
                else if ( viewBy == "year" )
                {
                    result = dateExtract
                        .GroupBy(x => new { x.Year })
                        .Select(x => new
                        {
                            x.Key.Year,
                            totalEmails = x.Count()

                        })
                        .OrderBy( x => x.Year );
                }
                else if ( viewBy == "weekday" )
                {
                    result = dateExtract
                        .GroupBy(x => new { x.DayOfWeek })
                        .Select(x => new
                        {
                            x.Key.DayOfWeek,
                            totalEmails = x.Count()

                        })
                        .OrderBy( x => x.DayOfWeek );
                }
                else if ( viewBy == "hour" )
                {
                    result = dateExtract
                        .GroupBy(x => new { x.Month })
                        .Select(x => new
                        {
                            x.Key.Month,
                            totalEmails = x.Count()

                        })
                        .OrderBy( x => x.Month );
                }
                else if ( viewBy == "quarter" )
                {
                    result = dateExtract
                        .GroupBy(x => new { x.Quarter })
                        .Select(x => new
                        {
                            x.Key.Quarter,
                            totalEmails = x.Count()

                        })
                        .OrderBy( x => x.Quarter );
                }
                else
                {
                    return Content(
                        System.Net.HttpStatusCode.BadRequest,
                        "Error: '" 
                        + viewBy 
                        + "' is not a valid 'viewBy' parameter");
                }

                return Ok( result );
            }
            catch
            {
                return InternalServerError();
            }

        }
    }

    public class TimestreamController : ApiController
    {
        /// 
        /// Response
        /// 
        /// 
        /// 
        /// Parameters
        /// 
        /// 
        /// 

        private VenContext db =
            VenioWebApiHelper.getDatabaseContext();

        [HttpGet]
        public IHttpActionResult Get(
            [FromUri] int senderID = int.MinValue,
            [FromUri] int recepientID = int.MinValue,
            [FromUri] DateTime? startDate = null,
            [FromUri] DateTime? endDate = null,
            [FromUri] string bucket = ""
            )
        {
            try
            {

                var filterQuery =
                    from email in db.EmailAddresses
                    select new
                    {
                        email.FileID,
                        email.Date,
                        email.SenderID,
                        email.RecepientID
                    };

                // Filter for SenderID
                if ( senderID == int.MinValue)
                {
                    return Content(
                        System.Net.HttpStatusCode.BadRequest,
                        "Error : SenderID is a required parameter"
                        );
                } else
                {
                    filterQuery = filterQuery
                        .Where(x => x.SenderID == senderID );
                }

                // Filter for RecepientID
                if ( recepientID != int.MinValue)
                {
                    filterQuery = filterQuery
                        .Where(x => x.RecepientID == recepientID);
                }

                // Filter for startDate and endDate
                if ( startDate.HasValue )
                {
                    filterQuery = filterQuery
                        .Where(x => x.Date >= startDate);
                }

                if ( endDate.HasValue)
                {
                    filterQuery = filterQuery
                        .Where(x => x.Date <= endDate);
                }

                if (bucket == "" ) bucket = "month";

                // Filter with DateParts

                var mainQuery = filterQuery
                    .Select(x =>
                       new
                       {
                           x.FileID,
                           Year = DatePart("year", x.Date),
                           Month = DatePart("month", x.Date),
                           Week = DatePart("week", x.Date)
                       });

                Object result;
                
                if ( bucket == "month")
                {
                    result = mainQuery
                        .GroupBy(x =>
                           new
                           {
                               x.Year,
                               x.Month
                           })
                        .Select(x =>
                           new
                           {
                               x.Key.Year,
                               x.Key.Month,
                               totalEmails = x.Count()
                           });
                }
                else if ( bucket == "year" )
                {
                    result = mainQuery
                        .GroupBy(x =>
                            new
                            {
                                x.Year
                            })
                        .Select(x =>
                            new
                            {
                                x.Key.Year,
                                totalEmails = x.Count()
                            });
                }
                else if ( bucket == "week" )
                {
                    result = mainQuery
                        .GroupBy(x =>
                           new
                           {
                               x.Year,
                               x.Week
                           })
                        .Select(x =>
                           new
                           {
                               x.Key.Year,
                               x.Key.Week,
                               totalEmails = x.Count()
                           });
                }
                else
                {
                    // invalid bucket was entered
                    return Content(
                        System.Net.HttpStatusCode.BadRequest,
                        "Error: Invalid 'bucket' parameter"
                        );
                }

                return Ok( result );
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

        public static long getUnknown()
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
