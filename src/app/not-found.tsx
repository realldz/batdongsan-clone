import Link from "next/link";
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f1f5f9]">
      <Header />
      <main className="flex-1 max-w-[1240px] w-full mx-auto px-4 flex flex-col items-center justify-center text-center py-24">
        <h2 className="text-8xl font-black text-gray-200 mb-6 font-mono">404</h2>
        <h3 className="text-2xl font-bold text-[#2c2c2c] mb-3">Xin lỗi, trang bạn tìm không tồn tại hoặc đã bị gỡ bỏ</h3>
        <p className="text-gray-500 mb-8 max-w-lg leading-relaxed">
          Nội dung có thể đã bị đổi tên, tạm thời không khả dụng hoặc bài đăng bất động sản này đã hết hạn.
        </p>
        <Link href="/" className="px-8 py-3 bg-primary text-white font-medium rounded hover:bg-primary-hover transition-colors shadow-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại trang chủ
        </Link>
      </main>
      <Footer />
    </div>
  );
}
