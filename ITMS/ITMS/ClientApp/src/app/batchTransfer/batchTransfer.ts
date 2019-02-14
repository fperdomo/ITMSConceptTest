export interface BatchTransfer {
  batchId: string;
  state: string;
  settlement: Settlement;
  rates: Rate[];
}

export interface Settlement {
  currency: string;
  amount: number;
  date: Date;
  creditor: string;
  debtor: string;
}


export interface Rate {
  to: string;
  rate: string;
}
