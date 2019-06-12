using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace EmailServicesAPI.Models
{

    [Table("tbl_ex_emailaddresslist")]
    public class EmailAddressList
    {
        [Key, Column("EmailAddressID")]
        public long Id { get; set; }
        public string EmailAddress { get; set; }
        public string EmailName { get; set; }
    }

    [Table("tbl_ex_EmailAddresses")]
    public class EmailAddresses
    {
        [Key, Column("EmailAddressID")]
        public long Id { get; set; }

        [ForeignKey("Sender")]
        public long SenderID { get; set; }

        [ForeignKey("Recipient")]
        public long RecepientID { get; set; }

        [ Column("GroupDate")]
        public DateTime? Date { get; set; }

        //[NotMapped]
        //public string Year {  get {return Date?.Year.ToString(); } }
        //[NotMapped]
        //public string Month { get { return Date?.Month.ToString(); } }
        //[NotMapped]
        //public string Day { get { return Date?.Day.ToString(); } }

        public virtual EmailAddressList Sender { get; set; }
        public virtual EmailAddressList Recipient { get; set; }
    }

}