import { IJwtPayload } from "./jwt-payload.interface";
import { Request } from "express";

export interface IAuthorizedRequest extends Request {
  user: IJwtPayload;
}
