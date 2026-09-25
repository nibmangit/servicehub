// src/utils/validators.js

export const validatePassword = (password) => {
  return {
    minLength: password.length >= 6,
    hasLetter: /[a-zA-Z]/.test(password),
    hasNumber: /\d/.test(password),
  };
};

export const isPasswordValid = (password) => {
  const checks = validatePassword(password);
  return Object.values(checks).every(Boolean);
};