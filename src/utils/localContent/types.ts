```typescript
export interface MandatoryCategory {
  titleAr: string;
  titleEn: string;
  percentage: number;
  items: Array<{
    nameEn: string;
    detailsEn: string;
    requirementsEn: string;
  }>;
}

export interface QRCodeData {
  type: string;
  date: string;
  issuer: string;
  version: string;
}

export interface LocalContentResult {
  totalPercentage: number;
  categoryBreakdown: CategoryBreakdown[];
  recommendations: string[];
}

export interface CategoryBreakdown {
  category: string;
  current: number;
  target: number;
  status: 'compliant' | 'non-compliant';
  details: CategoryDetail[];
}

export interface CategoryDetail {
  item: string;
  percentage: number;
  contribution: number;
}
```