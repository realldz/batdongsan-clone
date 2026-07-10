import React from "react";
import { X, Check } from "lucide-react";

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CompareModal({ isOpen, onClose }: CompareModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-xl text-gray-900">So sánh các loại tin</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-4 border-b border-gray-200 w-1/4"></th>
                <th className="p-4 border-b border-gray-200 bg-red-50 text-center rounded-t-xl">
                  <div className="text-2xl mb-1">💎</div>
                  <div className="font-bold text-red-600">VIP Kim Cương</div>
                </th>
                <th className="p-4 border-b border-gray-200 text-center">
                  <div className="text-2xl mb-1">⭐</div>
                  <div className="font-bold text-yellow-500">VIP Vàng</div>
                </th>
                <th className="p-4 border-b border-gray-200 text-center">
                  <div className="text-2xl mb-1">🌟</div>
                  <div className="font-bold text-blue-500">VIP Bạc</div>
                </th>
                <th className="p-4 border-b border-gray-200 text-center">
                  <div className="text-2xl mb-1">📝</div>
                  <div className="font-bold text-gray-500">Tin Thường</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 border-b border-gray-100 font-medium text-gray-900">Vị trí hiển thị</td>
                <td className="p-4 border-b border-gray-100 bg-red-50/50 text-center">Lớn nhất, trên cùng</td>
                <td className="p-4 border-b border-gray-100 text-center">Dưới Kim Cương</td>
                <td className="p-4 border-b border-gray-100 text-center">Dưới Vàng</td>
                <td className="p-4 border-b border-gray-100 text-center">Sau tin VIP</td>
              </tr>
              <tr>
                <td className="p-4 border-b border-gray-100 font-medium text-gray-900">Hiển thị liên hệ</td>
                <td className="p-4 border-b border-gray-100 bg-red-50/50 text-center"><Check className="mx-auto text-green-500" size={20} /></td>
                <td className="p-4 border-b border-gray-100 text-center"><Check className="mx-auto text-green-500" size={20} /></td>
                <td className="p-4 border-b border-gray-100 text-center">-</td>
                <td className="p-4 border-b border-gray-100 text-center">-</td>
              </tr>
              <tr>
                <td className="p-4 border-b border-gray-100 font-medium text-gray-900">Kích thước ảnh</td>
                <td className="p-4 border-b border-gray-100 bg-red-50/50 text-center">To nhất</td>
                <td className="p-4 border-b border-gray-100 text-center">Trung bình</td>
                <td className="p-4 border-b border-gray-100 text-center">Trung bình</td>
                <td className="p-4 border-b border-gray-100 text-center">Nhỏ</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-gray-900">Tiêu đề</td>
                <td className="p-4 bg-red-50/50 text-center text-red-600 font-bold uppercase">In hoa màu đỏ</td>
                <td className="p-4 text-center text-yellow-600 font-bold uppercase">In hoa màu cam</td>
                <td className="p-4 text-center text-blue-600 font-bold uppercase">In hoa màu xanh</td>
                <td className="p-4 text-center text-gray-800">Màu đen thường</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
