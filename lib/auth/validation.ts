export type AuthFieldErrors = {
  displayName?: string;
  email?: string;
  password?: string;
};

export function validateAuthInput({
  displayName,
  email,
  password,
  signingUp,
}: {
  displayName: string;
  email: string;
  password: string;
  signingUp: boolean;
}) {
  const errors: AuthFieldErrors = {};

  if (signingUp && !displayName.trim()) {
    errors.displayName = "Nhập tên hiển thị để tạo tài khoản.";
  }

  if (!email.trim()) {
    errors.email = "Nhập email để tiếp tục.";
  }

  if (!password) {
    errors.password = "Nhập mật khẩu để tiếp tục.";
  } else if (password.length < 8) {
    errors.password = "Mật khẩu cần có ít nhất 8 ký tự.";
  }

  return errors;
}

export function hasAuthErrors(errors: AuthFieldErrors) {
  return Boolean(errors.displayName || errors.email || errors.password);
}
