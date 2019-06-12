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

        //[Key, Column("GroupDate")]
        //public string Date { get; set; }

        public virtual EmailAddressList Sender { get; set; }
        public virtual EmailAddressList Recipient { get; set; }
    }

}