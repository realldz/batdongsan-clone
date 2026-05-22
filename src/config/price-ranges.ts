export interface PriceRange {
  label: string;
  min: number | undefined;
  max: number | undefined;
}

// Compact price ranges (e.g. used in HeroSearch on Home page)
export const salePriceRangesCompact: PriceRange[] = [
  { label: "Dưới 500 triệu", min: undefined, max: 500_000_000 },
  { label: "500 triệu - 1 tỷ", min: 500_000_000, max: 1_000_000_000 },
  { label: "1 - 3 tỷ", min: 1_000_000_000, max: 3_000_000_000 },
  { label: "3 - 5 tỷ", min: 3_000_000_000, max: 5_000_000_000 },
  { label: "5 - 10 tỷ", min: 5_000_000_000, max: 10_000_000_000 },
  { label: "10 - 20 tỷ", min: 10_000_000_000, max: 20_000_000_000 },
  { label: "Trên 20 tỷ", min: 20_000_000_000, max: undefined },
  { label: "Thỏa thuận", min: undefined, max: undefined },
];

export const rentPriceRangesCompact: PriceRange[] = [
  { label: "Dưới 3 triệu/tháng", min: undefined, max: 3_000_000 },
  { label: "3 - 5 triệu/tháng", min: 3_000_000, max: 5_000_000 },
  { label: "5 - 10 triệu/tháng", min: 5_000_000, max: 10_000_000 },
  { label: "10 - 15 triệu/tháng", min: 10_000_000, max: 15_000_000 },
  { label: "15 - 20 triệu/tháng", min: 15_000_000, max: 20_000_000 },
  { label: "20 - 30 triệu/tháng", min: 20_000_000, max: 30_000_000 },
  { label: "30 - 50 triệu/tháng", min: 30_000_000, max: 50_000_000 },
  { label: "50 - 100 triệu/tháng", min: 50_000_000, max: 100_000_000 },
  { label: "Trên 100 triệu/tháng", min: 100_000_000, max: undefined },
  { label: "Thỏa thuận", min: undefined, max: undefined },
];

export const areaRangesCompact: PriceRange[] = [
  { label: "Dưới 30 m²", min: undefined, max: 30 },
  { label: "30 - 50 m²", min: 30, max: 50 },
  { label: "50 - 80 m²", min: 50, max: 80 },
  { label: "80 - 100 m²", min: 80, max: 100 },
  { label: "100 - 200 m²", min: 100, max: 200 },
  { label: "200 - 500 m²", min: 200, max: 500 },
  { label: "Trên 500 m²", min: 500, max: undefined },
];

// Detailed/Granular price ranges (e.g. used in SearchFilterBar)
export const salePriceRangesDetailed: PriceRange[] = [
  { label: "Tất cả", min: undefined, max: undefined },
  { label: "Dưới 500 triệu", min: undefined, max: 500_000_000 },
  { label: "500 - 800 triệu", min: 500_000_000, max: 800_000_000 },
  { label: "800 triệu - 1 tỷ", min: 800_000_000, max: 1_000_000_000 },
  { label: "1 - 2 tỷ", min: 1_000_000_000, max: 2_000_000_000 },
  { label: "2 - 3 tỷ", min: 2_000_000_000, max: 3_000_000_000 },
  { label: "3 - 5 tỷ", min: 3_000_000_000, max: 5_000_000_000 },
  { label: "5 - 7 tỷ", min: 5_000_000_000, max: 7_000_000_000 },
  { label: "7 - 10 tỷ", min: 7_000_000_000, max: 10_000_000_000 },
  { label: "10 - 15 tỷ", min: 10_000_000_000, max: 15_000_000_000 },
  { label: "15 - 20 tỷ", min: 15_000_000_000, max: 20_000_000_000 },
  { label: "20 - 30 tỷ", min: 20_000_000_000, max: 30_000_000_000 },
  { label: "Trên 30 tỷ", min: 30_000_000_000, max: undefined },
];

export const rentPriceRangesDetailed: PriceRange[] = [
  { label: "Tất cả", min: undefined, max: undefined },
  { label: "Dưới 3 triệu/tháng", min: undefined, max: 3_000_000 },
  { label: "3 - 5 triệu/tháng", min: 3_000_000, max: 5_000_000 },
  { label: "5 - 10 triệu/tháng", min: 5_000_000, max: 10_000_000 },
  { label: "10 - 15 triệu/tháng", min: 10_000_000, max: 15_000_000 },
  { label: "15 - 20 triệu/tháng", min: 15_000_000, max: 20_000_000 },
  { label: "20 - 30 triệu/tháng", min: 20_000_000, max: 30_000_000 },
  { label: "30 - 50 triệu/tháng", min: 30_000_000, max: 50_000_000 },
  { label: "50 - 100 triệu/tháng", min: 50_000_000, max: 100_000_000 },
  { label: "Trên 100 triệu/tháng", min: 100_000_000, max: undefined },
];

export const areaRangesDetailed: PriceRange[] = [
  { label: "Tất cả", min: undefined, max: undefined },
  { label: "Dưới 30 m²", min: undefined, max: 30 },
  { label: "30 - 50 m²", min: 30, max: 50 },
  { label: "50 - 80 m²", min: 50, max: 80 },
  { label: "80 - 100 m²", min: 80, max: 100 },
  { label: "100 - 150 m²", min: 100, max: 150 },
  { label: "150 - 200 m²", min: 150, max: 200 },
  { label: "200 - 300 m²", min: 200, max: 300 },
  { label: "300 - 500 m²", min: 300, max: 500 },
  { label: "Trên 500 m²", min: 500, max: undefined },
];
