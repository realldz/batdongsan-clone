import { Plus, Minus } from "lucide-react";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

export function FAQSection() {
  const faqs: FAQItem[] = [
    {
      question: "Gói Hội viên mang lại quyền lợi gì?",
      answer: (
        <div className="text-[13px] text-gray-600 leading-relaxed space-y-3">
          <p>Mỗi hạng hội viên cho phép bạn đẩy tin với tần suất và mức độ ưu tiên hiển thị cao hơn:</p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li><strong>Bạc:</strong> Đẩy tin 1 lần/ngày, ưu tiên hiển thị mức cơ bản.</li>
            <li><strong>Vàng:</strong> Đẩy tin 3 lần/ngày, ưu tiên hiển thị mức cao.</li>
            <li><strong>Kim cương:</strong> Đẩy tin không giới hạn, ưu tiên hiển thị cao nhất.</li>
          </ul>
        </div>
      )
    },
    {
      question: "Quyền lợi đẩy tin của mỗi bậc khác nhau như thế nào?",
      answer: <p className="text-[13px] text-gray-600 leading-relaxed">Bậc càng cao thì tin đăng được đẩy càng thường xuyên và ưu tiên hiển thị càng cao. Bạc đẩy tin cơ bản, Vàng đẩy tin nhiều lần hơn, Kim cương đẩy tin không giới hạn với ưu tiên hiển thị cao nhất.</p>
    },
    {
      question: "Tôi có thể quản lý Gói Hội viên đã mua như thế nào?",
      answer: <p className="text-[13px] text-gray-600 leading-relaxed">Bạn có thể theo dõi bậc hội viên và ngày hết hạn tại bảng Tổng quan (Dashboard) hoặc trong mục Quản lý Gói Hội viên.</p>
    },
    {
      question: "Gói Hội viên của tôi có tự gia hạn như thế nào?",
      answer: <p className="text-[13px] text-gray-600 leading-relaxed">Hệ thống sẽ tự động trừ tiền trong Tài khoản Chính để gia hạn gói ở chu kỳ tiếp theo trừ khi bạn tắt tính năng Tự động gia hạn.</p>
    },
    {
      question: "Tôi có thể hủy Gói Hội viên nếu không còn nhu cầu không?",
      answer: <p className="text-[13px] text-gray-600 leading-relaxed">Bạn có thể hủy tính năng tự động gia hạn bất cứ lúc nào. Các quyền lợi của gói hiện tại vẫn được giữ nguyên cho đến hết chu kỳ đã thanh toán.</p>
    }
  ];

  const [openIdx, setOpenIdx] = useState<number>(0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-[17px] font-extrabold text-gray-900 mb-6">Câu hỏi thường gặp</h2>
      <div className="space-y-0 divide-y divide-gray-100">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="py-4">
              <button 
                onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                className="w-full flex items-center justify-between text-left focus:outline-none group"
              >
                <span className={`text-[13px] font-bold ${isOpen ? "text-[#e03c31]" : "text-gray-800 group-hover:text-[#e03c31]"}`}>
                  {faq.question}
                </span>
                {isOpen ? (
                  <Minus className="w-4 h-4 text-[#e03c31] shrink-0 ml-4" />
                ) : (
                  <Plus className="w-4 h-4 text-red-400 shrink-0 ml-4" />
                )}
              </button>
              {isOpen && (
                <div className="pt-3 pr-8 animate-in fade-in slide-in-from-top-2 duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
