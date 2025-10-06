import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Creditor } from '../models/creditor.model';

export interface CreateCreditorRequest {
  name: string;
  document: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface UpdateCreditorRequest extends CreateCreditorRequest {
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class CreditorService {
  private apiService = inject(ApiService);

  getAll(): Observable<Creditor[]> {
    return this.apiService.get<Creditor[]>('/creditor');
  }

  getById(id: number): Observable<Creditor> {
    return this.apiService.get<Creditor>(`/creditor/${id}`);
  }

  create(creditor: CreateCreditorRequest): Observable<Creditor> {
    return this.apiService.post<Creditor>('/creditor', creditor);
  }

  update(creditor: UpdateCreditorRequest): Observable<Creditor> {
    return this.apiService.patch<Creditor>(`/creditor/${creditor.id}`, creditor);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`/creditor/${id}`);
  }
}