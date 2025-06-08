import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
const backendUrl = 'http://localhost:3000/api/';
@Injectable({
  providedIn: 'root'
})

export class S3UploadService {
//   private s3: S3Client;

  constructor(private http: HttpClient) {
    
  }



async uploadToS3UsingPresignedUrl(file: File, userId: string, registrationId: string, documentType: string): Promise<string> {
  const { uploadUrl, publicUrl } = await this.http.post<any>(backendUrl + 'jlpt/upload/url', {
    userId,
    registrationId,
    documentType,
    fileName: file.name,
    mimeType: file.type
  }).toPromise();

  await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file
  });

  return publicUrl; // Final file URL on S3
}
}
