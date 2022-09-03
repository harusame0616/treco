import { uuidv4 } from '@firebase/util';

export const generateId = () => {
  return uuidv4();
};

export const isId = (value: string) =>
  /([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})/.test(
    value
  );

export const isUserId = (value: string) => value.length == 28;
