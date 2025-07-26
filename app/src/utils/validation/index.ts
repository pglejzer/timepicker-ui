export const sanitizeTimeInput = (input: string): string => {
  return input.replace(/[^0-9:APMapm\s]/g, '');
};

