using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ITMS.Blockchain.DTO
{
    public class ResultDTO
    {
        public bool ResultOK { get; set; }
        public string Data { get; set; }

        public ResultDTO()
        {
            ResultOK = true;
            Data = string.Empty;
        }
    }
}
