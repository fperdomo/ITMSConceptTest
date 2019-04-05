using ITMS.Blockchain.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ITMS.Blockchain.Services
{
    public interface ITransactionServices
    {
        List<TransactionDTO> GetTransferRequest();

        ResultDTO SubmitTransferRequest(SubmitTransferRequestDTO submitTransferRequest);

        ResultDTO UpdateTrasferRequest(UpdateTrasferRequestDTO updateTrasferRequest);

        ResultDTO PrepareSettlement(PrepareSettlementDTO prepareSettlement);

        ResultDTO CompleteSettlement(CompleteSettlementDTO completeSettlement);

        ResultDTO TransferFunds(TransferFundsDTO transferFunds);
    }
}
