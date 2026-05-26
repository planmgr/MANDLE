"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, Eye, EyeOff } from "lucide-react";
import { adminDeletePost, adminDeleteBoardPost, adminToggleBoardPostVisibility, adminUpdateReportStatus } from "@/lib/actions/admin";

type CommunityTab = "mylook" | "board" | "reports";

interface PostItem {
  id: number;
  user_id: string;
  image_url: string;
  caption: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  profiles: { nickname: string };
}

interface BoardPostItem {
  id: number;
  user_id: string;
  title: string;
  body: string;
  image_url: string | null;
  category: string;
  is_hidden: boolean;
  likes_count: number;
  comments_count: number;
  created_at: string;
  profiles: { nickname: string };
}

interface ReportItem {
  id: number;
  reporter_id: string;
  target_type: string;
  target_id: number;
  reason: string;
  description: string | null;
  status: string;
  created_at: string;
  reporter: { nickname: string };
}

interface AdminCommunityListProps {
  posts: PostItem[];
  boardPosts: BoardPostItem[];
  reports: ReportItem[];
}

export default function AdminCommunityList({ posts, boardPosts, reports }: AdminCommunityListProps) {
  const [tab, setTab] = useState<CommunityTab>("mylook");
  const [postList, setPostList] = useState(posts);
  const [boardPostList, setBoardPostList] = useState(boardPosts);
  const [reportList, setReportList] = useState(reports);
  const [loading, setLoading] = useState<number | null>(null);
  const [reviewMenuId, setReviewMenuId] = useState<number | null>(null);

  const pendingCount = reportList.filter((r) => r.status === "pending").length;

  const tabs: { label: string; value: CommunityTab }[] = [
    { label: "MY LOOK", value: "mylook" },
    { label: "TALK / ITEM", value: "board" },
    { label: `REPORTS${pendingCount > 0 ? ` (${pendingCount})` : ""}`, value: "reports" },
  ];

  const handleDeletePost = async (postId: number) => {
    if (!confirm("이 게시글을 삭제하시겠습니까?")) return;
    setLoading(postId);
    try {
      await adminDeletePost(postId);
      setPostList(postList.filter((p) => p.id !== postId));
    } catch {
      alert("삭제에 실패했습니다.");
    }
    setLoading(null);
  };

  const handleDeleteBoardPost = async (postId: number) => {
    if (!confirm("이 게시글을 삭제하시겠습니까?")) return;
    setLoading(postId);
    try {
      await adminDeleteBoardPost(postId);
      setBoardPostList(boardPostList.filter((p) => p.id !== postId));
    } catch {
      alert("삭제에 실패했습니다.");
    }
    setLoading(null);
  };

  const handleDismiss = async (reportId: number) => {
    setLoading(reportId);
    try {
      await adminUpdateReportStatus(reportId, "dismissed");
      setReportList(reportList.map((r) =>
        r.id === reportId ? { ...r, status: "dismissed" } : r
      ));
    } catch {
      alert("상태 변경에 실패했습니다.");
    }
    setLoading(null);
  };

  const handleReviewAction = async (report: ReportItem, action: "hide" | "delete") => {
    setReviewMenuId(null);
    setLoading(report.id);
    try {
      // 1. Update report status
      await adminUpdateReportStatus(report.id, "reviewed");

      // 2. Take action on the post
      if (action === "hide") {
        if (report.target_type === "board_post") {
          await adminToggleBoardPostVisibility(report.target_id, true);
        } else {
          // posts don't have is_hidden, so delete instead
          await adminDeletePost(report.target_id);
        }
      } else {
        if (report.target_type === "board_post") {
          await adminDeleteBoardPost(report.target_id);
        } else {
          await adminDeletePost(report.target_id);
        }
      }

      setReportList(reportList.map((r) =>
        r.id === report.id ? { ...r, status: "reviewed" } : r
      ));
    } catch {
      alert("처리에 실패했습니다.");
    }
    setLoading(null);
  };

  const handleToggleVisibility = async (postId: number, currentHidden: boolean) => {
    setLoading(postId);
    try {
      await adminToggleBoardPostVisibility(postId, !currentHidden);
      setBoardPostList(boardPostList.map((p) =>
        p.id === postId ? { ...p, is_hidden: !currentHidden } : p
      ));
    } catch {
      alert("상태 변경에 실패했습니다.");
    }
    setLoading(null);
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-border-light">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-2.5 font-caption text-[11px] font-medium tracking-[1.5px] transition-colors border-b-2 -mb-px ${
              tab === t.value
                ? "text-fg-primary border-fg-primary"
                : "text-fg-tertiary border-transparent hover:text-fg-secondary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "mylook" ? (
        postList.length > 0 ? (
          <div className="border border-border-light overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border-light bg-surface-card">
                  <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary w-[60px]">IMAGE</th>
                  <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary">CAPTION</th>
                  <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary">USER</th>
                  <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary text-center">LIKES</th>
                  <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary text-center">COMMENTS</th>
                  <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary">DATE</th>
                  <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary w-[60px]"></th>
                </tr>
              </thead>
              <tbody>
                {postList.map((post) => (
                  <tr key={post.id} className="border-b border-border-light last:border-0 hover:bg-surface-card/50 transition-colors">
                    <td className="px-4 py-2">
                      <div className="relative w-[40px] h-[40px] bg-surface-card overflow-hidden">
                        <Image src={post.image_url} alt="" fill className="object-cover" sizes="40px" />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-body text-[13px] text-fg-primary truncate max-w-[300px]">
                        {post.caption || "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3 font-caption text-[11px] text-fg-secondary">
                      {post.profiles.nickname}
                    </td>
                    <td className="px-4 py-3 font-caption text-[11px] text-fg-tertiary text-center">
                      {post.likes_count}
                    </td>
                    <td className="px-4 py-3 font-caption text-[11px] text-fg-tertiary text-center">
                      {post.comments_count}
                    </td>
                    <td className="px-4 py-3 font-caption text-[11px] text-fg-tertiary">
                      {new Date(post.created_at).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        disabled={loading === post.id}
                        className="text-fg-tertiary hover:text-red-500 transition-colors disabled:opacity-40"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="font-body text-[14px] text-fg-tertiary text-center py-16">
            등록된 게시글이 없습니다.
          </p>
        )
      ) : tab === "board" ? (
        boardPostList.length > 0 ? (
        <div className="border border-border-light overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-light bg-surface-card">
                <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary">TITLE</th>
                <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary">CATEGORY</th>
                <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary">USER</th>
                <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary text-center">LIKES</th>
                <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary text-center">COMMENTS</th>
                <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary">DATE</th>
                <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary text-center">STATUS</th>
                <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary w-[60px]"></th>
              </tr>
            </thead>
            <tbody>
              {boardPostList.map((post) => (
                <tr key={post.id} className={`border-b border-border-light last:border-0 hover:bg-surface-card/50 transition-colors ${post.is_hidden ? "opacity-50" : ""}`}>
                  <td className="px-4 py-3">
                    <p className="font-body text-[13px] text-fg-primary truncate max-w-[300px]">
                      {post.title}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-caption text-[10px] tracking-[1.5px] text-fg-secondary uppercase">
                    {post.category}
                  </td>
                  <td className="px-4 py-3 font-caption text-[11px] text-fg-secondary">
                    {post.profiles.nickname}
                  </td>
                  <td className="px-4 py-3 font-caption text-[11px] text-fg-tertiary text-center">
                    {post.likes_count}
                  </td>
                  <td className="px-4 py-3 font-caption text-[11px] text-fg-tertiary text-center">
                    {post.comments_count}
                  </td>
                  <td className="px-4 py-3 font-caption text-[11px] text-fg-tertiary">
                    {new Date(post.created_at).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggleVisibility(post.id, post.is_hidden)}
                      disabled={loading === post.id}
                      className={`inline-flex items-center gap-1 px-2 py-1 font-caption text-[10px] font-medium tracking-[1px] transition-colors disabled:opacity-40 ${
                        post.is_hidden
                          ? "text-red-500 hover:text-fg-primary"
                          : "text-green-600 hover:text-fg-primary"
                      }`}
                      title={post.is_hidden ? "노출로 변경" : "미노출로 변경"}
                    >
                      {post.is_hidden ? <EyeOff size={13} /> : <Eye size={13} />}
                      {post.is_hidden ? "HIDDEN" : "VISIBLE"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDeleteBoardPost(post.id)}
                      disabled={loading === post.id}
                      className="text-fg-tertiary hover:text-red-500 transition-colors disabled:opacity-40"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
          <p className="font-body text-[14px] text-fg-tertiary text-center py-16">
            등록된 게시글이 없습니다.
          </p>
        )
      ) : tab === "reports" ? (
        reportList.length > 0 ? (
          <div className="border border-border-light overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border-light bg-surface-card">
                  <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary">TARGET</th>
                  <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary">ID</th>
                  <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary">REASON</th>
                  <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary">DETAIL</th>
                  <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary">REPORTER</th>
                  <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary">DATE</th>
                  <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary text-center">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {reportList.map((report) => (
                  <tr key={report.id} className={`border-b border-border-light last:border-0 hover:bg-surface-card/50 transition-colors ${report.status !== "pending" ? "opacity-50" : ""}`}>
                    <td className="px-4 py-3 font-caption text-[10px] tracking-[1.5px] text-fg-secondary uppercase">
                      {report.target_type === "board_post" ? "BOARD" : "POST"}
                    </td>
                    <td className="px-4 py-3 font-caption text-[11px] text-fg-tertiary">
                      #{report.target_id}
                    </td>
                    <td className="px-4 py-3 font-caption text-[10px] tracking-[1.5px] text-fg-secondary uppercase">
                      {report.reason}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-body text-[12px] text-fg-secondary truncate max-w-[200px]">
                        {report.description || "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3 font-caption text-[11px] text-fg-secondary">
                      {report.reporter?.nickname ?? "—"}
                    </td>
                    <td className="px-4 py-3 font-caption text-[11px] text-fg-tertiary">
                      {new Date(report.created_at).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {report.status === "pending" ? (
                        <div className="flex items-center justify-center gap-1 relative">
                          <button
                            onClick={() => setReviewMenuId(reviewMenuId === report.id ? null : report.id)}
                            disabled={loading === report.id}
                            className="px-2 py-1 font-caption text-[9px] font-medium tracking-[1px] text-green-600 hover:bg-green-50 transition-colors disabled:opacity-40"
                          >
                            REVIEW
                          </button>
                          {reviewMenuId === report.id && (
                            <div className="absolute right-0 top-7 bg-surface-primary border border-border-light shadow-sm z-10 min-w-[120px]">
                              {report.target_type === "board_post" && (
                                <button
                                  onClick={() => handleReviewAction(report, "hide")}
                                  className="flex items-center gap-2 px-4 py-2.5 font-caption text-[11px] text-fg-secondary hover:bg-surface-card w-full text-left"
                                >
                                  <EyeOff size={13} />
                                  숨김
                                </button>
                              )}
                              <button
                                onClick={() => handleReviewAction(report, "delete")}
                                className="flex items-center gap-2 px-4 py-2.5 font-caption text-[11px] text-red-500 hover:bg-surface-card w-full text-left"
                              >
                                <Trash2 size={13} />
                                삭제
                              </button>
                            </div>
                          )}
                          <button
                            onClick={() => handleDismiss(report.id)}
                            disabled={loading === report.id}
                            className="px-2 py-1 font-caption text-[9px] font-medium tracking-[1px] text-fg-tertiary hover:bg-surface-card transition-colors disabled:opacity-40"
                          >
                            DISMISS
                          </button>
                        </div>
                      ) : (
                        <span className={`font-caption text-[10px] font-medium tracking-[1px] ${
                          report.status === "reviewed" ? "text-green-600" : "text-fg-tertiary"
                        }`}>
                          {report.status.toUpperCase()}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="font-body text-[14px] text-fg-tertiary text-center py-16">
            신고 내역이 없습니다.
          </p>
        )
      ) : (
        <p className="font-body text-[14px] text-fg-tertiary text-center py-16">
          등록된 게시글이 없습니다.
        </p>
      )}
    </div>
  );
}
