import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, switchMap } from 'rxjs';
const backendUrl = 'http://13.203.168.84:3000/api/';
@Injectable({
  providedIn: 'root'
})

export class S3UploadService {
//   private s3: S3Client;

  constructor(private http: HttpClient) {
    
  }



  presignedUrlToFile(presignedUrl: string, fileName?: string): Observable<File> {
    return this.http.get(presignedUrl, { responseType: 'blob' }).pipe(
      switchMap(blob => {
        // Extract filename from URL if not provided
        const finalFileName = fileName || this.extractFileNameFromUrl(presignedUrl);
        
        // Create File object from Blob
        const file = new File([blob], finalFileName, {
          type: blob.type || 'application/octet-stream'
        });
        
        return of(file);
      })
    );
  }

  private extractFileNameFromUrl(url: string): string {
    try {
      // Handle both regular and presigned URLs
      const path = new URL(url).pathname.split('?')[0];
      return path.split('/').pop() || 'download';
    } catch {
      return 'download';
    }
  }

  getPresignedURL(id: string): Observable<any> {
      const accessToken = localStorage.getItem('authToken') || '';
      const headers = new HttpHeaders({
        'Cache-Control': 'no-store',
        Pragma: 'no-cache',
      }).set('token', accessToken);
      const params = new HttpParams().set('id', id);
  
      return this.http.get<any>(backendUrl + 'jlpt/download/' + id, { headers, params });
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
