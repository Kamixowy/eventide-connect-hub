import { supabase } from '@/lib/supabase';
import { CollaborationStatus } from '../types';

export const uploadSettlementFile = async (
  collaborationId: string, 
  file: File
) => {
  // Create a unique file name
  const timestamp = new Date().getTime();
  const random = Math.random().toString(36).substring(2, 15);
  const fileName = `${timestamp}-${random}-${file.name}`;

  // Define the path for the file in Supabase storage
  const uniquePath = `${collaborationId}/${fileName}`;

  // Upload file to supabase storage
  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('settlements')
    .upload(uniquePath, file);

  if (uploadError) {
    throw uploadError;
  }

  // Get the public URL of the uploaded file
  const { data: fileData } = supabase
    .storage
    .from('settlements')
    .getPublicUrl(uniquePath);

  const fileUrl = fileData.publicUrl;

  // Update collaboration to mark as settlement
  const { error: updateError } = await supabase
    .from('collaborations')
    .update({ 
      status: 'settlement' as CollaborationStatus,
      settlement_file: fileUrl
    })
    .eq('id', collaborationId);

  if (updateError) {
    throw updateError;
  }

  return { success: true, fileUrl };
};
