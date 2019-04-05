using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ITMS.Blockchain.DTO
{
    public class PrepareSettlementDTO
    {
        public string batchId { get; set; }
        public RateDTO[] rates { get; set; }
        public string companyId { get; set; }
        public string transactionId { get; set; }
        public DateTime timestamp { get; set; }
    }

    public class RateDTO
    {
        public string to { get; set; }
        public decimal rate { get; set; }
    }
}
