"use client";

import type { User } from "@supabase/supabase-js";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Heart, Info, Leaf, Loader2, LogOut, Mail, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type View = "signin" | "signup" | "forgot";
type Banner = { tone: "error" | "success"; title: string; body: string };

export function AuthPanelClient({ configured }: Readonly<{ configured: boolean }>) {
  const [view, setView] = useState<View>("signin");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const supabase = useMemo(() => (configured ? createSupabaseBrowserClient() : null), [configured]);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  function changeView(next: View) {
    setView(next);
    setBanner(null);
    setResetSent(false);
  }

  async function submitAuth() {
    if (!supabase) return;
    setLoading(true);
    setBanner(null);
    const redirect = `${window.location.origin}/auth/callback`;

    if (view === "forgot") {
      if (!email) return void setLoading(false);
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: redirect });
      setLoading(false);
      if (error) return void setBanner({ tone: "error", title: "Không gửi được liên kết", body: error.message });
      setResetSent(true);
      return;
    }

    if (!email || !password || (view === "signup" && !displayName.trim())) return void setLoading(false);
    const { error } = view === "signup"
      ? await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: displayName.trim() }, emailRedirectTo: redirect },
        })
      : await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setBanner({
        tone: "error",
        title: view === "signin" ? "Tài khoản hoặc mật khẩu chưa khớp" : "Không thể tạo tài khoản",
        body: view === "signin" ? "Bạn kiểm tra lại email hoặc dùng “Quên mật khẩu” bên dưới nhé." : error.message,
      });
      return;
    }
    setBanner({
      tone: "success",
      title: view === "signup" ? "Tài khoản đã sẵn sàng" : "Đăng nhập thành công",
      body: view === "signup" ? "Kiểm tra email để xác nhận tài khoản." : "Bạn đang ở trong BeGrateful.",
    });
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
  }

  if (user) return <UserCard email={user.email ?? null} onSignOut={signOut} />;
  if (view === "forgot") {
    return (
      <ForgotView
        banner={banner}
        changeView={changeView}
        configured={configured}
        email={email}
        loading={loading}
        onSubmit={() => void submitAuth()}
        resetSent={resetSent}
        setEmail={setEmail}
      />
    );
  }
  return (
    <LoginView
      banner={banner}
      changeView={changeView}
      configured={configured}
      displayName={displayName}
      email={email}
      loading={loading}
      onSubmit={() => void submitAuth()}
      password={password}
      setBanner={setBanner}
      setDisplayName={setDisplayName}
      setEmail={setEmail}
      setPassword={setPassword}
      setShowPassword={setShowPassword}
      showPassword={showPassword}
      view={view}
    />
  );
}

function UserCard({ email, onSignOut }: Readonly<{ email: string | null; onSignOut: () => Promise<void> }>) {
  return (
    <div className="w-full max-w-[400px] rounded-xl bg-white p-5 shadow-[0_8px_30px_rgba(26,47,43,0.05)]">
      <p className="text-sm font-semibold text-[var(--text)]">Đã đăng nhập bằng {email}</p>
      <button className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--trust)] px-4 text-sm font-semibold text-white shadow-[0_8px_16px_rgba(0,109,67,0.15)]" onClick={onSignOut} type="button">
        <LogOut className="h-4 w-4" /> Đăng xuất
      </button>
    </div>
  );
}

function ForgotView({
  banner,
  changeView,
  configured,
  email,
  loading,
  onSubmit,
  resetSent,
  setEmail,
}: Readonly<{
  banner: Banner | null;
  changeView: (next: View) => void;
  configured: boolean;
  email: string;
  loading: boolean;
  onSubmit: () => void;
  resetSent: boolean;
  setEmail: (value: string) => void;
}>) {
  return (
    <section className="w-full max-w-[400px] font-[family-name:var(--font-quicksand)]">
      <div className="mb-3 flex items-center justify-between">
        <button aria-label="Quay lại" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#006d43] shadow-sm" onClick={() => changeView("signin")} type="button">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold text-[#3d4a41] shadow-sm backdrop-blur">
          <Heart className="h-3.5 w-3.5 fill-current text-[#006d43]" /> BeGrateful Care
        </div>
        <span className="h-10 w-10" />
      </div>
      <div className="rounded-[28px] bg-white p-6 shadow-[0_8px_30px_rgba(26,47,43,0.06)]">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3 flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 scale-105 rounded-full bg-[#d1e9e0]/40" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#eef5f2] shadow-inner">
              <Leaf className="h-10 w-10 text-[#006d43]" fill="currentColor" />
            </div>
            <div className="absolute top-0 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#9af6b8] text-[#006d43] shadow-sm">
              <Info className="h-3 w-3" />
          </div>
        </div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#1a2f2b]">BeGrateful</p>
          <h1 className="mt-1 text-[24px] leading-8 font-bold text-[#1a2f2b]">Quên mật khẩu?</h1>
          <p className="mt-2 text-[16px] leading-6 text-[#3d4a41]">Đừng lo lắng, hãy nhập email đã đăng ký. BeGrateful sẽ gửi đến bạn liên kết an toàn để đặt lại mật khẩu mới nhé.</p>
        </div>
        <form className="mt-6 flex flex-col gap-4" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
          <AuthField id="recovery-email" inputMode="email" label="Địa chỉ Email của bạn" onChange={setEmail} placeholder="tam.an.yen@email.com" type="email" value={email} disabled={!configured || loading} />
          <div className="rounded-xl bg-[#d1e9e0]/30 p-3"><p className="text-[11px] leading-4 font-medium text-[#3d4a41]">Liên kết chỉ có hiệu lực trong vòng 15 phút và BeGrateful không bao giờ yêu cầu mã OTP qua điện thoại.</p></div>
          <button className="mt-1 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#006d43] to-[#006d3d] px-6 py-3.5 text-sm leading-5 font-semibold text-white shadow-[0_8px_16px_rgba(0,109,67,0.15)] disabled:opacity-50 disabled:shadow-none" disabled={!configured || loading || !email} type="submit">
            <span>{loading ? "Đang chuẩn bị thư..." : "Gửi liên kết khôi phục"}</span>
            {loading ? <Loader2 className="h-[18px] w-[18px] animate-spin" /> : <ArrowRight className="h-[18px] w-[18px]" />}
          </button>
        </form>
        {resetSent ? (
          <div className="mt-4 rounded-xl bg-[#d1e9e0]/40 p-3.5 text-center">
            <div className="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#9af6b8] text-[#006d43]"><Mail className="h-[18px] w-[18px]" /></div>
            <p className="text-[12px] font-semibold text-[#047240]">Đã gửi thư khôi phục!</p>
            <p className="mt-0.5 text-[11px] text-[#3d4a41]">Vui lòng kiểm tra hòm thư đến của bạn nhé.</p>
          </div>
        ) : null}
        {banner?.tone === "error" ? <p className="mt-4 text-sm text-[#8a422d]">{banner.body}</p> : null}
        <div className="mt-5 rounded-xl bg-[#eef5f2]/70 p-3 text-center"><p className="text-[11px] leading-4 text-[#3d4a41]">Chưa thấy email? Vui lòng kiểm tra hộp thư rác (Spam) hoặc thử lại sau vài phút nhé.</p></div>
        <div className="mt-5 text-center"><p className="text-[12px] leading-4 text-[#3d4a41]">Nhớ ra mật khẩu rồi?<button className="ml-1 font-semibold text-[#006d43] hover:underline" onClick={() => changeView("signin")} type="button">Đăng nhập ngay</button></p></div>
        <div className="mt-6 flex justify-center"><div className="h-1 w-24 rounded-full bg-[#dde4e1]" /></div>
      </div>
    </section>
  );
}

function LoginView({
  banner,
  changeView,
  configured,
  displayName,
  email,
  loading,
  onSubmit,
  password,
  setBanner,
  setDisplayName,
  setEmail,
  setPassword,
  setShowPassword,
  showPassword,
  view,
}: Readonly<{
  banner: Banner | null;
  changeView: (next: View) => void;
  configured: boolean;
  displayName: string;
  email: string;
  loading: boolean;
  onSubmit: () => void;
  password: string;
  setBanner: (value: Banner | null) => void;
  setDisplayName: (value: string) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setShowPassword: (value: boolean | ((current: boolean) => boolean)) => void;
  showPassword: boolean;
  view: View;
}>) {
  return (
    <section className="w-full max-w-[400px] font-[family-name:var(--font-quicksand)]">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#00a86b]/10 text-[#006d43]"><Leaf className="h-7 w-7" fill="currentColor" strokeWidth={1.5} /></div>
        <h1 className="mb-2 text-[28px] leading-9 font-bold text-[#1a2f2b]">BeGrateful</h1>
        <p className="text-base leading-6 text-[#3d4a41]">Nhật ký biết ơn hằng ngày</p>
      </div>
      <div className="rounded-[24px] bg-white p-6 shadow-[0_8px_30px_rgba(26,47,43,0.06)]">
        <form className="flex w-full flex-col gap-5" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
          {banner?.tone === "error" && view === "signin" ? (
            <div className="relative flex items-start gap-3 rounded-2xl border border-[#fbdcd0] bg-[#fff8f5] p-3.5 shadow-[0_4px_16px_rgba(217,119,87,0.06)]">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fde9df] text-[#d97757]"><Info className="h-[17px] w-[17px]" /></div>
              <div className="pr-5"><p className="text-[13px] font-semibold leading-5 text-[#8a422d]">{banner.title}</p><p className="mt-0.5 text-[12px] leading-[17px] text-[#9c5946]">{banner.body}</p></div>
              <button aria-label="Đóng" className="absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full text-[#b87664]" onClick={() => setBanner(null)} type="button"><X className="h-[15px] w-[15px]" /></button>
            </div>
          ) : null}
          {view === "signup" ? <div className="rounded-2xl bg-[#d1e9e0]/30 p-4"><p className="text-sm leading-5 font-semibold text-[#1a2f2b]">Các điều biết ơn bạn đã viết sẽ được lưu vào tài khoản mới</p></div> : null}
          {view === "signup" ? <AuthField id="display-name" label="Tên hiển thị" onChange={setDisplayName} placeholder="Tên bạn muốn mọi người thấy" value={displayName} disabled={!configured || loading} /> : null}
          <AuthField id="email" inputMode="email" label="Email" onChange={setEmail} placeholder="nhap@email.com" type="email" value={email} disabled={!configured || loading} />
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <label className="ml-1 text-xs leading-4 font-medium text-[#3d4a41]" htmlFor="password">Mật khẩu</label>
              {view === "signin" ? <button className="text-[13px] font-medium text-[#006d43] hover:underline" onClick={() => changeView("forgot")} type="button">Quên mật khẩu?</button> : null}
            </div>
            <div className="relative">
              <input className="min-h-12 w-full rounded-xl bg-[#dde4e1]/50 px-4 py-3 pr-12 text-base leading-6 text-[#1a2f2b] shadow-inner outline-none placeholder:text-[#bccabe] focus:bg-white focus:ring-2 focus:ring-[#006d43]/50 disabled:cursor-not-allowed disabled:opacity-60" id="password" minLength={8} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" type={showPassword ? "text" : "password"} value={password} disabled={!configured || loading} />
              <button aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} className="absolute top-1/2 right-3 flex min-h-11 w-11 -translate-y-1/2 items-center justify-center text-[#6d7a70] hover:text-[#006d43]" onClick={() => setShowPassword((current) => !current)} type="button">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
            </div>
            <p className="ml-1 text-[11px] leading-4 font-medium text-[#6d7a70]">Tối thiểu 8 ký tự</p>
          </div>
          <button className="mt-1 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#006d43] to-[#006d3d] px-6 py-3.5 text-sm leading-5 font-semibold text-white shadow-[0_8px_16px_rgba(0,109,67,0.15)] hover:shadow-[0_12px_24px_rgba(0,109,67,0.2)] disabled:opacity-50 disabled:shadow-none" disabled={!configured || loading || !email || !password || (view === "signup" && !displayName.trim())} type="submit"><span>{loading ? "Đang xử lý..." : view === "signup" ? "Tạo tài khoản" : "Đăng nhập"}</span>{loading ? <Loader2 className="h-[18px] w-[18px] animate-spin" /> : <ArrowRight className="h-[18px] w-[18px]" />}</button>
        </form>
        {banner?.tone === "success" && view === "signup" ? <p className="mt-4 break-words text-sm leading-6 text-[#3d4a41]" role="status">{banner.body}</p> : null}
        <button className="mx-auto mt-8 flex min-h-11 items-center justify-center gap-1 text-base leading-6 text-[#6d7a70] hover:text-[#006d43]" onClick={() => changeView(view === "signup" ? "signin" : "signup")} type="button">{view === "signup" ? "Đã có tài khoản?" : "Chưa có tài khoản?"}<span className="font-semibold text-[#006d43] underline-offset-4 hover:underline">{view === "signup" ? "Đăng nhập" : "Đăng ký"}</span></button>
      </div>
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
      <label className="ml-1 text-xs leading-4 font-medium text-[#3d4a41]" htmlFor={id}>{label}</label>
      <input className="min-h-12 w-full rounded-xl bg-[#dde4e1]/50 px-4 py-3 text-base leading-6 text-[#1a2f2b] shadow-inner outline-none placeholder:text-[#bccabe] focus:bg-white focus:ring-2 focus:ring-[#006d43]/50 disabled:cursor-not-allowed disabled:opacity-60" id={id} inputMode={inputMode} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} type={type} disabled={disabled} value={value} />
    </div>
  );
}
