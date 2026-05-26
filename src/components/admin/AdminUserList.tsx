"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, Shield, Search, X } from "lucide-react";
import { adminUpdateUserProfile, adminUpdateUserStatus } from "@/lib/actions/admin";

type StatusTab = "all" | "active" | "suspended" | "banned";

interface UserItem {
  id: string;
  nickname: string;
  avatar_url: string | null;
  bio: string | null;
  status: string;
  suspended_until: string | null;
  admin_memo: string | null;
  created_at: string;
  updated_at: string;
}

interface AdminUserListProps {
  users: UserItem[];
}

function statusBadge(status: string) {
  switch (status) {
    case "active":
      return <span className="inline-block px-2 py-0.5 font-caption text-[10px] tracking-[1px] bg-green-100 text-green-700">ACTIVE</span>;
    case "suspended":
      return <span className="inline-block px-2 py-0.5 font-caption text-[10px] tracking-[1px] bg-yellow-100 text-yellow-700">SUSPENDED</span>;
    case "banned":
      return <span className="inline-block px-2 py-0.5 font-caption text-[10px] tracking-[1px] bg-red-100 text-red-600">BANNED</span>;
    default:
      return <span className="inline-block px-2 py-0.5 font-caption text-[10px] tracking-[1px] bg-gray-100 text-fg-tertiary">UNKNOWN</span>;
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export default function AdminUserList({ users }: AdminUserListProps) {
  const [tab, setTab] = useState<StatusTab>("all");
  const [search, setSearch] = useState("");
  const [userList, setUserList] = useState(users);
  const [loading, setLoading] = useState<string | null>(null);

  // Edit modal
  const [editUser, setEditUser] = useState<UserItem | null>(null);
  const [editNickname, setEditNickname] = useState("");
  const [editBio, setEditBio] = useState("");

  // Status modal
  const [statusUser, setStatusUser] = useState<UserItem | null>(null);
  const [newStatus, setNewStatus] = useState<"active" | "suspended" | "banned">("suspended");
  const [suspendDays, setSuspendDays] = useState(7);
  const [memo, setMemo] = useState("");

  const filtered = userList
    .filter((u) => tab === "all" || u.status === tab)
    .filter((u) => !search || u.nickname.toLowerCase().includes(search.toLowerCase()));

  const tabs: { label: string; value: StatusTab; count: number }[] = [
    { label: "ALL", value: "all", count: userList.length },
    { label: "ACTIVE", value: "active", count: userList.filter((u) => u.status === "active").length },
    { label: "SUSPENDED", value: "suspended", count: userList.filter((u) => u.status === "suspended").length },
    { label: "BANNED", value: "banned", count: userList.filter((u) => u.status === "banned").length },
  ];

  const openEdit = (user: UserItem) => {
    setEditUser(user);
    setEditNickname(user.nickname);
    setEditBio(user.bio ?? "");
  };

  const handleSaveProfile = async () => {
    if (!editUser) return;
    setLoading(editUser.id);
    try {
      await adminUpdateUserProfile(editUser.id, { nickname: editNickname, bio: editBio });
      setUserList((prev) =>
        prev.map((u) => u.id === editUser.id ? { ...u, nickname: editNickname, bio: editBio || null } : u)
      );
      setEditUser(null);
    } catch (e) {
      alert(e instanceof Error ? e.message : "오류가 발생했습니다.");
    }
    setLoading(null);
  };

  const openStatus = (user: UserItem) => {
    setStatusUser(user);
    setNewStatus(user.status === "active" ? "suspended" : "active");
    setSuspendDays(7);
    setMemo(user.admin_memo ?? "");
  };

  const handleSaveStatus = async () => {
    if (!statusUser) return;
    setLoading(statusUser.id);
    try {
      const suspendedUntil = newStatus === "suspended"
        ? new Date(Date.now() + suspendDays * 86400000).toISOString()
        : undefined;
      await adminUpdateUserStatus(statusUser.id, newStatus, { suspendedUntil, memo });
      setUserList((prev) =>
        prev.map((u) =>
          u.id === statusUser.id
            ? { ...u, status: newStatus, suspended_until: suspendedUntil ?? null, admin_memo: memo || null }
            : u
        )
      );
      setStatusUser(null);
    } catch (e) {
      alert(e instanceof Error ? e.message : "오류가 발생했습니다.");
    }
    setLoading(null);
  };

  return (
    <>
      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-border-light mb-4">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`pb-2.5 font-caption text-[11px] font-medium tracking-[1.5px] transition-colors ${
              tab === t.value
                ? "text-fg-primary border-b-2 border-fg-primary"
                : "text-fg-tertiary hover:text-fg-primary"
            }`}
          >
            {t.label}
            {t.count > 0 && t.value !== "all" && (
              <span className="ml-1 text-[10px] text-fg-tertiary">({t.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-tertiary" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="닉네임 검색..."
          className="w-full max-w-[300px] pl-9 pr-3 py-2 border border-border-light font-body text-[13px] text-fg-primary bg-transparent focus:outline-none focus:border-fg-primary"
        />
      </div>

      {/* Table */}
      <div className="border border-border-light overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-card border-b border-border-light">
              <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary w-[48px]" />
              <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary">NICKNAME</th>
              <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary hidden md:table-cell">STATUS</th>
              <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary hidden lg:table-cell">JOINED</th>
              <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary hidden lg:table-cell">MEMO</th>
              <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary w-[100px]">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center font-body text-[13px] text-fg-tertiary">
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr key={user.id} className="border-b border-border-light last:border-0 hover:bg-surface-card/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="relative w-[32px] h-[32px] rounded-full overflow-hidden bg-surface-card shrink-0">
                      {user.avatar_url ? (
                        <Image src={user.avatar_url} alt={user.nickname} fill className="object-cover" sizes="32px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-caption text-[11px] text-fg-tertiary">
                          {user.nickname.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-body text-[13px] font-medium text-fg-primary">{user.nickname}</p>
                    {user.bio && (
                      <p className="font-body text-[11px] text-fg-tertiary truncate max-w-[200px] mt-0.5">{user.bio}</p>
                    )}
                    <div className="md:hidden mt-1">{statusBadge(user.status)}</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {statusBadge(user.status)}
                    {user.status === "suspended" && user.suspended_until && (
                      <p className="font-caption text-[10px] text-fg-tertiary mt-0.5">
                        ~{formatDate(user.suspended_until)}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="font-body text-[12px] text-fg-secondary">{formatDate(user.created_at)}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {user.admin_memo && (
                      <p className="font-body text-[11px] text-fg-tertiary truncate max-w-[150px]">{user.admin_memo}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(user)}
                        disabled={loading === user.id}
                        className="p-1.5 text-fg-tertiary hover:text-fg-primary transition-colors"
                        title="프로필 수정"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => openStatus(user)}
                        disabled={loading === user.id}
                        className="p-1.5 text-fg-tertiary hover:text-fg-primary transition-colors"
                        title="상태 변경"
                      >
                        <Shield size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Profile Modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setEditUser(null)}>
          <div className="bg-surface-primary w-[90vw] max-w-[420px] mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-light">
              <h3 className="font-caption text-[12px] font-medium tracking-[1.5px] text-fg-primary">EDIT PROFILE</h3>
              <button onClick={() => setEditUser(null)} className="text-fg-tertiary hover:text-fg-primary">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div>
                <label className="font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary block mb-1.5">NICKNAME</label>
                <input
                  type="text"
                  value={editNickname}
                  onChange={(e) => setEditNickname(e.target.value)}
                  className="w-full px-3 py-2 border border-border-light font-body text-[13px] text-fg-primary bg-transparent focus:outline-none focus:border-fg-primary"
                />
              </div>
              <div>
                <label className="font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary block mb-1.5">BIO</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-border-light font-body text-[13px] text-fg-primary bg-transparent resize-none focus:outline-none focus:border-fg-primary"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setEditUser(null)}
                  className="px-4 py-2 font-caption text-[11px] font-medium tracking-[1px] text-fg-tertiary hover:text-fg-primary transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={loading === editUser.id || !editNickname.trim()}
                  className="px-4 py-2 bg-fg-primary text-fg-inverse font-caption text-[11px] font-medium tracking-[1px] hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  SAVE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {statusUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setStatusUser(null)}>
          <div className="bg-surface-primary w-[90vw] max-w-[420px] mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-light">
              <h3 className="font-caption text-[12px] font-medium tracking-[1.5px] text-fg-primary">STATUS — {statusUser.nickname.toUpperCase()}</h3>
              <button onClick={() => setStatusUser(null)} className="text-fg-tertiary hover:text-fg-primary">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                {(["active", "suspended", "banned"] as const).map((s) => (
                  <label key={s} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={s}
                      checked={newStatus === s}
                      onChange={() => setNewStatus(s)}
                      className="accent-fg-primary"
                    />
                    <span className="font-body text-[13px] text-fg-primary">
                      {s === "active" ? "활성" : s === "suspended" ? "일시정지" : "영구정지"}
                    </span>
                  </label>
                ))}
              </div>

              {newStatus === "suspended" && (
                <div>
                  <label className="font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary block mb-1.5">정지 기간 (일)</label>
                  <input
                    type="number"
                    value={suspendDays}
                    onChange={(e) => setSuspendDays(Math.max(1, Number(e.target.value)))}
                    min={1}
                    className="w-[100px] px-3 py-2 border border-border-light font-body text-[13px] text-fg-primary bg-transparent focus:outline-none focus:border-fg-primary"
                  />
                </div>
              )}

              <div>
                <label className="font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary block mb-1.5">관리자 메모</label>
                <textarea
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  rows={2}
                  placeholder="제재 사유 등..."
                  className="w-full px-3 py-2 border border-border-light font-body text-[13px] text-fg-primary bg-transparent resize-none focus:outline-none focus:border-fg-primary placeholder:text-fg-tertiary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setStatusUser(null)}
                  className="px-4 py-2 font-caption text-[11px] font-medium tracking-[1px] text-fg-tertiary hover:text-fg-primary transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleSaveStatus}
                  disabled={loading === statusUser.id}
                  className={`px-4 py-2 font-caption text-[11px] font-medium tracking-[1px] hover:opacity-90 transition-opacity disabled:opacity-50 ${
                    newStatus === "banned"
                      ? "bg-red-500 text-white"
                      : newStatus === "suspended"
                        ? "bg-yellow-500 text-white"
                        : "bg-green-600 text-white"
                  }`}
                >
                  {newStatus === "active" ? "ACTIVATE" : newStatus === "suspended" ? "SUSPEND" : "BAN"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
