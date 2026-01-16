
export type TransactionType = 'INCOME' | 'EXPENSE';
export type UserRole = 'admin' | 'user';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  categoryId: string;
  type: TransactionType;
}

export interface EnergyBill {
  id: string;
  monthYear: string;
  kwh: number;
  cpflTotal: number;
  serenaTotal: number;
  discountApplied: boolean;
}

export interface UserProfile {
  email: string;
  name: string;
  theme: 'light' | 'dark';
  role: UserRole;
}

export interface UserAccount extends UserProfile {
  password?: string;
}
