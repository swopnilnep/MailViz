//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace EmailDataAccess
{
    using System;
    using System.Collections.Generic;
    
    public partial class tbl_lg_UserActionLog
    {
        public long UserActionLogId { get; set; }
        public string Actiontype { get; set; }
        public string Log { get; set; }
        public string ReportingText { get; set; }
        public int UserId { get; set; }
        public Nullable<System.DateTime> Timestamp { get; set; }
    }
}