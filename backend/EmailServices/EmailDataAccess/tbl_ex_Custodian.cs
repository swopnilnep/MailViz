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
    
    public partial class tbl_ex_Custodian
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public tbl_ex_Custodian()
        {
            this.tbl_ex_Media = new HashSet<tbl_ex_Media>();
        }
    
        public long CustodianId { get; set; }
        public string CustodianName { get; set; }
        public Nullable<System.DateTime> CreatedOn { get; set; }
        public Nullable<System.DateTime> LastUpdateOn { get; set; }
        public bool CustodianDupOnProgress { get; set; }
        public Nullable<long> Priority { get; set; }
        public string CustodianDedupeLockHolder { get; set; }
        public Nullable<long> CustodianDedupeLockHolderMedia { get; set; }
        public string TzTimeZone { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tbl_ex_Media> tbl_ex_Media { get; set; }
    }
}