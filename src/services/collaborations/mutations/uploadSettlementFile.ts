
import { supabase } from '@/lib/supabase';
import { CollaborationStatus } from '../types';

/**
 * Uploads settlement file for a collaboration and updates collaboration status
 * 
 * @param id - Collaboration ID
 * @param file - Settlement file (PDF)
 * @returns Promise with updated collaboration
 */
export const uploadSettlementFile = async (id: string, file: File) => {
  try {
    if (!file || file.type !== 'application/pdf') {
      throw new Error('Plik musi być w formacie PDF');
    }

    // Upload file to storage
    const fileName = `${id}/${Date.now()}-rozliczenie.pdf`;
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('settlements')
      .upload(fileName, file, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (uploadError) {
      console.error('Error uploading settlement file:', uploadError);
      throw new Error('Nie udało się przesłać pliku. Spróbuj ponownie.');
    }

    // Get public URL for the uploaded file
    const { data: publicURLData } = await supabase
      .storage
      .from('settlements')
      .getPublicUrl(uploadData.path);

    const publicURL = publicURLData?.publicUrl;

    // Update collaboration with file URL and change status to settlement
    const { data, error } = await supabase
      .from('collaborations')
      .update({ 
        settlement_file: publicURL,
        status: 'settlement' as CollaborationStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating collaboration with settlement file:', error);
      throw new Error('Nie udało się zaktualizować danych rozliczenia');
    }

    return data;
  } catch (error) {
    console.error('Failed to upload settlement file:', error);
    throw error;
  }
};
