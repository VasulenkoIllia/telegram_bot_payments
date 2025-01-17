import bcrypt from 'bcrypt';

export const cryptPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const cryptPasswordSync = (password: string): string => {
  return bcrypt.hashSync(password, 10);
};

export const confirmPassword = async (
  password: string,
  cryptedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, cryptedPassword);
};

export const confirmPasswordSync = (
  password: string,
  cryptedPassword: string,
): boolean => {
  return bcrypt.compareSync(password, cryptedPassword);
};
