
import { z } from 'zod';

// Form validation schema
export const eventFormSchema = z.object({
  title: z.string().min(3, { message: 'Tytuł musi mieć co najmniej 3 znaki' }),
  description: z.string().min(10, { message: 'Opis musi mieć co najmniej 10 znaków' }),
  start_date: z.date({ required_error: 'Data rozpoczęcia jest wymagana' }),
  end_date: z.date().optional(),
  location: z.string().optional(),
  detailed_location: z.string().optional(),
  expected_participants: z.string().optional(),
  category: z.string().optional(),
  audience: z.string().optional(),
  tags: z.string().optional(),
  image_url: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  status: z.string().optional().default("Planowane"),
});

// Type for form values
export type EventFormValues = z.infer<typeof eventFormSchema>;

// Type for social media object
export type SocialMedia = {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  [key: string]: string | undefined;
};

// Type for sponsorship option
export type SponsorshipOption = {
  id: string;
  title: string;
  description: string;
  priceFrom: string;
  priceTo: string;
  benefits: string[];
};

// Define status options that can be used in multiple components
export const statusOptions = [
  "Planowane",
  "W przygotowaniu",
  "W trakcie",
  "Zakończone",
  "Anulowane"
];
