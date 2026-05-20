# MANDLE - Architecture & Policy Document

> **mandle.kr** | Premium Men's Styling Platform
> Last updated: 2026-05-20

---

## 1. Project Overview

MANDLE은 프리미엄 남성 스타일링 플랫폼으로, 커뮤니티 기반 스타일 공유와 콘텐츠 큐레이션을 제공한다.

### Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router, Turbopack) | 16.2.6 |
| UI | React | 19.2.4 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS v4 (inline theme) | ^4 |
| Backend / DB | Supabase (PostgreSQL + Auth + Storage) | — |
| Auth SDK | @supabase/ssr | ^0.10.3 |
| Icons | lucide-react | ^1.14.0 |
| Deploy | — | — |

### Supabase Project

- **Project ID:** `mfjwfeldtbldfnwlrjsl`
- **Region:** ap-northeast-2 (Seoul)
- **URL:** `https://mfjwfeldtbldfnwlrjsl.supabase.co`

---

## 2. Directory Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (fonts, NavBar, Footer)
│   ├── globals.css             # Global styles + Tailwind theme
│   ├── page.tsx                # Home (/)
│   ├── login/page.tsx          # Login (/login)
│   ├── community/page.tsx      # Community (/community)
│   ├── members/                # Members feature
│   │   ├── page.tsx            #   Listing (/members)
│   │   └── [userId]/page.tsx   #   Detail (/members/:userId)
│   ├── my/page.tsx             # My page (/my) — 인증 필요
│   ├── style/page.tsx          # Style (/style)
│   ├── grooming/page.tsx       # Grooming (/grooming)
│   ├── shop/page.tsx           # Shop (/shop)
│   ├── auth/callback/route.ts  # Supabase auth callback
│   └── api/community/          # API routes
│       ├── posts/route.ts      #   GET /api/community/posts
│       └── comments/route.ts   #   GET /api/community/comments
│
├── components/
│   ├── layout/                 # NavBar, Footer, etc.
│   ├── ui/                     # Reusable UI (PageHeader, etc.)
│   ├── sections/               # Homepage section components
│   ├── community/              # Community feature components
│   └── members/                # Members feature components
│
└── lib/
    ├── supabase/
    │   ├── server.ts           # Server-side Supabase client
    │   ├── client.ts           # Browser-side Supabase client
    │   └── proxy.ts            # Session middleware (replaces middleware.ts)
    ├── actions/
    │   └── community.ts        # Server Actions (mutations)
    ├── queries/
    │   └── community.ts        # Server-side DB queries (reads)
    ├── types/
    │   └── community.ts        # TypeScript interfaces
    └── utils/
        ├── tags.ts             # Hashtag extraction, timeAgo
        └── storage.ts          # Image upload helpers
```

---

## 3. Routing & Navigation

### NavBar Menu Order

```
COMMUNITY → MEMBERS → STYLE → GROOMING → SHOP
```

### Route Table

| Route | Type | Auth | Description |
|-------|------|------|-------------|
| `/` | Static | No | Homepage |
| `/login` | Static | No | Email/password login |
| `/community` | Dynamic | No | Feed, Popular, Collections, Board tabs |
| `/community?tab=board` | Dynamic | No | 자유게시판 |
| `/members` | Dynamic | No | Featured + Top members |
| `/members/[userId]` | Dynamic | No | Member detail (profile, interview, posts) |
| `/my` | Dynamic | **Yes** | My page (profile, stats, posts) |
| `/style` | Dynamic | No | 카테고리 그리드 + Featured Styles (DB) |
| `/style?category=MINIMAL` | Dynamic | No | 카테고리별 글 목록 |
| `/style/[id]` | Dynamic | No | 스타일 글 상세 |
| `/grooming` | Dynamic | No | 카테고리 탭 + 글 목록 (DB) |
| `/grooming?category=BEARD` | Dynamic | No | 카테고리별 글 목록 |
| `/grooming/[id]` | Dynamic | No | 그루밍 글 상세 |
| `/shop` | Static | No | Shop content |

### Protected Routes

`/my/*` 경로는 인증이 필요하다. 미인증 시 `/login`으로 리다이렉트된다.

**구현 방식:** `proxy.ts`에서 세션 확인 후 리다이렉트 (Next.js 16에서는 `middleware.ts` 대신 `proxy.ts` 패턴 사용).

---

## 4. Authentication

### 방식

- **Email + Password** (Supabase Auth)
- 회원가입 시 닉네임 필수 입력
- `user_metadata`에 nickname, avatar_url 저장

### Session Management

- `@supabase/ssr`의 cookie 기반 세션
- `proxy.ts`가 매 요청마다 세션 refresh
- Server Component에서 `createClient()` → `supabase.auth.getUser()`로 사용자 확인

### Profile Sync

회원가입/수정 시 두 곳에 동기화:
1. `profiles` 테이블 (nickname, bio, avatar_url)
2. `auth.users.raw_user_meta_data` (nickname, avatar_url)

DB 트리거가 `auth.users` 변경 시 `profiles` 테이블 자동 동기화:
- `on_auth_user_created` → 프로필 자동 생성
- `on_auth_user_updated` → 프로필 자동 업데이트

---

## 5. Database Schema

### Tables

#### `profiles`
| Column | Type | Note |
|--------|------|------|
| id | uuid PK | FK → auth.users(id) |
| nickname | text | NOT NULL |
| avatar_url | text | nullable |
| bio | text | nullable |
| created_at | timestamptz | |
| updated_at | timestamptz | |

#### `posts` (이미지 피드)
| Column | Type | Note |
|--------|------|------|
| id | bigint PK | auto-increment |
| user_id | uuid | FK → auth.users(id), FK → profiles(id) |
| image_url | text | NOT NULL |
| caption | text | nullable |
| likes_count | int | denormalized, trigger 관리 |
| comments_count | int | denormalized, trigger 관리 |
| created_at | timestamptz | |
| updated_at | timestamptz | |

#### `comments`
| Column | Type | Note |
|--------|------|------|
| id | bigint PK | |
| post_id | bigint | FK → posts(id) |
| user_id | uuid | FK → auth.users(id), FK → profiles(id) |
| content | text | NOT NULL |
| created_at | timestamptz | |

#### `likes`
| Column | Type | Note |
|--------|------|------|
| user_id | uuid | PK (composite) |
| post_id | bigint | PK (composite) |
| created_at | timestamptz | |

#### `bookmarks`
| Column | Type | Note |
|--------|------|------|
| user_id | uuid | PK (composite) |
| post_id | bigint | PK (composite) |
| created_at | timestamptz | |

#### `follows`
| Column | Type | Note |
|--------|------|------|
| follower_id | uuid | PK (composite) |
| following_id | uuid | PK (composite) |
| created_at | timestamptz | |

Constraint: `no_self_follow` (follower_id != following_id)

#### `tags`
| Column | Type | Note |
|--------|------|------|
| id | bigint PK | |
| name | text | UNIQUE |
| post_count | int | denormalized, trigger 관리 |
| created_at | timestamptz | |

#### `post_tags`
| Column | Type | Note |
|--------|------|------|
| post_id | bigint | PK (composite), FK → posts |
| tag_id | bigint | PK (composite), FK → tags |

#### `board_posts` (자유게시판)
| Column | Type | Note |
|--------|------|------|
| id | bigint PK | |
| user_id | uuid | FK → profiles(id) |
| title | text | NOT NULL |
| body | text | NOT NULL |
| image_url | text | nullable |
| likes_count | int | denormalized |
| comments_count | int | denormalized |
| created_at | timestamptz | |
| updated_at | timestamptz | |

#### `board_comments`
| Column | Type | Note |
|--------|------|------|
| id | bigint PK | |
| board_post_id | bigint | FK → board_posts(id) |
| user_id | uuid | FK → profiles(id) |
| content | text | NOT NULL |
| created_at | timestamptz | |

#### `board_likes`
| Column | Type | Note |
|--------|------|------|
| user_id | uuid | PK (composite) |
| board_post_id | bigint | PK (composite) |
| created_at | timestamptz | |

#### `featured_members`
| Column | Type | Note |
|--------|------|------|
| id | bigint PK | |
| user_id | uuid | FK → profiles(id), UNIQUE |
| interview | text | 운영자 작성 인터뷰 |
| cover_image_url | text | nullable |
| tagline | text | 한줄 소개 |
| display_order | int | 정렬 순서 |
| is_active | boolean | 노출 여부 |
| created_at | timestamptz | |

### Denormalized Counts & Triggers

카운트 필드는 DB 트리거로 자동 관리된다:

| Table | Field | Trigger |
|-------|-------|---------|
| posts | likes_count | likes INSERT/DELETE |
| posts | comments_count | comments INSERT/DELETE |
| tags | post_count | post_tags INSERT/DELETE |
| board_posts | likes_count | board_likes INSERT/DELETE |
| board_posts | comments_count | board_comments INSERT/DELETE |

### Foreign Key Naming Convention

PostgREST에서 FK hint를 사용할 때 정확한 이름이 필요하다:

```
profiles!posts_user_id_profiles_fkey(*)
profiles!comments_user_id_profiles_fkey(*)
profiles!board_posts_user_id_fkey(*)
profiles!board_comments_user_id_fkey(*)
profiles!featured_members_user_id_fkey(*)
```

> **주의:** `posts.user_id`는 `auth.users`와 `profiles` 양쪽에 FK가 있다. Supabase PostgREST 쿼리 시 반드시 정확한 FK name hint를 사용해야 한다.

---

## 6. Row Level Security (RLS)

모든 테이블에 RLS가 활성화되어 있다.

### 공통 패턴

| 패턴 | 적용 |
|------|------|
| 전체 읽기 허용 | posts, comments, likes, tags, follows, board_*, featured_members |
| 본인만 쓰기 | `auth.uid() = user_id` |
| 본인만 삭제 | `auth.uid() = user_id` |
| 본인만 읽기 | bookmarks (본인 북마크만 조회) |
| 관계 기반 쓰기 | post_tags (post 소유자만 태그 관리) |

### Storage RLS

| Bucket | 읽기 | 쓰기 | 수정/삭제 |
|--------|------|------|-----------|
| `posts` | 전체 | 인증 사용자 | 본인 폴더만 |
| `avatars` | 전체 | 본인 폴더만 | 본인 폴더만 |

Storage 경로 규칙: `{user_id}/{filename}` (폴더 = user_id)

---

## 7. Storage

### Buckets

| Bucket | Public | 용도 |
|--------|--------|------|
| `posts` | Yes | 게시글 이미지, 게시판 첨부 이미지 |
| `avatars` | Yes | 프로필 아바타 |

### Upload Path 패턴

```
posts/{user_id}/{random_uuid}.{ext}       # 게시글 이미지
avatars/{user_id}/avatar.{ext}            # 아바타 (upsert)
```

### Image URL

```
https://mfjwfeldtbldfnwlrjsl.supabase.co/storage/v1/object/public/{bucket}/{path}
```

---

## 8. Server Actions

모든 mutation은 `src/lib/actions/community.ts`의 Server Actions로 처리한다.

| Action | 기능 | Revalidate |
|--------|------|------------|
| `createPost(formData)` | 이미지 업로드 + 게시글 생성 + 태그 추출 | /community |
| `deletePost(postId)` | 게시글 삭제 + 이미지 삭제 | /community |
| `toggleLike(postId)` | 좋아요 토글 | — |
| `addComment(postId, content)` | 댓글 추가 | — |
| `deleteComment(commentId)` | 댓글 삭제 | — |
| `toggleBookmark(postId)` | 북마크 토글 | — |
| `toggleFollow(targetUserId)` | 팔로우 토글 | — |
| `updateProfile(formData)` | 프로필 수정 (닉네임, bio, 아바타) | /my |
| `createBoardPost(formData)` | 게시판 글 작성 | /community |
| `deleteBoardPost(postId)` | 게시판 글 삭제 | /community |
| `toggleBoardLike(postId)` | 게시판 좋아요 토글 | — |
| `addBoardComment(postId, content)` | 게시판 댓글 추가 | — |
| `deleteBoardComment(commentId)` | 게시판 댓글 삭제 | — |

### 공통 패턴

1. `createClient()` → `supabase.auth.getUser()` → 인증 확인
2. 미인증 시 `throw new Error("Unauthorized")`
3. mutation 후 `revalidatePath()` 호출 (필요 시)
4. 토글 패턴: 기존 데이터 확인 → 있으면 삭제, 없으면 추가

---

## 9. Server Queries

읽기 전용 쿼리는 `src/lib/queries/community.ts`에서 Server Component가 직접 호출한다.

| Query | 반환 타입 | 용도 |
|-------|-----------|------|
| `getFeedPosts(page, userId?, tag?)` | `Post[]` | 최신순 피드 |
| `getPopularPosts(page, userId?)` | `Post[]` | 인기순 |
| `getFollowingPosts(userId, page)` | `Post[]` | 팔로잉 피드 |
| `getBookmarkedPosts(userId, page)` | `Post[]` | 북마크 컬렉션 |
| `getUserPosts(targetUserId, page)` | `Post[]` | 특정 유저 게시글 |
| `getPostById(postId, userId?)` | `Post \| null` | 단건 조회 |
| `getComments(postId, page)` | `Comment[]` | 댓글 목록 |
| `getPopularTags(limit?)` | `Tag[]` | 인기 태그 |
| `getRecommendedUsers(currentUserId?, limit?)` | `Profile[]` | 추천 유저 |
| `getUserStats(userId)` | `{ postsCount, followersCount, followingCount }` | 통계 |
| `getBoardPosts(page, userId?)` | `BoardPost[]` | 게시판 글 목록 |
| `getBoardPostById(postId, userId?)` | `BoardPost \| null` | 게시판 단건 |
| `getBoardComments(boardPostId, page)` | `BoardComment[]` | 게시판 댓글 |
| `getFeaturedMembers()` | `FeaturedMember[]` | 피처드 멤버 |
| `getFeaturedMemberByUserId(userId)` | `FeaturedMember \| null` | 피처드 단건 |
| `getTopMembers(limit?)` | `TopMember[]` | 활동 기반 인기 멤버 |

**Style Queries** (`src/lib/queries/style.ts`):

| Query | 반환 타입 | 용도 |
|-------|-----------|------|
| `getStyleArticles(category?, limit?)` | `StyleArticle[]` | 카테고리별 글 목록 |
| `getFeaturedStyleArticles(limit?)` | `StyleArticle[]` | 피처드 스타일 글 |
| `getStyleArticleById(id)` | `StyleArticle \| null` | 글 상세 |
| `getStyleArticleCountByCategory()` | `Record<string, number>` | 카테고리별 글 수 |

**Grooming Queries** (`src/lib/queries/grooming.ts`):

| Query | 반환 타입 | 용도 |
|-------|-----------|------|
| `getGroomingArticles(category?, limit?)` | `GroomingArticle[]` | 카테고리별 글 목록 |
| `getGroomingArticleById(id)` | `GroomingArticle \| null` | 글 상세 |

### Pagination

- Feed/Popular/Collections: **PAGE_SIZE = 12**
- Board: **BOARD_PAGE_SIZE = 15**
- Comments: **20 per page**
- Infinite scroll: IntersectionObserver + API route

---

## 10. API Routes

클라이언트에서 추가 데이터를 fetch할 때 사용하는 API route.

### `GET /api/community/posts`

Query params: `tab`, `page`, `tag`

| tab | 동작 |
|-----|------|
| `feed` (default) | getFeedPosts |
| `popular` | getPopularPosts |
| `collections` | getBookmarkedPosts (인증 필요) |
| `board` | getBoardPosts |

### `GET /api/community/comments`

Query params: `postId`, `page`, `type`

| type | 동작 |
|------|------|
| (default) | getComments |
| `board` | getBoardComments |

---

## 11. Design System

### Color Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `surface-primary` | `#ffffff` | 배경 |
| `surface-dark` | `#1a1a1a` | 다크 배경 |
| `surface-card` | `#f5f5f5` | 카드, placeholder |
| `fg-primary` | `#1a1a1a` | 주요 텍스트 |
| `fg-secondary` | `#666666` | 보조 텍스트 |
| `fg-tertiary` | `#999999` | 비활성 텍스트 |
| `fg-muted` | `#aaaaaa` | 최하위 텍스트 |
| `fg-inverse` | `#ffffff` | 다크 배경 위 텍스트 |
| `border-light` | `#e0e0e0` | 구분선 |
| `border-dark` | `#333333` | 다크 구분선 |
| `accent` | `#c8a96e` | 골드 액센트 |

### Typography

| Token | Font | Usage |
|-------|------|-------|
| `font-heading` | Anton | 페이지 제목 (대문자) |
| `font-body` | Inter | 본문 텍스트 |
| `font-caption` | Geist Sans | 라벨, 버튼, 메타 정보 |

### Tailwind Usage

```css
/* Color */
text-fg-primary, bg-surface-card, border-border-light, text-accent

/* Font */
font-heading, font-body, font-caption

/* Responsive padding */
.section-px → px-5 md:px-8 lg:px-16
```

### UI Conventions

- 대문자 텍스트: heading, 라벨, 버튼 (`tracking-[1.5px]`)
- 아바타 fallback: 닉네임 첫 글자 (대문자)
- 시간 표시: 한국어 상대 시간 ("방금 전", "3시간 전", "2일 전")
- 무한 스크롤: IntersectionObserver 패턴
- Modal: 전체화면 overlay + 스크롤 가능 콘텐츠
- Floating Action Button: 우하단 고정 (+ 아이콘)

---

## 12. Component Architecture

### Rendering Strategy

| 패턴 | 사용처 |
|------|--------|
| Server Component | Page, Layout, 데이터 fetch |
| Client Component | 인터랙션 (좋아요, 댓글, 모달, 팔로우) |
| Server Action | Mutation (생성, 수정, 삭제) |
| API Route | 클라이언트 측 추가 fetch (infinite scroll) |

### Community Components

| Component | Type | 역할 |
|-----------|------|------|
| FeedTabs | Client | FEED/POPULAR/COLLECTIONS/BOARD 탭 전환 |
| PostGrid | Client | 이미지 피드 무한 스크롤 그리드 |
| PostCard | Client | 게시글 카드 (이미지, 좋아요, 댓글, 북마크) |
| PostDetailModal | Client | 게시글 상세 모달 |
| CommentList | Client | 댓글 목록 + 작성 + 삭제 |
| CreatePostButton | Client | 플로팅 + 버튼 |
| CreatePostDialog | Client | 게시글 작성 다이얼로그 |
| FollowButton | Client | 팔로우/언팔로우 토글 |
| PopularTags | Server | 사이드바 인기 태그 |
| RecommendedUsers | Server | 사이드바 추천 유저 |
| ProfileHeader | Client | 마이페이지 프로필 헤더 |
| EditProfileModal | Client | 프로필 수정 모달 |
| BoardPostList | Client | 게시판 리스트 무한 스크롤 |
| BoardPostCard | Client | 게시판 글 카드 |
| BoardPostDetailModal | Client | 게시판 글 상세 모달 |
| BoardCommentList | Client | 게시판 댓글 |
| CreateBoardPostButton | Client | 게시판 플로팅 + 버튼 |
| CreateBoardPostDialog | Client | 게시판 글 작성 |

### Members Components

| Component | Type | 역할 |
|-----------|------|------|
| FeaturedMemberCard | Server | 피처드 멤버 카드 (커버 이미지 + 프로필) |
| TopMemberItem | Server | 인기 멤버 리스트 아이템 (순위 + 통계) |

---

## 13. Configuration Notes

### next.config.ts

```typescript
{
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb"    // 이미지 업로드를 위해 필수
    }
  },
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "mfjwfeldtbldfnwlrjsl.supabase.co",
      pathname: "/storage/v1/object/public/**"
    }]
  }
}
```

> **주의:** Next.js 16에서 `serverActions`는 반드시 `experimental` 아래에 위치해야 한다. 최상위에 넣으면 "Unrecognized key" 경고가 발생한다.

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://mfjwfeldtbldfnwlrjsl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

두 변수 모두 `NEXT_PUBLIC_` prefix로 브라우저에 노출된다 (Supabase anon key는 RLS로 보호).

---

## 14. SQL Migrations

마이그레이션 파일은 `supabase/migrations/`에 보관하며, Supabase Dashboard > SQL Editor에서 실행한다.

| File | 내용 | 상태 |
|------|------|------|
| `001_community_feature.sql` | profiles, posts, comments, likes, bookmarks, follows, tags, post_tags, storage, triggers | 실행 완료 |
| `002_board_feature.sql` | board_posts, board_comments, board_likes, triggers | 실행 완료 |
| `003_featured_members.sql` | featured_members 테이블, RLS, indexes | 실행 완료 |
| `004_style_articles.sql` | style_articles 테이블, RLS, indexes | 실행 완료 |
| `005_grooming_articles.sql` | grooming_articles 테이블, RLS, indexes | 실행 완료 |

### 추가 실행된 ALTER 문 (001 이후)

```sql
-- posts → profiles 직접 FK 추가
ALTER TABLE public.posts
  ADD CONSTRAINT posts_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id);

-- comments → profiles 직접 FK 추가
ALTER TABLE public.comments
  ADD CONSTRAINT comments_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id);
```

> 이 ALTER문은 PostgREST가 profiles 조인을 정상적으로 수행하기 위해 필요하다.

---

## 15. Featured Members 운영

### 데이터 관리

피처드 멤버는 운영자가 Supabase Dashboard 또는 SQL로 직접 관리한다.

```sql
-- 피처드 멤버 추가
INSERT INTO public.featured_members (user_id, interview, cover_image_url, tagline, display_order)
VALUES (
  'user-uuid-here',
  '인터뷰 내용...',
  'https://...cover-image.jpg',
  '한줄 소개',
  1
);

-- 순서 변경
UPDATE public.featured_members SET display_order = 2 WHERE user_id = 'uuid';

-- 비활성화
UPDATE public.featured_members SET is_active = false WHERE user_id = 'uuid';
```

### Top Members (자동)

Top Members는 별도 테이블 없이 `posts` 테이블에서 실시간 계산한다:
- 유저별 게시글 수 + 총 좋아요 합산
- total_likes 내림차순, posts_count 내림차순 정렬
- 기본 10명 표시

---

## 16. Known Issues & Workarounds

| Issue | Workaround |
|-------|-----------|
| Next.js 16에서 `middleware.ts` deprecated | `proxy.ts` 패턴 사용 |
| `serverActions.bodySizeLimit` 위치 | `experimental` 아래에 배치 |
| posts.user_id가 auth.users와 profiles 양쪽 FK | 쿼리 시 정확한 FK name hint 필수 |
| Supabase CLI 미설치 | SQL Editor에서 직접 실행 |
| Next.js Image `sizes` prop 경고 | fill 사용 시 sizes 속성 필요 |
