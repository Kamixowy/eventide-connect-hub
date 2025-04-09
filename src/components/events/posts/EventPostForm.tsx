
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { addEventPost } from '@/services/events/postService';

interface EventPostFormProps {
  eventId: string;
  onSuccess: () => void;
}

interface PostFormValues {
  title: string;
  content: string;
}

const EventPostForm: React.FC<EventPostFormProps> = ({ eventId, onSuccess }) => {
  const { toast } = useToast();
  const form = useForm<PostFormValues>({
    defaultValues: {
      title: '',
      content: ''
    }
  });
  
  const onSubmit = async (data: PostFormValues) => {
    try {
      await addEventPost(eventId, data.title, data.content);
      form.reset();
      toast({
        title: "Post dodany",
        description: "Twój post został pomyślnie dodany do wydarzenia.",
      });
      onSuccess();
    } catch (error) {
      console.error("Error adding post:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się dodać postu. Spróbuj ponownie.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tytuł</FormLabel>
              <FormControl>
                <Input placeholder="Wpisz tytuł postu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Treść</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Wpisz treść postu" 
                  className="min-h-[150px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">
          Dodaj post
        </Button>
      </form>
    </Form>
  );
};

export default EventPostForm;
