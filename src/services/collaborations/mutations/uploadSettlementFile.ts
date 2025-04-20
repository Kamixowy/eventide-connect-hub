
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads settlement file and updates collaboration status
 * 
 * @param id - Collaboration ID
 * @param file - Settlement PDF file
 * @returns Promise with updated collaboration
 */
export const uploadSettlementFile = async (id: string, file: File) => {
  try {
    // Check if settlements bucket exists, create if not
    const { data: buckets } = await supabase.storage.listBuckets();
    
    if (!buckets?.find(bucket => bucket.name === 'settlements')) {
      const { error: bucketError } = await supabase.storage.createBucket('settlements', {
        public: false
      });
      
      if (bucketError) {
        console.error('Error creating settlements bucket:', bucketError);
        throw bucketError;
      }
    }
    
    // Upload file to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${id}/${uuidv4()}.${fileExt}`;
    
    const { error: uploadError, data } = await supabase.storage
      .from('settlements')
      .upload(fileName, file);
      
    if (uploadError) {
      console.error('Error uploading settlement file:', uploadError);
      throw uploadError;
    }
    
    // Get public URL
    const filePath = data?.path;
    
    // Update collaboration with file path and settlement status
    const { error: updateError } = await supabase
      .from('collaborations')
      .update({ 
        status: 'settlement',
        settlement_file: filePath,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
      
    if (updateError) {
      console.error('Error updating collaboration status:', updateError);
      throw updateError;
    }
    
    return { success: true, filePath };
  } catch (error) {
    console.error('Failed to upload settlement file:', error);
    throw error;
  }
};
