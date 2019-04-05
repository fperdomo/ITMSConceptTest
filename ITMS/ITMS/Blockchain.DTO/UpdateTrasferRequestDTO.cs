using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ITMS.Blockchain.DTO
{
    public class UpdateTrasferRequestDTO
    {
        public string requestId { get; set; }
        public State state { get; set; }
        public string reasonsRejected { get; set; }
        public string transactionId { get; set; }
        public DateTime timestamp { get; set; }
    } 
}
