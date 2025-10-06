export interface Creditor {
  id: number;
  name: string;
  document: string;
  email?: string;
  phone?: string;
  address?: string;
  recordStatus: 'ACTIVE' | 'INACTIVE';
  createdBy?: string;
  userId?: number;
  createdAt: Date;
  updatedAt: Date;
  user?: any;
  debts?: any[];
}

export interface CreateCreditorRequest {
  name: string;
  document: string;
  email?: string;
  phone?: string;
  address?: string;
  createdBy?: string;
  userId?: number;
}

export interface FilterCreditorRequest {
  name?: string;
  document?: string;
  email?: string;
}