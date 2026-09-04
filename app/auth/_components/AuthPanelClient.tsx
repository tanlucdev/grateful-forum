"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Eye, EyeOff, Info, Leaf, LogOut } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AuthPanelClient({ configured }: Readonly<{ configured: boolean }>) {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signingUp, setSigningUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const supabase = useMemo(
    () => (configured ? createSupabaseBrowserClient() : null),
    [configured],
  );

  useEffect(() => {
    if (!supabase) {
      return;
    }

    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  async function submitAuth() {
    if (!supabase || !email || !password || (signingUp && !displayName.trim())) {
      return;
    }

    setLoading(true);
    setMessage("");
    const redirect = `${window.location.origin}/auth/callback`;
    const { error } = signingUp
      ? await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName.trim() },
            emailRedirectTo: redirect,
          },
        })
      : await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    setMessage(
      error
        ? error.message
        : signingUp
          ? "Kiểm tra email để xác nhận tài khoản."
          : "Đăng nhập thành công.",
    );
  }

  async function signOut() {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
  }

  if (user) {
    return (
      <div className="w-full max-w-[400px] rounded-xl bg-white p-5 shadow-[0_8px_30px_rgba(26,47,43,0.05)]">
        <p className="text-sm font-semibold text-[var(--text)]">
          Đã đăng nhập bằng {user.email}
        </p>
        <button
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--trust)] px-4 text-sm font-semibold text-white shadow-[0_8px_16px_rgba(0,109,67,0.15)]"
          onClick={signOut}
          type="button"
        >
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </button>
      </div>
    );
  }

  return (
    <section className="w-full max-w-[400px] font-[family-name:var(--font-quicksand)]">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#00a86b]/10 text-[#006d43]">
          <Leaf className="h-7 w-7" fill="currentColor" strokeWidth={1.5} />
        </div>
        <h1 className="mb-2 text-[28px] leading-9 font-bold text-[#1a2f2b]">
          BeGrateful
        </h1>
        <p className="text-base leading-6 text-[#3d4a41]">
          Nhật ký biết ơn hằng ngày
        </p>
      </div>

      {!configured ? (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-[#d1e9e0]/30 p-4 shadow-[0_4px_12px_rgba(26,47,43,0.02)]">
          <Info className="mt-0.5 h-5 w-5 shrink-0 fill-[#006d43] text-[#006d43]" />
          <p className="text-sm leading-5 font-semibold text-[#1a2f2b]">
            Chưa cấu hình Supabase. Màn này đang ở chế độ xem trước.
          </p>
        </div>
      ) : signingUp ? (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-[#d1e9e0]/30 p-4 shadow-[0_4px_12px_rgba(26,47,43,0.02)]">
          <Info className="mt-0.5 h-5 w-5 shrink-0 fill-[#006d43] text-[#006d43]" />
          <p className="text-sm leading-5 font-semibold text-[#1a2f2b]">
            Các điều biết ơn bạn đã viết sẽ được lưu vào tài khoản mới
          </p>
        </div>
      ) : null}

      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          void submitAuth();
        }}
      >
        {signingUp ? (
          <AuthField
            id="display-name"
            label="Tên hiển thị"
            onChange={setDisplayName}
            placeholder="Tên bạn muốn mọi người thấy"
            value={displayName}
            disabled={!configured}
          />
        ) : null}
        <AuthField
          id="email"
          inputMode="email"
          label="Email"
          onChange={setEmail}
          placeholder="nhap@email.com"
          type="email"
          value={email}
          disabled={!configured}
        />
        <div className="flex flex-col gap-2">
          <label className="ml-1 text-xs leading-4 font-medium text-[#3d4a41]" htmlFor="password">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              className="min-h-12 w-full rounded-xl bg-[#dde4e1]/50 px-4 py-3 pr-12 text-base leading-6 text-[#1a2f2b] shadow-inner outline-none placeholder:text-[#bccabe] focus:bg-white focus:ring-2 focus:ring-[#006d43]/50"
              id="password"
              minLength={8}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              value={password}
              disabled={!configured}
            />
            <button
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              className="absolute top-1/2 right-3 flex min-h-11 w-11 -translate-y-1/2 items-center justify-center text-[#6d7a70] hover:text-[#006d43]"
              onClick={() => setShowPassword((current) => !current)}
              type="button"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <p className="ml-1 text-[11px] leading-4 font-medium text-[#6d7a70]">
            Tối thiểu 8 ký tự
          </p>
        </div>
        <button
          className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#006d43] to-[#006d3d] px-6 py-3.5 text-sm leading-5 font-semibold text-white shadow-[0_8px_16px_rgba(0,109,67,0.15)] hover:shadow-[0_12px_24px_rgba(0,109,67,0.2)] disabled:opacity-50 disabled:shadow-none"
          disabled={
            !configured ||
            loading ||
            !email ||
            !password ||
            (signingUp && !displayName.trim())
          }
          type="submit"
        >
          <span>{loading ? "Đang xử lý..." : signingUp ? "Tạo tài khoản" : "Đăng nhập"}</span>
          <ArrowRight className="h-[18px] w-[18px]" />
        </button>
      </form>

      {message ? (
        <p className="mt-4 break-words text-sm leading-6 text-[#3d4a41]" role="status">
          {message}
        </p>
      ) : null}

      <button
        className="mx-auto mt-8 flex min-h-11 items-center justify-center gap-1 text-base leading-6 text-[#6d7a70] hover:text-[#006d43]"
        onClick={() => {
          setSigningUp((current) => !current);
          setMessage("");
        }}
        type="button"
      >
        {signingUp ? "Đã có tài khoản?" : "Chưa có tài khoản?"}
        <span className="font-semibold text-[#006d43] underline-offset-4 hover:underline">
          {signingUp ? "Đăng nhập" : "Đăng ký"}
        </span>
      </button>
    </section>
  );
}

function AuthField({
  id,
  inputMode,
  label,
  onChange,
  placeholder,
  type = "text",
  disabled,
  value,
}: Readonly<{
  id: string;
  inputMode?: "email";
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: "email" | "text";
  disabled?: boolean;
  value: string;
}>) {
  return (
    <div className="flex flex-col gap-2">
      <label className="ml-1 text-xs leading-4 font-medium text-[#3d4a41]" htmlFor={id}>
        {label}
      </label>
      <input
        className="min-h-12 w-full rounded-xl bg-[#dde4e1]/50 px-4 py-3 text-base leading-6 text-[#1a2f2b] shadow-inner outline-none placeholder:text-[#bccabe] focus:bg-white focus:ring-2 focus:ring-[#006d43]/50 disabled:cursor-not-allowed disabled:opacity-60"
        id={id}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        value={value}
      />
    </div>
  );
}
