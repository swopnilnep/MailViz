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
    
    public partial class tbl_sm_samplinginfo
    {
        public long SampleID { get; set; }
        public string SampleName { get; set; }
        public string SamplePopulation { get; set; }
        public string SampleTagCondition { get; set; }
        public Nullable<int> TaggedBy { get; set; }
        public long PopulationSize { get; set; }
        public int ConfidenceLevel { get; set; }
        public int ConfidenceInterval { get; set; }
        public long SampleSize { get; set; }
        public string SamplePurpose { get; set; }
        public Nullable<int> SampleTrackingTagId { get; set; }
        public string SampleTrackingFor { get; set; }
        public string SampleAction { get; set; }
        public string SampleActionDetail { get; set; }
        public Nullable<System.DateTime> SampleDate { get; set; }
        public Nullable<long> SampleTrackingTagCount { get; set; }
        public Nullable<long> SamplePreviousTagCount { get; set; }
        public bool ExcludeNoText { get; set; }
        public bool ExcludeExistingProfileReviewset { get; set; }
        public bool ExcludeManualCatDocs { get; set; }
        public bool ExcludeTags { get; set; }
        public string ExcludeSelectedTag { get; set; }
        public int SamplePercent { get; set; }
        public int SampleNumber { get; set; }
        public string StratifiedBy { get; set; }
        public string StratifiedSettings { get; set; }
        public string QueryLog { get; set; }
    }
}