export interface Company {
  companyId: number;
  companyName: string;
  workingCurrency: string;
  fundBalance: number;
}


export interface PrepareSettlement {
  $class: string; //com.itms.PrepareSettlement
  batchId: string;
  rates: Rate[];
  companyId: string
  transactionId: string;
  timestamp: Date;
}

export interface Rate {
  $class: string; //com.itms.PrepareSettlement
  to: string;
  rate: number;
}
