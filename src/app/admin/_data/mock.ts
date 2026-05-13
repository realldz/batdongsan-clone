export type AdminListingStatus = "Đang hiển thị" | "Chờ duyệt" | "Đã duyệt" | "Từ chối" | "Đã ẩn" | "Hết hạn";
export type AdminListingType = "Bán" | "Cho thuê";
export type AdminUserStatus = "Đang hoạt động" | "Tạm khóa" | "Chờ xác minh";
export type AdminUserRole = "Admin" | "Biên tập viên" | "Môi giới" | "Doanh nghiệp" | "Người bán";
export type AdminArticleStatus = "Đã xuất bản" | "Bản nháp" | "Đã lưu trữ";

export type AdminListing = {
  id: string;
  code: string;
  title: string;
  owner: string;
  ownerType: "Cá nhân" | "Môi giới" | "Doanh nghiệp";
  type: AdminListingType;
  category: string;
  location: string;
  price: string;
  area: string;
  packageName: "Tin thường" | "Tin VIP" | "Tin nổi bật";
  status: AdminListingStatus;
  submittedAt: string;
  expiresAt: string;
  views: number;
  reports: number;
};

export type AdminUser = {
  id: string;
  role: AdminUserRole;
  roleNumber: number;
  status: string;
  isBlocked: boolean;
  name: string;
  phone: string;
  email: string;
  listings: number;
  revenue: string;
  joinedAt: string;
  note: string;

  // Extended from API
  fullName?: string;
  avatar?: string | null;
  adminScopes?: string[];
  blockedAt?: string | null;
  blockedReason?: string | null;
  boostQuotaUsed?: number;
  boostQuotaResetAt?: string | null;
  listingFavoriteCount?: number;
  vipTier?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
};

export type AdminAgent = {
  id: string;
  name: string;
  area: string;
  company: string;
  phone: string;
  verified: boolean;
  listings: number;
  rating: number;
  status: AdminUserStatus;
};

export type AdminEnterprise = {
  id: string;
  name: string;
  taxCode: string;
  location: string;
  plan: "Cơ bản" | "Chuyên nghiệp" | "Doanh nghiệp";
  listings: number;
  status: AdminUserStatus;
  joinedAt: string;
};

export type AdminArticle = {
  id: string;
  slug: string;
  title: string;
  content: string;
  category: string;
  author: string;
  status: AdminArticleStatus;
  views: number;
  publishedAt: string;
  summary?: string;
  thumbnail?: string;
  isFeatured: boolean;
};

export type AdminSetting = {
  id: string;
  group: string;
  name: string;
  value: string;
  updatedAt: string;
  status: "Đang áp dụng" | "Cần kiểm tra";
};

export type AdminActivity = {
  id: string;
  action: string;
  actor: string;
  target: string;
  time: string;
};

export const adminListings: AdminListing[] = [
  {
    id: "listing-1",
    code: "BDS-39624518",
    title: "Bán căn hộ 2PN Vinhomes Grand Park, full nội thất, view sông",
    owner: "Nguyễn Minh Anh",
    ownerType: "Môi giới",
    type: "Bán",
    category: "Căn hộ chung cư",
    location: "TP. Thủ Đức, TP.HCM",
    price: "3,45 tỷ",
    area: "68 m2",
    packageName: "Tin VIP",
    status: "Đang hiển thị",
    submittedAt: "09/05/2026",
    expiresAt: "24/05/2026",
    views: 1287,
    reports: 0,
  },
  {
    id: "listing-2",
    code: "BDS-39624527",
    title: "Cho thuê officetel Sunrise City 45m2, nội thất đẹp, vào ở ngay",
    owner: "Sunrise Realty",
    ownerType: "Doanh nghiệp",
    type: "Cho thuê",
    category: "Officetel",
    location: "Quận 7, TP.HCM",
    price: "12 triệu/tháng",
    area: "45 m2",
    packageName: "Tin nổi bật",
    status: "Đã duyệt",
    submittedAt: "08/05/2026",
    expiresAt: "22/05/2026",
    views: 643,
    reports: 1,
  },
  {
    id: "listing-3",
    code: "BDS-39624542",
    title: "Bán nhà phố 1 trệt 3 lầu khu Lakeview City, đường rộng 12m",
    owner: "Trần Quốc Huy",
    ownerType: "Cá nhân",
    type: "Bán",
    category: "Nhà riêng",
    location: "TP. Thủ Đức, TP.HCM",
    price: "12,9 tỷ",
    area: "100 m2",
    packageName: "Tin VIP",
    status: "Chờ duyệt",
    submittedAt: "07/05/2026",
    expiresAt: "20/05/2026",
    views: 0,
    reports: 0,
  },
  {
    id: "listing-4",
    code: "BDS-39624568",
    title: "Cho thuê mặt bằng shophouse Masteri An Phú, góc 2 mặt tiền",
    owner: "An Phú Homes",
    ownerType: "Doanh nghiệp",
    type: "Cho thuê",
    category: "Shophouse",
    location: "Quận 2, TP.HCM",
    price: "38 triệu/tháng",
    area: "92 m2",
    packageName: "Tin thường",
    status: "Đang hiển thị",
    submittedAt: "03/05/2026",
    expiresAt: "18/05/2026",
    views: 401,
    reports: 2,
  },
  {
    id: "listing-5",
    code: "BDS-39624581",
    title: "Bán đất nền dự án gần vành đai 3, sổ riêng từng nền",
    owner: "Lê Hải Nam",
    ownerType: "Môi giới",
    type: "Bán",
    category: "Đất nền dự án",
    location: "Long Thành, Đồng Nai",
    price: "1,85 tỷ",
    area: "80 m2",
    packageName: "Tin thường",
    status: "Hết hạn",
    submittedAt: "28/04/2026",
    expiresAt: "12/05/2026",
    views: 932,
    reports: 0,
  },
  {
    id: "listing-6",
    code: "BDS-39624602",
    title: "Cho thuê căn hộ studio The Beverly, mới bàn giao, có ban công",
    owner: "Phạm Thùy Linh",
    ownerType: "Cá nhân",
    type: "Cho thuê",
    category: "Căn hộ chung cư",
    location: "TP. Thủ Đức, TP.HCM",
    price: "8,5 triệu/tháng",
    area: "35 m2",
    packageName: "Tin thường",
    status: "Đã ẩn",
    submittedAt: "26/04/2026",
    expiresAt: "10/05/2026",
    views: 278,
    reports: 3,
  },
  {
    id: "listing-7",
    code: "BDS-39624615",
    title: "Bán biệt thự song lập khu compound, hoàn thiện cao cấp",
    owner: "Elite Property",
    ownerType: "Doanh nghiệp",
    type: "Bán",
    category: "Biệt thự",
    location: "Quận 7, TP.HCM",
    price: "32 tỷ",
    area: "250 m2",
    packageName: "Tin nổi bật",
    status: "Từ chối",
    submittedAt: "25/04/2026",
    expiresAt: "15/05/2026",
    views: 90,
    reports: 1,
  },
];

export const adminUsers: AdminUser[] = [
  { id: "user-1", role: "Môi giới", roleNumber: 3, status: "Đang hoạt động", isBlocked: false, name: "Nguyễn Minh Anh", phone: "0901 234 567", email: "minhanh@example.com", listings: 18, revenue: "12.450.000 đ", joinedAt: "12/01/2026", note: "Tài khoản uy tín" },
  { id: "user-2", role: "Doanh nghiệp", roleNumber: 3, status: "Đang hoạt động", isBlocked: false, name: "Sunrise Realty", phone: "028 3888 9999", email: "contact@sunrise.vn", listings: 42, revenue: "38.900.000 đ", joinedAt: "03/11/2025", note: "Gói doanh nghiệp" },
  { id: "user-3", role: "Người bán", roleNumber: 1, status: "Chờ xác minh", isBlocked: false, name: "Trần Quốc Huy", phone: "0912 888 456", email: "quochuy@example.com", listings: 2, revenue: "450.000 đ", joinedAt: "06/05/2026", note: "Cần xác minh giấy tờ" },
  { id: "user-4", role: "Môi giới", roleNumber: 3, status: "Tạm khóa", isBlocked: true, name: "Lê Hải Nam", phone: "0935 711 222", email: "hainam@example.com", listings: 9, revenue: "4.200.000 đ", joinedAt: "18/02/2026", note: "Nhiều báo cáo trùng tin" },
  { id: "user-5", role: "Doanh nghiệp", roleNumber: 3, status: "Đang hoạt động", isBlocked: false, name: "BĐS An Phú", phone: "028 3666 1111", email: "admin@anphu.vn", listings: 27, revenue: "21.100.000 đ", joinedAt: "21/09/2025", note: "Thanh toán đúng hạn" },
];

export const adminAgents: AdminAgent[] = [
  { id: "agent-1", name: "Nguyễn Minh Anh", area: "TP. Thủ Đức", company: "Vinhomes Partner", phone: "0901 234 567", verified: true, listings: 18, rating: 4.8, status: "Đang hoạt động" },
  { id: "agent-2", name: "Lê Hải Nam", area: "Đồng Nai", company: "Nam Land", phone: "0935 711 222", verified: false, listings: 9, rating: 4.1, status: "Tạm khóa" },
  { id: "agent-3", name: "Phạm Thùy Linh", area: "Quận 7", company: "Freelancer", phone: "0988 334 221", verified: true, listings: 12, rating: 4.6, status: "Đang hoạt động" },
  { id: "agent-4", name: "Hoàng Đức Long", area: "Hà Nội", company: "Long Homes", phone: "0967 998 100", verified: false, listings: 5, rating: 3.9, status: "Chờ xác minh" },
];

export const adminEnterprises: AdminEnterprise[] = [
  { id: "enterprise-1", name: "Sunrise Realty", taxCode: "0312456789", location: "Quận 7, TP.HCM", plan: "Doanh nghiệp", listings: 42, status: "Đang hoạt động", joinedAt: "03/11/2025" },
  { id: "enterprise-2", name: "An Phú Homes", taxCode: "0318899001", location: "TP. Thủ Đức, TP.HCM", plan: "Chuyên nghiệp", listings: 27, status: "Đang hoạt động", joinedAt: "21/09/2025" },
  { id: "enterprise-3", name: "Elite Property", taxCode: "0109922334", location: "Hà Nội", plan: "Cơ bản", listings: 7, status: "Chờ xác minh", joinedAt: "01/05/2026" },
  { id: "enterprise-4", name: "Lakeview Group", taxCode: "0317722881", location: "Quận 2, TP.HCM", plan: "Chuyên nghiệp", listings: 19, status: "Tạm khóa", joinedAt: "14/12/2025" },
];

export const adminArticles: AdminArticle[] = [
  { id: "article-1", slug: "thi-truong-can-ho-tphcm-tang-nhiet-quy-ii", title: "Thị trường căn hộ TP.HCM tăng nhiệt trong quý II", content: "<p>Thị trường căn hộ TP.HCM đang có những dấu hiệu phục hồi mạnh mẽ trong quý II năm 2026. Theo số liệu từ các sàn giao dịch, lượng giao dịch thành công tăng 35% so với cùng kỳ năm trước.</p><p>Các chuyên gia nhận định, đây là kết quả của nhiều yếu tố tích cực: lãi suất cho vay ổn định, chính sách hỗ trợ từ chính phủ và tâm lý người mua đã trở lại sau thời gian dài chờ đợi.</p>", category: "Thị trường", author: "Ban biên tập", status: "Đã xuất bản", views: 12840, publishedAt: "09/05/2026", summary: "Phân tích chi tiết về sự phục hồi của thị trường căn hộ TP.HCM", thumbnail: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", isFeatured: true },
  { id: "article-2", slug: "kinh-nghiem-kiem-tra-phap-ly-truoc-khi-mua-dat-nen", title: "Kinh nghiệm kiểm tra pháp lý trước khi mua đất nền", content: "<p>Khi mua đất nền, việc kiểm tra pháp lý là bước quan trọng nhất. Dưới đây là những kinh nghiệm giúp bạn tránh rủi ro:</p><ul><li>Kiểm tra sổ đỏ/sổ hồng chính chủ</li><li>Xác minh quy hoạch tại địa phương</li><li>Kiểm tra tình trạng tranh chấp</li><li>Xem xét lịch sử giao dịch của thửa đất</li></ul>", category: "Pháp lý", author: "Hoàng An", status: "Bản nháp", views: 0, publishedAt: "--", summary: "Hướng dẫn chi tiết kiểm tra tính pháp lý của đất nền", isFeatured: false },
  { id: "article-3", slug: "xu-huong-thue-officetel-tai-cac-do-thi-lon", title: "Xu hướng thuê officetel tại các đô thị lớn", content: "<p>Officetel đang trở thành xu hướng mới tại các thành phố lớn như Hà Nội, TP.HCM và Đà Nẵng. Với ưu điểm kết hợp giữa văn phòng và nơi ở, officetel đáp ứng linh hoạt nhu cầu của giới trẻ và doanh nghiệp vừa và nhỏ.</p>", category: "Phân tích", author: "Minh Khang", status: "Bản nháp", views: 0, publishedAt: "--", summary: "Officetel đang trở thành xu hướng mới tại các thành phố lớn", isFeatured: false },
  { id: "article-4", slug: "lai-suat-cho-vay-mua-nha-tiep-tuc-on-dinh", title: "Lãi suất cho vay mua nhà tiếp tục ổn định", content: "<p>Các ngân hàng lớn tiếp tục duy trì mặt bằng lãi suất cho vay mua nhà ổn định trong tháng 5/2026. Mức lãi suất phổ biến dao động từ 6.5% - 8.5%/năm cho các khoản vay ưu đãi trong 1-2 năm đầu.</p><p>Sau thời gian ưu đãi, lãi suất thả nổi được tính bằng lãi suất tiết kiệm 12 tháng cộng biên độ 3-4%.</p>", category: "Tài chính", author: "Thu Hà", status: "Đã xuất bản", views: 7630, publishedAt: "06/05/2026", summary: "Cập nhật mới nhất về lãi suất vay mua nhà từ các ngân hàng", isFeatured: true },
  { id: "article-5", slug: "phong-thuy-chon-huong-nha-cho-gia-dinh-tre", title: "Phong thủy chọn hướng nhà cho gia đình trẻ", content: "<p>Chọn hướng nhà hợp phong thủy là yếu tố được nhiều gia đình trẻ quan tâm khi mua nhà. Theo các chuyên gia, hướng nhà nên được chọn dựa trên tuổi của gia chủ và cấu trúc địa hình khu đất.</p>", category: "Phong thủy", author: "Thầy Phong", status: "Đã xuất bản", views: 4520, publishedAt: "03/05/2026", summary: "Những lưu ý phong thủy quan trọng khi chọn mua nhà", isFeatured: false },
  { id: "article-6", slug: "du-an-vinhomes-grand-park-cap-nhat-tien-do", title: "Dự án Vinhomes Grand Park cập nhật tiến độ tháng 5", content: "<p>Dự án Vinhomes Grand Park tại TP. Thủ Đức đang đẩy nhanh tiến độ xây dựng trong tháng 5/2026. Đã có hơn 85% căn hộ được bàn giao, cơ sở hạ tầng và tiện ích nội khu đang dần hoàn thiện.</p>", category: "Dự án", author: "Minh Khang", status: "Đã xuất bản", views: 9810, publishedAt: "01/05/2026", summary: "Tiến độ xây dựng và bàn giao mới nhất", thumbnail: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800", isFeatured: true },
  { id: "article-7", slug: "dat-nen-long-thanh-sau-quy-hoach-vanh-dai-3", title: "Đất nền Long Thành sau quy hoạch vành đai 3", content: "<p>Giá đất nền khu vực Long Thành, Đồng Nai đã có những biến động đáng kể sau khi quy hoạch vành đai 3 được phê duyệt. Nhiều nhà đầu tư đang đổ về khu vực này với kỳ vọng giá đất sẽ tiếp tục tăng.</p>", category: "Thị trường", author: "Ban biên tập", status: "Đã lưu trữ", views: 15400, publishedAt: "15/03/2026", summary: "Đánh giá biến động giá đất nền khu vực Long Thành", isFeatured: false },
  { id: "article-8", slug: "thu-tuc-vay-mua-nha-tra-gop-2026", title: "Thủ tục vay mua nhà trả góp năm 2026", content: "<p>Quy trình vay mua nhà trả góp năm 2026 có một số thay đổi đáng chú ý. Người mua cần chuẩn bị đầy đủ hồ sơ bao gồm: CMND/CCCD, sổ hộ khẩu, giấy đăng ký kết hôn (nếu có), hợp đồng lao động và sao kê lương 3-6 tháng gần nhất.</p>", category: "Tổng hợp", author: "Thu Hà", status: "Đã xuất bản", views: 6230, publishedAt: "28/04/2026", summary: "Quy trình và hồ sơ vay mua nhà mới nhất 2026", isFeatured: false },
];

export const adminSettings: AdminSetting[] = [
  { id: "setting-1", group: "Tin đăng", name: "Thời gian duyệt tin SLA", value: "4 giờ", updatedAt: "08/05/2026", status: "Đang áp dụng" },
  { id: "setting-2", group: "Gói dịch vụ", name: "Giá tin VIP mặc định", value: "169.000 đ", updatedAt: "07/05/2026", status: "Đang áp dụng" },
  { id: "setting-3", group: "Người dùng", name: "Ngưỡng khóa tự động", value: "3 báo cáo", updatedAt: "04/05/2026", status: "Cần kiểm tra" },
  { id: "setting-4", group: "Nội dung", name: "Tự động ẩn bài hết hạn", value: "Bật", updatedAt: "02/05/2026", status: "Đang áp dụng" },
];

export const adminActivities: AdminActivity[] = [
  { id: "activity-1", action: "Duyệt tin", actor: "Admin Linh", target: "BDS-39624527", time: "10 phút trước" },
  { id: "activity-2", action: "Khóa tài khoản", actor: "Admin Long", target: "Lê Hải Nam", time: "38 phút trước" },
  { id: "activity-3", action: "Cập nhật cấu hình", actor: "Admin Linh", target: "Giá tin VIP", time: "1 giờ trước" },
  { id: "activity-4", action: "Từ chối tin", actor: "Admin Minh", target: "BDS-39624615", time: "2 giờ trước" },
];

export const adminRevenue = [
  { label: "T2", value: 28 },
  { label: "T3", value: 36 },
  { label: "T4", value: 44 },
  { label: "T5", value: 58 },
  { label: "T6", value: 52 },
  { label: "T7", value: 69 },
  { label: "T8", value: 76 },
] as const;
