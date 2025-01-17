import { ArgumentsHost } from "@nestjs/common";

export const isWs = (host: ArgumentsHost): boolean => {
  return host.getType() == "ws";
};
