import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  UploadResult,
} from 'firebase/storage';
import { storage } from './firebase';

/**
 * Uploads a file/blob to Firebase Storage and returns its public download URL.
 * @param path Storage destination path (e.g. 'avatars/user123.jpg' or 'uploads/doc.pdf')
 * @param file File or Blob to upload
 */
export async function uploadFile(
  path: string,
  file: File | Blob,
  metadata?: { contentType?: string }
): Promise<{ downloadUrl: string; snapshot: UploadResult }> {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file, metadata);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  return { downloadUrl, snapshot };
}

/**
 * Retrieves the public download URL of an existing file in Firebase Storage.
 * @param path Storage file path
 */
export async function getFileDownloadUrl(path: string): Promise<string> {
  const storageRef = ref(storage, path);
  return await getDownloadURL(storageRef);
}

/**
 * Deletes a file from Firebase Storage.
 * @param path Storage file path
 */
export async function deleteStorageFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}
