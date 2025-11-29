import { z } from 'zod';
import { buyTicketLinkSchema } from './blog';

// Event validation schemas
export const createEventSchema = z.object({
  date: z.coerce.date({
    required_error: 'Date is required',
    invalid_type_error: 'Date must be a valid date',
  }),
  title: z.string().min(1, 'Title is required').max(500, 'Title is too long'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description is too long'),
  venue: z.string().min(1, 'Venue is required').max(500, 'Venue is too long'),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Must be a valid time (HH:MM format)'),
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
  related_events: z.array(z.string().uuid('Invalid UUID')).default([]),
  buy_ticket_links: z.array(buyTicketLinkSchema).default([]),
});

export const updateEventSchema = createEventSchema.partial().extend({
  id: z.string().uuid('Invalid UUID'),
});

export const eventIdSchema = z.object({
  id: z.string().uuid('Invalid UUID'),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type BuyTicketLink = z.infer<typeof buyTicketLinkSchema>;

