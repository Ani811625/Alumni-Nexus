
import { supabase } from "./client";

/**
 * Uploads a file to the Supabase storage bucket
 * @param bucket The name of the bucket to upload to
 * @param path The path where the file should be stored
 * @param file The file to upload
 */
export async function uploadFile(bucket: string, path: string, file: File) {
  try {
    // Check if bucket exists
    const { data: bucketData, error: bucketError } = await supabase
      .storage.getBucket(bucket);
      
    if (bucketError && bucketError.message.includes('does not exist')) {
      console.log(`Creating ${bucket} bucket`);
      await supabase.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: 1024 * 1024 * 5 // 5MB
      });
    }
    
    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: true, // Overwrite if exists
      });
      
    if (error) throw error;
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
      
    return {
      success: true,
      path: data?.path,
      publicUrl: publicUrlData?.publicUrl
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      success: false,
      error
    };
  }
}

/**
 * Deletes a file from Supabase storage
 * @param bucket The bucket name
 * @param path The path to the file
 */
export async function deleteFile(bucket: string, path: string) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([path]);
      
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error deleting file:", error);
    return {
      success: false,
      error
    };
  }
}
