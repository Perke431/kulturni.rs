import { z } from 'zod';

// Schema for buy ticket link structure (used in events)
export const buyTicketLinkSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  url: z.string().url('Must be a valid URL'),
});

// Blog validation schemas
export const createBlogSchema = z.object({
  date: z.coerce.date({
    required_error: 'Date is required',
    invalid_type_error: 'Date must be a valid date',
  }),
  title: z.string().min(1, 'Title is required').max(500, 'Title is too long'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description is too long'),
  read_time: z.number().int().positive('Read time must be a positive integer'),
  content: z.string().min(1, 'Content is required'),
  image_url: z.string().optional().refine(
    (val) => {
      if (!val || val === '') return true;
      // Allow relative paths starting with /
      if (val.startsWith('/')) return true;
      // Allow full URLs
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: 'Must be a valid URL or a relative path starting with /' }
  ),
  related_blogs: z.array(z.string().uuid('Invalid UUID')).default([]),
});

export const updateBlogSchema = createBlogSchema.partial().extend({
  id: z.string().uuid('Invalid UUID'),
});

export const blogIdSchema = z.object({
  id: z.string().uuid('Invalid UUID'),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;

