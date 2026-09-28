export type AuthFieldErrors = {
  displayName?: "displayNameRequired";
  email?: "emailRequired";
  password?: "passwordRequired" | "passwordShort";
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
    errors.displayName = "displayNameRequired";
  }

  if (!email.trim()) {
    errors.email = "emailRequired";
  }

  if (!password) {
    errors.password = "passwordRequired";
  } else if (password.length < 8) {
    errors.password = "passwordShort";
  }

  return errors;
}

export function hasAuthErrors(errors: AuthFieldErrors) {
  return Boolean(errors.displayName || errors.email || errors.password);
}
