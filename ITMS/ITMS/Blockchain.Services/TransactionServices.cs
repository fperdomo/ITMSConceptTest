using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ITMS.Blockchain.DTO;
using System.Net.Http;
using System.Text;
using Newtonsoft.Json;
using System.Net.Http.Headers;

namespace ITMS.Blockchain.Services
{
    public class TransactionServices : ITransactionServices
    {
        private static readonly HttpClient _client = new HttpClient();
        private string _pathBase = "http://104.196.27.3:3000/api";
        private string _token = "KNvSh8y8Z0VSR8QVb2WRDUEr4Ix923HyKaVs4yVkHCEh0iAmWn9uFDgY6VzuS5Ed";
        
        public ResultDTO CompleteSettlement(CompleteSettlementDTO completeSettlement)
        {
            var result = new ResultDTO();
            try
            {
                string path = _pathBase + "/CompleteSettlement";
                result = Post(path, completeSettlement);
            }
            catch (Exception)
            {
                //TODO: Manage the exceptions
                throw;
            }
            return result;
        }

        public List<TransactionDTO> GetTransferRequest()
        {
            var result = new List<TransactionDTO>();

            try
            {
                string path = _pathBase + "/TransferRequest";
                ResultDTO resultGet = Get(path);
                if (resultGet.ResultOK)
                    result = JsonConvert.DeserializeObject<List<TransactionDTO>>(resultGet.Data);           
            }
            catch (Exception)
            {
                throw;
            }            

            return result;
        }

        public ResultDTO PrepareSettlement(PrepareSettlementDTO prepareSettlement)
        {
            var result = new ResultDTO();
            try
            {
                string path = _pathBase + "/PrepareSettlement";
                result = Post(path, prepareSettlement);
            }
            catch (Exception)
            {
                //TODO: Manage the exceptions
                throw;
            }
            return result;
        }

        public ResultDTO SubmitTransferRequest(SubmitTransferRequestDTO submitTransferRequest)
        {
            var result = new ResultDTO();
            try
            {
                string path = _pathBase + "/SubmitTransferRequest";
                result = Post(path, submitTransferRequest);
            }
            catch (Exception)
            {
                //TODO: Manage the exceptions
                throw;
            }         
            return result;
        }

        public ResultDTO TransferFunds(TransferFundsDTO transferFunds)
        {
            var result = new ResultDTO();
            try
            {
                string path = _pathBase + "/TransferFunds";
                result = Post(path, transferFunds);
            }
            catch (Exception)
            {
                //TODO: Manage the exceptions
                throw;
            }
            return result;
        }

        public ResultDTO UpdateTrasferRequest(UpdateTrasferRequestDTO updateTrasferRequest)
        {
            var result = new ResultDTO();
            try
            {
                string path = _pathBase + "/UpdateTrasferRequest";
                result = Post(path, updateTrasferRequest);
            }
            catch (Exception)
            {
                //TODO: Manage the exceptions
                throw;
            }
            return result;
        }

        #region HTTPMethod

        private ResultDTO Post(string path, object data)
        {
            var result = new ResultDTO();
            try
            {
                _client.DefaultRequestHeaders.Accept.Clear();
                _client.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/json"));
                _client.DefaultRequestHeaders.Add("Authorization", _token);
                
                var dataJson = JsonConvert.SerializeObject(data);
                var content = new StringContent(dataJson, Encoding.UTF8, "application/json");   
                var response = _client.PostAsync(path, content).Result;
                var responseString = response.Content.ReadAsStringAsync();
                if (response.StatusCode != System.Net.HttpStatusCode.OK)
                {
                    result.ResultOK = false;
                    //[fperdomo] : Tracear a LOG el error
                }
            }
            catch (Exception ex)
            {
                result.ResultOK = false;
                result.Data = ex.Message;
            }

            return result;
        }

        private ResultDTO Get(string path)
        {
            var result = new ResultDTO();
            try
            {
                _client.DefaultRequestHeaders.Accept.Clear();
                _client.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/json"));
                _client.DefaultRequestHeaders.Add("Authorization", _token);

                var response = _client.GetAsync(path).Result;
                var responseString = response.Content.ReadAsStringAsync();
                result.Data = responseString.Result;
                if (response.StatusCode != System.Net.HttpStatusCode.OK)
                {
                    result.ResultOK = false;
                    //[fperdomo] : Tracear a LOG el error
                }                
                return result;
            }
            catch (Exception ex)
            {
                result.ResultOK = false;
                result.Data = ex.Message;
            }

            return result;
        }

        #endregion
    }
}
