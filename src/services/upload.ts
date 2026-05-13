import { api } from "@/lib/api";

export interface UploadResponse {
  url?: string;
  objectKey?: string;
  key?: string;
  [key: string]: unknown;
}

export async function uploadPropertyImage(propertyId: string, file: File) {
  const formData = new FormData();
  formData.set("file", file);

  return api.post<UploadResponse>(`/upload/property/${propertyId}/image`, formData);
}

export async function deletePropertyImage(objectKey: string) {
  return api.delete<{ message?: string }>(`/upload/property/image?objectKey=${encodeURIComponent(objectKey)}`);
}
