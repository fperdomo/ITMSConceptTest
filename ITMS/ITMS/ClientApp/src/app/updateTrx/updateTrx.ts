export interface UpdateTrx {
  $class: string; //"com.itms.SubmitTransferRequest";
  requestId: string;
  state: string;
  reasonsRejected: string;
  transactionId: string;
  timestamp: Date;
}


