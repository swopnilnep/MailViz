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
    
    public partial class tbl_fd_ProjectDynamicFolder
    {
        public long DynamicFolderId { get; set; }
        public string DynamicFolderName { get; set; }
        public Nullable<long> ParentDynamicFolderId { get; set; }
        public string Lineage { get; set; }
        public long SortOrder { get; set; }
        public string DynamicFolderNote { get; set; }
        public string SearchSettings { get; set; }
        public bool IsPlaceholder { get; set; }
        public System.DateTime CreatedOn { get; set; }
        public long CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdatedOn { get; set; }
        public Nullable<long> UpdatedBy { get; set; }
        public long ClientId { get; set; }
    }
}