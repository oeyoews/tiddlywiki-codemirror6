import { ITriggerTypeChar } from '@/cm6/modules/constants/triggerType';

export const isTrigger = (str: string, triggerType: ITriggerTypeChar) => {
  return str.startsWith(triggerType);
};
