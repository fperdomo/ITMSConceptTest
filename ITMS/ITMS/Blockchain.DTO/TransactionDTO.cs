using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ITMS.Blockchain.DTO
{
    public class TransactionDTO
    {
        public string RequestId { get; set; }
        public TransactionDetailDTO Details { get; set; }
        public string State { get; set; }
        public string FromCompany { get; set; }
        public string ToCompany { get; set; }
    }

    public class TransactionDetailDTO
    {
        public string Currency { get; set; }
        public string Amount { get; set; }
        public string Date { get; set; }
        public string Description { get; set; }
        public string ReasonsRejected { get; set; }
    }
}
