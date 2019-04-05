using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ITMS.Blockchain.DTO
{
    public class SubmitTransferRequestDTO
    {
        public string requestId { get; set; }
        public string toCompanyId { get; set; }
        public SubmitTransferRequestDetailDTO details { get; set; }
    }

    public class SubmitTransferRequestDetailDTO
    {
        public string currency { get; set; }
        public decimal amount { get; set; }
        public DateTime date { get; set; }
        public string description { get; set; }
        public string reasonsRejected { get; set; }
    }


}
