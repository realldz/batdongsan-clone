"use client";

import { useEffect, useMemo, useState } from "react";
import { getAdminUsers, type ApiUser } from "@/services/admin";
import { unwrapArray } from "@/lib/api-adapters";
import { assignLead } from "@/services/leads";
import { type LeadView } from "@/lib/api-adapters";
import { AdminModal } from "../molecules/AdminModal";
import { SearchInput } from "../atoms/SearchInput";

export interface AssignModalProps {
  lead: LeadView | null;
  isOpen: boolean;
  onClose: () => void;
  onAssigned: () => void;
}

export function AssignModal({
  lead,
  isOpen,
  onClose,
  onAssigned,
}: AssignModalProps) {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [search, setSearch] = useState("");
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    getAdminUsers({ page: 1, perPage: 100 })
      .then((res) => setUsers(unwrapArray<ApiUser>(res)))
      .catch(() => setUsers([]));
  }, [isOpen]);

  const filtered = useMemo(
    () =>
      users.filter((u) => {
        const name = (u.fullName ?? u.name ?? u.email ?? "").toLowerCase();
        return name.includes(search.toLowerCase());
      }),
    [users, search],
  );

  const handleAssign = async (userId: string) => {
    if (!lead) return;
    setAssigning(true);
    try {
      await assignLead(lead.id, userId);
      onAssigned();
    } catch {
      setAssigning(false);
    }
  };

  if (!lead) return null;

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Gán cho nhân viên"
      size="sm"
    >
      <div className="-mx-5 -mt-5 px-5 py-3 border-b border-gray-100 text-sm mb-4">
        <span className="text-gray-500">Lead: </span>
        <span className="font-bold text-gray-900">{lead.name}</span>
        <span className="text-gray-400 mx-2">•</span>
        <span className="text-gray-900">{lead.phone}</span>
      </div>

      <SearchInput
        placeholder="Tìm kiếm nhân viên..."
        value={search}
        onChange={setSearch}
        className="mb-4"
      />

      <div className="max-h-64 overflow-y-auto space-y-1">
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-4">Không tìm thấy người dùng</p>
        ) : (
          filtered.map((u) => (
            <button
              key={u.id}
              onClick={() => handleAssign(u.id!)}
              disabled={assigning}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left disabled:opacity-50 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                {(u.fullName ?? u.name ?? "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">{u.fullName ?? u.name ?? u.email}</div>
                <div className="text-xs text-gray-500">{u.email ?? u.phone}</div>
              </div>
            </button>
          ))
        )}
      </div>
    </AdminModal>
  );
}
