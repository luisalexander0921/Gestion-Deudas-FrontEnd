import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Debt, CreateDebtRequest, FilterDebtRequest } from '../models/debt.model';

@Injectable({
  providedIn: 'root'
})
export class DebtService {

  constructor(private apiService: ApiService) {}

  // Crear deuda
  create(debtData: CreateDebtRequest): Observable<Debt> {
    return this.apiService.post<Debt>('/debt', debtData);
  }

  // Obtener todas las deudas
  getAll(): Observable<Debt[]> {
    return this.apiService.get<Debt[]>('/debt');
  }

  // Obtener deuda por ID
  getById(id: number): Observable<Debt> {
    return this.apiService.get<Debt>(`/debt/${id}`);
  }

  // Actualizar deuda
  update(id: number, debtData: Partial<CreateDebtRequest>): Observable<Debt> {
    return this.apiService.patch<Debt>(`/debt/${id}`, debtData);
  }

  // Eliminar deuda
  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`/debt/${id}`);
  }

  // Filtrar deudas
  filter(filterData: FilterDebtRequest): Observable<Debt[]> {
    return this.apiService.post<Debt[]>('/debt/filter', filterData);
  }

  // Obtener deudas por usuario
  getByUser(userId: number): Observable<Debt[]> {
    return this.apiService.get<Debt[]>(`/debt/user/${userId}`);
  }

  // Obtener deudas pendientes por usuario
  getPendingByUser(userId: number): Observable<Debt[]> {
    return this.apiService.get<Debt[]>(`/debt/user/${userId}/pending`);
  }

  // Obtener deudas pagadas por usuario
  getPaidByUser(userId: number): Observable<Debt[]> {
    return this.apiService.get<Debt[]>(`/debt/user/${userId}/paid`);
  }

  // Marcar deuda como pagada
  markAsPaid(id: number): Observable<Debt> {
    return this.apiService.patch<Debt>(`/debt/${id}/mark-paid`, {});
  }
}