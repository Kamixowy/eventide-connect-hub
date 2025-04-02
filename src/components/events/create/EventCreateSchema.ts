
import { z } from 'zod';

// Form validation schema
export const eventCreateSchema = z.object({
  title: z.string().min(3, { message: 'Tytuł musi mieć co najmniej 3 znaki' }),
  description: z.string().min(10, { message: 'Opis musi mieć co najmniej 10 znaków' }),
  start_date: z.date({ required_error: 'Data rozpoczęcia jest wymagana' }),
  end_date: z.date().optional(),
  city: z.string().min(1, { message: 'Miasto jest wymagane' }),
  voivodeship: z.string().min(1, { message: 'Województwo jest wymagane' }),
  detailed_location: z.string().optional(),
  expected_participants: z.string().optional(),
  category: z.string().min(1, { message: 'Kategoria jest wymagana' }),
  audience: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
});

// Type for form values
export type EventCreateValues = z.infer<typeof eventCreateSchema>;

// Type for sponsorship option
export type SponsorshipOption = {
  id: string;
  title: string;
  description: string;
  priceFrom: string;
  priceTo: string;
  benefits: string[];
};
