import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import {
  AiStatusResponse,
  GenerateDesignRequest,
  GenerateDesignResponse,
  RetryDesignResponse,
} from '../utils/ai-interface';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private readonly BASE_URL = 'http://localhost:3000/api/ai';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
  ) {}

  /**
   * Get authentication headers with Bearer token
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.cookieService.get('jwt_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Check if AI model is loaded and ready
   */
  checkAiStatus(): Observable<AiStatusResponse> {
    return this.http.get<AiStatusResponse>(`${this.BASE_URL}/status`, {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * Generate a design based on user prompt
   */
  generateDesign(request: GenerateDesignRequest): Observable<GenerateDesignResponse> {
    return this.http.post<GenerateDesignResponse>(`${this.BASE_URL}/generate-design`, request, {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * Retry a failed design generation
   */
  retryDesign(designId: string): Observable<RetryDesignResponse> {
    return this.http.post<RetryDesignResponse>(
      `${this.BASE_URL}/designs/${designId}/retry`,
      {},
      {
        headers: this.getAuthHeaders(),
      },
    );
  }
}
