export interface DataRow {
    _id: string;
    location: string;
    potentialRevenue: {
      value: number;
      percentage: number;
    };
    competitorProcessingVolume: {
      value: number;
      percentage: number;
    };
    competitorMerchant: number;
    revenuePerAccount: number;
    marketShareByRevenue: number;
    commercialDDAs: number;
    type?: 'location' | 'branch';
    parentLocation?: string;
  }