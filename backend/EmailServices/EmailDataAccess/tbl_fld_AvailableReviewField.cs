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
    
    public partial class tbl_fld_AvailableReviewField
    {
        public Nullable<long> FieldId { get; set; }
        public long ReviewSetId { get; set; }
        public string FieldDisplayName { get; set; }
        public Nullable<bool> IsCustomField { get; set; }
    
        public virtual tbl_rev_ReviewSetInfo tbl_rev_ReviewSetInfo { get; set; }
    }
}