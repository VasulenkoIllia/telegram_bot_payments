export const isPasswordExpired = (passwordExpirationDate: string): boolean => {
  return new Date(passwordExpirationDate) < new Date();
};
