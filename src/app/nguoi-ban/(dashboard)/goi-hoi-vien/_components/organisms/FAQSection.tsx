import { Plus, Minus } from "lucide-react";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

export function FAQSection() {
  const faqs: FAQItem[] = [
    {
      question: "Gói Hội viên cung cấp các quyền lợi hàng tháng như thế nào?",
      answer: (
        <div className="text-[13px] text-gray-600 leading-relaxed space-y-3">
          <p>Gói Hội viên có thời hạn trong 1 tháng, 3 tháng hoặc 6 tháng. Bạn sẽ nhận được các quyền lợi theo từng tháng (30 ngày). Các quyền lợi có thời hạn sử dụng là 30 ngày. Sau 30 ngày các quyền lợi sẽ tự động được làm mới.</p>
          <p>Ví dụ: Ngày 13/10, bạn đăng ký Gói Hội viên Tiêu chuẩn trong vòng 3 tháng:</p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li><strong>Ngày 13/10:</strong> Kích hoạt các quyền lợi của Gói Hội viên Tiêu chuẩn với thời hạn sử dụng trong 30 ngày, bao gồm:<br/>
              - 1 voucher giảm 400.000đ áp dụng cho Tin VIP<br/>
              - 30 voucher giảm 35.000đ áp dụng cho Tin Thường<br/>
              - Các tính năng tiện ích nâng cao (Hẹn giờ đăng tin, Báo cáo hiệu suất...)
            </li>
            <li><strong>Ngày 14/11:</strong> Các quyền lợi trong 30 ngày đầu tiên hết hạn.<br/>
              Tài khoản nhận quyền lợi đợt tiếp theo với thời hạn sử dụng trong 30 ngày.</li>
            <li><strong>Ngày 14/12:</strong> Các quyền lợi trong 30 ngày trước hết hạn.<br/>
              Tài khoản nhận quyền lợi đợt tiếp theo với thời hạn sử dụng trong 30 ngày.</li>
          </ul>
        </div>
      )
    },
    {
      question: "Sau khi đăng ký Gói Hội viên thành công, các voucher đăng tin/đẩy tin sẽ được lưu ở đâu?",
      answer: <p className="text-[13px] text-gray-600 leading-relaxed">Voucher sẽ được tự động thêm vào mục Ưu đãi của tôi trong khu vực Tài khoản và có thể dùng trực tiếp khi thanh toán tin.</p>
    },
    {
      question: "Tôi có thể quản lý các quyền lợi trong Gói Hội viên đã mua như thế nào?",
      answer: <p className="text-[13px] text-gray-600 leading-relaxed">Bạn có thể theo dõi số lượng voucher còn lại tại bảng Tổng quan (Dashboard) hoặc trong mục Quản lý Gói Hội viên.</p>
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
