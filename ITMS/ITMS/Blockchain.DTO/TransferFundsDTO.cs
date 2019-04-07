using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ITMS.Blockchain.DTO
{
    public class TransferFundsDTO
    {
        public string batchId { get; set; }
        public string transactionId { get; set; }
        public DateTime timestamp { get; set; }
    }
}
