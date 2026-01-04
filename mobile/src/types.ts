export interface Investment {
  id: number;
  farmer_name: string;
  amount: number;
  crop: string;
  created_at: string;
}

export interface NewInvestmentData {
  farmer_name: string;
  amount: number;
  crop: string;
}
