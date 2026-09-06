import assert from "node:assert/strict";
import { hasAuthErrors, validateAuthInput } from "../lib/auth/validation.ts";

assert.deepEqual(
  validateAuthInput({
    displayName: "",
    email: "",
    password: "",
    signingUp: true,
  }),
  {
    displayName: "Nhập tên hiển thị để tạo tài khoản.",
    email: "Nhập email để tiếp tục.",
    password: "Nhập mật khẩu để tiếp tục.",
  },
);

assert.deepEqual(
  validateAuthInput({
    displayName: "Luc",
    email: "luc@example.com",
    password: "1234567",
    signingUp: true,
  }),
  { password: "Mật khẩu cần có ít nhất 8 ký tự." },
);

assert.equal(
  hasAuthErrors(
    validateAuthInput({
      displayName: "",
      email: "luc@example.com",
      password: "12345678",
      signingUp: false,
    }),
  ),
  false,
);

console.log("auth validation checks passed");
