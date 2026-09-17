"use client";

import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Heart,
  Info,
  Leaf,
  Loader2,
  Mail,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { normalizeAuthErrorMessage } from "@/lib/auth/errors";
import {
  type AuthFieldErrors,
  hasAuthErrors,
  validateAuthInput,
} from "@/lib/auth/validation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type View = "signin" | "signup" | "forgot";
type Banner = { tone: "error" | "success"; title: string; body: string };

export function AuthPanelClient({
  configured,
  returnTo,
}: Readonly<{ configured: boolean; returnTo: string }>) {
  const router = useRouter();
  const [view, setView] = useState<View>("signin");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [banner, setBanner] = useState<Banner | null>(null);
  const supabase = useMemo(() => (configured ? createSupabaseBrowserClient() : null), [configured]);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace(returnTo);
    });
  }, [returnTo, router, supabase]);

  function clearFieldError(field: keyof AuthFieldErrors) {
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  }

  function changeView(next: View) {
    setView(next);
    setBanner(null);
    setFieldErrors({});
    setResetSent(false);
  }

  async function createAccount(cleanEmail: string) {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        displayName: displayName.trim(),
        email: cleanEmail,
        password,
      }),
      headers: { "content-type": "application/json" },
      credentials: "same-origin",
    });

    if (response.ok) return null;

    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    return normalizeAuthErrorMessage(body?.error ?? "Không thể tạo tài khoản.");
  }

  async function migrateGuestDataAfterLogin(accessToken: string) {
    const response = await fetch("/api/auth/migrate-guest", {
      method: "POST",
      headers: { authorization: `Bearer ${accessToken}` },
      credentials: "same-origin",
    });

    if (response.ok) return;

    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Đăng nhập thành công, nhưng chưa thể chuyển dữ liệu khách.");
  }

  async function submitAuth() {
    if (!supabase) return;

    if (view !== "forgot") {
      const errors = validateAuthInput({
        displayName,
        email,
        password,
        signingUp: view === "signup",
      });
      setFieldErrors(errors);
      setBanner(null);
      if (hasAuthErrors(errors)) return;
    }

    setLoading(true);
    setBanner(null);

    try {
      const cleanEmail = email.trim();
      const redirect = new URL("/auth/callback", window.location.origin);
      redirect.searchParams.set("next", returnTo);

      if (view === "forgot") {
        if (!cleanEmail) return;
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, { redirectTo: redirect.toString() });
        if (error) {
          setBanner({
            tone: "error",
            title: "Không gửi được liên kết",
            body: normalizeAuthErrorMessage(error.message),
          });
          return;
        }
        setResetSent(true);
        return;
      }

      if (view === "signup") {
        const createError = await createAccount(cleanEmail);
        if (createError) {
          setBanner({ tone: "error", title: "Không thể tạo tài khoản", body: createError });
          return;
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        setBanner({
          tone: "error",
          title: view === "signin" ? "Tài khoản hoặc mật khẩu chưa khớp" : "Không thể tạo tài khoản",
          body: normalizeAuthErrorMessage(error.message),
        });
        return;
      }

      if (!data.session) {
        setBanner({
          tone: "error",
          title: "Không thể đồng bộ phiên",
          body: "Đăng nhập xong nhưng chưa lấy được phiên để chuyển dữ liệu khách.",
        });
        return;
      }

      await migrateGuestDataAfterLogin(data.session.access_token);
      toast.success(view === "signup" ? "Tạo tài khoản thành công." : "Đăng nhập thành công.");
      router.replace(returnTo);
      router.refresh();
    } catch (error) {
      setBanner({
        tone: "error",
        title: "Không thể xử lý đăng nhập",
        body:
          error instanceof Error
            ? error.message
            : "Đăng nhập thành công, nhưng chưa thể chuyển dữ liệu khách.",
      });
    } finally {
      setLoading(false);
    }
  }

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
        setEmail={(value) => {
          setEmail(value);
          clearFieldError("email");
        }}
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
      fieldErrors={fieldErrors}
      loading={loading}
      onClearFieldError={clearFieldError}
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
        <Button aria-label="Quay lại" className="rounded-full bg-card/80 text-primary shadow-sm" onClick={() => changeView("signin")} size="icon" type="button" variant="outline">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-card/70 px-3 py-1 text-[11px] font-semibold text-muted-foreground shadow-sm backdrop-blur">
          <Heart className="h-3.5 w-3.5 fill-current text-primary" /> Grateful Forum Care
        </div>
        <span className="h-10 w-10" />
      </div>
      <div className="rounded-[28px] bg-card p-6 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3 flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 scale-105 rounded-full bg-accent/40" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-muted shadow-inner">
              <Leaf className="h-10 w-10 text-primary" fill="currentColor" />
            </div>
            <div className="absolute top-0 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-primary shadow-sm">
              <Info className="h-3 w-3" />
            </div>
          </div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-foreground">Grateful Forum</p>
          <h1 className="mt-1 text-[24px] leading-8 font-bold text-foreground">Quên mật khẩu?</h1>
          <p className="mt-2 text-[16px] leading-6 text-muted-foreground">Đừng lo lắng, hãy nhập email đã đăng ký. Grateful Forum sẽ gửi đến bạn liên kết an toàn để đặt lại mật khẩu mới nhé.</p>
        </div>
        <form className="mt-6 flex flex-col gap-4" noValidate onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
          <AuthField id="recovery-email" inputMode="email" label="Địa chỉ Email của bạn" onChange={setEmail} placeholder="tam.an.yen@email.com" type="email" value={email} disabled={!configured || loading} />
          <div className="rounded-xl bg-accent/30 p-3"><p className="text-[11px] leading-4 font-medium text-muted-foreground">Liên kết chỉ có hiệu lực trong vòng 15 phút và Grateful Forum không bao giờ yêu cầu mã OTP qua điện thoại.</p></div>
          <Button className="mt-1 w-full shadow-sm disabled:shadow-none" disabled={!configured || loading || !email} size="lg" type="submit">
            <span>{loading ? "Đang chuẩn bị thư..." : "Gửi liên kết khôi phục"}</span>
            {loading ? <Loader2 className="h-[18px] w-[18px] animate-spin" /> : <ArrowRight className="h-[18px] w-[18px]" />}
          </Button>
        </form>
        {resetSent ? (
          <div className="mt-4 rounded-xl bg-accent/40 p-3.5 text-center">
            <div className="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-primary"><Mail className="h-[18px] w-[18px]" /></div>
            <p className="text-[12px] font-semibold text-primary">Đã gửi thư khôi phục!</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">Vui lòng kiểm tra hòm thư đến của bạn nhé.</p>
          </div>
        ) : null}
        {banner?.tone === "error" ? <p className="mt-4 text-sm text-destructive">{banner.body}</p> : null}
        <div className="mt-5 rounded-xl bg-muted/70 p-3 text-center"><p className="text-[11px] leading-4 text-muted-foreground">Chưa thấy email? Vui lòng kiểm tra hộp thư rác (Spam) hoặc thử lại sau vài phút nhé.</p></div>
        <div className="mt-5 text-center"><p className="text-[12px] leading-4 text-muted-foreground">Nhớ ra mật khẩu rồi?<button className="ml-1 font-semibold text-primary hover:underline" onClick={() => changeView("signin")} type="button">Đăng nhập ngay</button></p></div>
        <div className="mt-6 flex justify-center"><div className="h-1 w-24 rounded-full bg-input" /></div>
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
  fieldErrors,
  loading,
  onClearFieldError,
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
  fieldErrors: AuthFieldErrors;
  loading: boolean;
  onClearFieldError: (field: keyof AuthFieldErrors) => void;
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
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"><Leaf className="h-7 w-7" fill="currentColor" strokeWidth={1.5} /></div>
        <h1 className="mb-2 text-[28px] leading-9 font-bold text-foreground">Grateful Forum</h1>
        <p className="text-base leading-6 text-muted-foreground">Nhật ký biết ơn hằng ngày</p>
      </div>
      <div className="rounded-[24px] bg-card p-6 shadow-sm">
        <form className="flex w-full flex-col gap-5" noValidate onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
          {banner?.tone === "error" ? (
            <div className="relative flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-3.5 shadow-sm">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive"><Info className="h-[17px] w-[17px]" /></div>
              <div className="pr-5"><p className="text-[13px] font-semibold leading-5 text-destructive">{banner.title}</p><p className="mt-0.5 text-[12px] leading-[17px] text-destructive/80">{banner.body}</p></div>
              <button aria-label="Đóng" className="absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full text-destructive/70" onClick={() => setBanner(null)} type="button"><X className="h-[15px] w-[15px]" /></button>
            </div>
          ) : null}
          {view === "signup" ? <div className="rounded-2xl bg-accent/30 p-4"><p className="text-sm leading-5 font-semibold text-foreground">Các điều biết ơn bạn đã viết sẽ được lưu vào tài khoản mới</p></div> : null}
          {view === "signup" ? (
            <AuthField
              id="display-name"
              label="Tên hiển thị"
              onChange={(value) => {
                setDisplayName(value);
                onClearFieldError("displayName");
              }}
              placeholder="Tên bạn muốn mọi người thấy"
              value={displayName}
              disabled={!configured || loading}
              error={fieldErrors.displayName}
            />
          ) : null}
          <AuthField
            id="email"
            inputMode="email"
            label="Email"
            onChange={(value) => {
              setEmail(value);
              onClearFieldError("email");
            }}
            placeholder="nhap@email.com"
            type="email"
            value={email}
            disabled={!configured || loading}
            error={fieldErrors.email}
          />
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <Label className="ml-1 text-xs leading-4 text-muted-foreground" htmlFor="password">Mật khẩu</Label>
              {view === "signin" ? <button className="text-[13px] font-medium text-primary hover:underline" onClick={() => changeView("forgot")} type="button">Quên mật khẩu?</button> : null}
            </div>
            <div className="relative">
              <Input
                aria-describedby={fieldErrors.password ? "password-help password-error" : "password-help"}
                aria-invalid={Boolean(fieldErrors.password)}
                className="h-12 rounded-xl bg-input/50 px-4 py-3 pr-12 text-base leading-6 text-foreground shadow-inner focus-visible:bg-card"
                id="password"
                onChange={(event) => {
                  setPassword(event.target.value);
                  onClearFieldError("password");
                }}
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={password}
                disabled={!configured || loading}
              />
              <button aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} className="absolute top-1/2 right-3 flex min-h-11 w-11 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-primary" onClick={() => setShowPassword((current) => !current)} type="button">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
            </div>
            <p className="ml-1 text-[11px] leading-4 font-medium text-muted-foreground" id="password-help">Tối thiểu 8 ký tự</p>
            {fieldErrors.password ? <p className="ml-1 text-sm leading-5 font-semibold text-destructive" id="password-error" role="alert">{fieldErrors.password}</p> : null}
          </div>
          <Button className="mt-1 w-full shadow-sm hover:shadow-sm disabled:shadow-none" disabled={!configured || loading} size="lg" type="submit"><span>{loading ? "Đang xử lý..." : view === "signup" ? "Tạo tài khoản" : "Đăng nhập"}</span>{loading ? <Loader2 className="h-[18px] w-[18px] animate-spin" /> : <ArrowRight className="h-[18px] w-[18px]" />}</Button>
        </form>
        <button className="mx-auto mt-8 flex min-h-11 items-center justify-center gap-1 text-base leading-6 text-muted-foreground hover:text-primary" onClick={() => changeView(view === "signup" ? "signin" : "signup")} type="button">{view === "signup" ? "Đã có tài khoản?" : "Chưa có tài khoản?"}<span className="font-semibold text-primary underline-offset-4 hover:underline">{view === "signup" ? "Đăng nhập" : "Đăng ký"}</span></button>
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
  error,
  value,
}: Readonly<{
  id: string;
  inputMode?: "email";
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: "email" | "text";
  disabled?: boolean;
  error?: string;
  value: string;
}>) {
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-2">
      <Label className="ml-1 text-xs leading-4 text-muted-foreground" htmlFor={id}>{label}</Label>
      <Input
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        className="h-12 rounded-xl bg-input/50 px-4 py-3 text-base leading-6 text-foreground shadow-inner focus-visible:bg-card"
        id={id}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        value={value}
      />
      {error ? <p className="ml-1 text-sm leading-5 font-semibold text-destructive" id={errorId} role="alert">{error}</p> : null}
    </div>
  );
}
