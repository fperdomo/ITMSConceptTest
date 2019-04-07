using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ITMS.Blockchain.DTO;
using ITMS.Blockchain.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ITMS.Controllers
{
    public class HelloWorldController : Controller
    {
        ITransactionServices services = new TransactionServices();

        // GET: /HelloWorld/
        public string Index()
        {
            return services.GetTransferRequest().FirstOrDefault().RequestId;
        }

        // 
        // GET: /HelloWorld/Welcome/ 
        public string Welcome()
        {
            SubmitTransferRequestDTO tmpDto = new SubmitTransferRequestDTO()
            {
                requestId = "ret20190405_2",
                toCompanyId = "companyA",
                details = new SubmitTransferRequestDetailDTO()
                {
                    currency = "USD",
                    amount = 125.5M,
                    date = new DateTime(),
                    description = "Description ret20190405_1",
                    reasonsRejected = string.Empty
                }
            };

            services.SubmitTransferRequest(tmpDto);


            return "This is the Welcome action method...";
        }
    }
}
