import { ModelIdentifier } from "@automapper/core";

const AnonymousClass = class {};

export const createModelIdentifierByType = <T>(): ModelIdentifier<T> => {
  return AnonymousClass as ModelIdentifier<T>;
};
