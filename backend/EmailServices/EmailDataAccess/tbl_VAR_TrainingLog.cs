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
    
    public partial class tbl_VAR_TrainingLog
    {
        public long TrainingLogID { get; set; }
        public long JobID { get; set; }
        public Nullable<System.DateTime> TrainingStartedOn { get; set; }
        public Nullable<System.DateTime> TrainingCompletedOn { get; set; }
        public Nullable<int> ProfileID { get; set; }
        public string TrainingDetails { get; set; }
        public string TrainingModelID { get; set; }
    }
}