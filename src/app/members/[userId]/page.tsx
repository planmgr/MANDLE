import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  getFeaturedMemberByUserId,
  getUserPosts,
  getUserStats,
} from "@/lib/queries/community";
import FollowButton from "@/components/community/FollowButton";
import PostGrid from "@/components/community/PostGrid";

interface MemberDetailPageProps {
  params: Promise<{ userId: string }>;
}

export async function generateMetadata({ params }: MemberDetailPageProps): Promise<Metadata> {
  const { userId } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname, bio, avatar_url")
    .eq("id", userId)
    .single();

  if (!profile) return { title: "MEMBERS — MANDLE" };

  const featuredMember = await getFeaturedMemberByUserId(userId);
  const description = profile.bio || featuredMember?.tagline || `${profile.nickname}님의 MANDLE 프로필`;
  const image = featuredMember?.cover_image_url || profile.avatar_url;

  return {
    title: `${profile.nickname} — MANDLE`,
    description,
    openGraph: {
      title: `${profile.nickname} — MANDLE`,
      description,
      ...(image && { images: [image] }),
      type: "profile",
    },
  };
}

export default async function MemberDetailPage({ params }: MemberDetailPageProps) {
  const { userId } = await params;

  const supabase = await createClient();

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (!profile) notFound();

  // Fetch everything in parallel
  const [featuredMember, stats, posts] = await Promise.all([
    getFeaturedMemberByUserId(userId),
    getUserStats(userId),
    getUserPosts(userId, 1),
  ]);

  // Check current user
  let currentUserId: string | undefined;
  let isFollowing = false;
  if (isSupabaseConfigured()) {
    const { data: userData } = await supabase.auth.getUser();
    currentUserId = userData.user?.id;

    if (currentUserId && currentUserId !== userId) {
      const { data: followData } = await supabase
        .from("follows")
        .select("id")
        .eq("follower_id", currentUserId)
        .eq("following_id", userId)
        .maybeSingle();
      isFollowing = !!followData;
    }
  }

  const isOwnProfile = currentUserId === userId;

  return (
    <main>
      <section className="section-px py-8 md:py-12">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
          {/* Avatar */}
          <div className="relative w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full overflow-hidden bg-surface-card shrink-0">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.nickname}
                fill
                className="object-cover"
                sizes="100px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-heading text-[32px] text-fg-tertiary">
                {profile.nickname.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4">
              <h1 className="font-heading text-[24px] md:text-[32px] tracking-[2px] text-fg-primary">
                {profile.nickname.toUpperCase()}
              </h1>
              {!isOwnProfile && currentUserId && (
                <FollowButton targetUserId={userId} initialFollowing={isFollowing} />
              )}
            </div>

            {profile.bio && (
              <p className="font-body text-[13px] text-fg-secondary leading-[1.6] mt-2 max-w-[500px]">
                {profile.bio}
              </p>
            )}

            {/* Stats */}
            <div className="flex items-center gap-6 mt-4">
              <div className="flex flex-col items-center">
                <span className="font-caption text-[14px] font-medium text-fg-primary">
                  {stats.postsCount}
                </span>
                <span className="font-caption text-[10px] text-fg-tertiary tracking-[1px]">
                  POSTS
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-caption text-[14px] font-medium text-fg-primary">
                  {stats.followersCount}
                </span>
                <span className="font-caption text-[10px] text-fg-tertiary tracking-[1px]">
                  FOLLOWERS
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-caption text-[14px] font-medium text-fg-primary">
                  {stats.followingCount}
                </span>
                <span className="font-caption text-[10px] text-fg-tertiary tracking-[1px]">
                  FOLLOWING
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Member Interview */}
        {featuredMember && featuredMember.interview && (
          <div className="mt-10 md:mt-14">
            <h2 className="font-caption text-[11px] font-medium tracking-[1.5px] text-fg-secondary mb-4">
              INTERVIEW
            </h2>

            {/* Cover Image */}
            {featuredMember.cover_image_url && (
              <div className="relative w-full h-[240px] md:h-[360px] overflow-hidden mb-6 bg-surface-card">
                <Image
                  src={featuredMember.cover_image_url}
                  alt={`${profile.nickname} cover`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
            )}

            {featuredMember.tagline && (
              <p className="font-body text-[16px] md:text-[18px] text-fg-primary leading-[1.6] italic mb-6">
                &ldquo;{featuredMember.tagline}&rdquo;
              </p>
            )}

            <div className="max-w-[700px]">
              <div className="font-body text-[14px] text-fg-secondary leading-[1.8] whitespace-pre-line">
                {featuredMember.interview}
              </div>
            </div>
          </div>
        )}

        {/* Member's Posts */}
        <div className="mt-10 md:mt-14">
          <h2 className="font-caption text-[11px] font-medium tracking-[1.5px] text-fg-secondary mb-5">
            POSTS
          </h2>
          <PostGrid
            initialPosts={posts}
            currentUserId={currentUserId}
            tab="mylook"
          />
        </div>
      </section>
    </main>
  );
}
