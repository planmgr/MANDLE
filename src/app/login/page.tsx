"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function IconGoogle() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function IconKakao() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M12 3C6.48 3 2 6.36 2 10.44c0 2.62 1.75 4.93 4.38 6.24l-1.12 4.1a.3.3 0 0 0 .45.33l4.77-3.15c.49.07 1 .1 1.52.1 5.52 0 10-3.36 10-7.5S17.52 3 12 3z" fill="#3C1E1E" />
    </svg>
  );
}

function IconApple() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSocialLogin = async (provider: "google" | "kakao" | "apple") => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setError(error.message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nickname },
        },
      });
      if (error) {
        setError(error.message);
      } else {
        router.push("/");
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        router.push("/");
        router.refresh();
      }
    }

    setLoading(false);
  };

  return (
      <main className="flex-1 flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-[400px] flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col items-center gap-3">
            <Image
              src="/images/logo-black.png"
              alt="MANDLE"
              width={180}
              height={36}
              className="h-[32px] md:h-[40px] w-auto"
              priority
            />
            <p className="font-body text-[13px] text-fg-secondary">
              {isSignUp ? "새 계정을 만들어 스타일 여정을 시작하세요." : "로그인하고 스타일 커뮤니티에 참여하세요."}
            </p>
          </div>

          {/* Error */}
          {error && (
            <p className="text-center font-body text-[13px] text-red-500">
              {error}
            </p>
          )}

          {/* Social Login */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleSocialLogin("google")}
              disabled={loading}
              className="flex items-center justify-center gap-3 w-full py-3 border border-border-light font-caption text-[12px] font-medium tracking-[1px] text-fg-primary hover:bg-surface-card transition-colors disabled:opacity-50"
            >
              <IconGoogle />
              GOOGLE로 {isSignUp ? "가입" : "로그인"}
            </button>
            <button
              onClick={() => handleSocialLogin("kakao")}
              disabled={loading}
              className="flex items-center justify-center gap-3 w-full py-3 bg-[#FEE500] font-caption text-[12px] font-medium tracking-[1px] text-[#3C1E1E] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <IconKakao />
              카카오로 {isSignUp ? "가입" : "로그인"}
            </button>
            <button
              onClick={() => handleSocialLogin("apple")}
              disabled={loading}
              className="flex items-center justify-center gap-3 w-full py-3 bg-fg-primary font-caption text-[12px] font-medium tracking-[1px] text-fg-inverse hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <IconApple />
              APPLE로 {isSignUp ? "가입" : "로그인"}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border-light" />
            <span className="font-caption text-[10px] tracking-[2px] text-fg-tertiary">OR</span>
            <div className="flex-1 h-px bg-border-light" />
          </div>

          {/* Email Form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {isSignUp && (
              <div>
                <label htmlFor="nickname" className="font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary mb-1.5 block">
                  NICKNAME
                </label>
                <input
                  id="nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="닉네임을 입력하세요"
                  className="w-full px-4 py-3 border border-border-light font-body text-[13px] text-fg-primary placeholder:text-fg-tertiary focus:outline-none focus:border-fg-primary transition-colors"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary mb-1.5 block">
                EMAIL
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-fg-tertiary" aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-11 pr-4 py-3 border border-border-light font-body text-[13px] text-fg-primary placeholder:text-fg-tertiary focus:outline-none focus:border-fg-primary transition-colors"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary mb-1.5 block">
                PASSWORD
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-fg-tertiary" aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  className="w-full pl-11 pr-11 py-3 border border-border-light font-body text-[13px] text-fg-primary placeholder:text-fg-tertiary focus:outline-none focus:border-fg-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-fg-tertiary hover:text-fg-primary"
                  aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-fg-primary text-fg-inverse font-caption text-[12px] font-semibold tracking-[1.5px] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "처리 중..." : isSignUp ? "CREATE ACCOUNT" : "LOGIN"}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center font-body text-[13px] text-fg-secondary">
            {isSignUp ? "이미 계정이 있으신가요?" : "아직 계정이 없으신가요?"}{" "}
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
              className="font-semibold text-fg-primary underline underline-offset-2"
            >
              {isSignUp ? "로그인" : "회원가입"}
            </button>
          </p>
        </div>
      </main>
  );
}
