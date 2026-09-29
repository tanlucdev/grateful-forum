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
    displayName: "displayNameRequired",
    email: "emailRequired",
    password: "passwordRequired",
  },
);

assert.deepEqual(
  validateAuthInput({
    displayName: "Luc",
    email: "luc@example.com",
    password: "1234567",
    signingUp: true,
  }),
  { password: "passwordShort" },
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
