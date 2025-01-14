import { z } from 'zod';

export const createUrlSchema = z.object({
  originalUrl: z.string().url({ message: 'Invalid URL format' }),
});
