import { Context } from 'telegraf';

interface MySessionData {
  profileStep: string;
  profile: {
    fullName: string;
    city: string;
    phone: string;
  };
  subscription?: string;
  paymentMethod?: string;
}

export interface MyContext extends Context {
  session: MySessionData;
}
