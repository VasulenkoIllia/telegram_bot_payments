import { Context } from 'telegraf';

interface MySessionData {
  subscription?: string;
  paymentMethod?: string;
}

export interface MyContext extends Context {
  session: MySessionData;
}
