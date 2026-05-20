export function extractTags(caption: string): string[] {
  const regex = /#([\w가-힣]+)/g;
  const tags: string[] = [];
  let match;
  while ((match = regex.exec(caption)) !== null) {
    tags.push(match[1]);
  }
  return [...new Set(tags)];
}

export function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "방금 전";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}분 전`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}시간 전`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}일 전`;
  return new Date(date).toLocaleDateString("ko-KR");
}
