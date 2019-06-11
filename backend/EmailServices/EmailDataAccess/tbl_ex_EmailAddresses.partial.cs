using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmailDataAccess
{
    public partial class tbl_ex_EmailAddresses
    {
        [ForeignKey("SenderID")]
        public virtual tbl_ex_emailaddresslist Sender { get; set; }

        [ForeignKey("RecepientID")]
        public virtual tbl_ex_emailaddresslist Recepient { get; set; }
    }
}
