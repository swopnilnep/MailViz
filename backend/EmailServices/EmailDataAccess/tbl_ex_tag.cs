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
    
    public partial class tbl_ex_tag
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public tbl_ex_tag()
        {
            this.tbl_ex_SearchTermsTagAssociation = new HashSet<tbl_ex_SearchTermsTagAssociation>();
            this.tbl_ex_TagHistory = new HashSet<tbl_ex_TagHistory>();
            this.tbl_rev_ReviewSetInfo = new HashSet<tbl_rev_ReviewSetInfo>();
            this.tbl_rev_TagSortOrder = new HashSet<tbl_rev_TagSortOrder>();
            this.tbl_VAR_CategoryInfo = new HashSet<tbl_VAR_CategoryInfo>();
            this.tbl_VAR_CategoryInfo1 = new HashSet<tbl_VAR_CategoryInfo>();
            this.tbl_VAR_ProfileInfo = new HashSet<tbl_VAR_ProfileInfo>();
        }
    
        public long TagID { get; set; }
        public string TagName { get; set; }
        public bool IsSystemTag { get; set; }
        public string Description { get; set; }
        public int SortOrder { get; set; }
        public long ParentTagId { get; set; }
        public string TagIdLineage { get; set; }
        public bool EnforceChildTagRule { get; set; }
        public string TagSecurityLevel { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tbl_ex_SearchTermsTagAssociation> tbl_ex_SearchTermsTagAssociation { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tbl_ex_TagHistory> tbl_ex_TagHistory { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tbl_rev_ReviewSetInfo> tbl_rev_ReviewSetInfo { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tbl_rev_TagSortOrder> tbl_rev_TagSortOrder { get; set; }
        public virtual tbl_tg_TagGroupAssociation tbl_tg_TagGroupAssociation { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tbl_VAR_CategoryInfo> tbl_VAR_CategoryInfo { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tbl_VAR_CategoryInfo> tbl_VAR_CategoryInfo1 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tbl_VAR_ProfileInfo> tbl_VAR_ProfileInfo { get; set; }
    }
}