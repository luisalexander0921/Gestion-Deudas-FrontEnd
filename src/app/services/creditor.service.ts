import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Creditor, CreateCreditorRequest, FilterCreditorRequest } from '../models/creditor.model';

@Injectable({
  providedIn: 'root'
})
export class CreditorService {

  constructor(private apiService: ApiService) {}

  // Crear acreedor
  create(creditorData: CreateCreditorRequest): Observable<Creditor> {
    return this.apiService.post<Creditor>('/creditor', creditorData);
  }

  // Obtener todos los acreedores
  getAll(): Observable<Creditor[]> {
    return this.apiService.get<Creditor[]>('/creditor');
  }

  // Obtener acreedor por ID
  getById(id: number): Observable<Creditor> {
    return this.apiService.get<Creditor>(`/creditor/${id}`);
  }

  // Actualizar acreedor
  update(id: number, creditorData: Partial<CreateCreditorRequest>): Observable<Creditor> {
    return this.apiService.patch<Creditor>(`/creditor/${id}`, creditorData);
  }

  // Eliminar acreedor
  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`/creditor/${id}`);
  }

  // Filtrar acreedores
  filter(filterData: FilterCreditorRequest): Observable<Creditor[]> {
    return this.apiService.post<Creditor[]>('/creditor/filter', filterData);
  }

  // Obtener acreedores por usuario
  getByUser(userId: number): Observable<Creditor[]> {
    return this.apiService.get<Creditor[]>(`/creditor/user/${userId}`);
  }
}