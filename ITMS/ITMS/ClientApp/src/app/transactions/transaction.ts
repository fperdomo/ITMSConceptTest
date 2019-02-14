export interface Transaction {
  requestId: number;
  fromCompany: string;
  toCompany: string;
  state: string;
  details: TransactionDetail;
}

export interface TransactionDetail {
  currency: string;
  amount: number;
  date: Date;
  description: string;
  reasonsRejected: number;
}

