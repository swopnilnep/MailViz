using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

        [Column("FileID")]
        public long FileID { get; set; }

        [ForeignKey("Sender")]
        public long SenderID { get; set; }
        public virtual EmailAddressList Sender { get; set; }

        [ForeignKey("Recipient")]
        public long RecepientID { get; set; }
        public virtual EmailAddressList Recipient { get; set; }

        [ Column("GroupDate")]
        public DateTime? Date { get; set; }

    }

}