import { supabase } from '../lib/supabase';

// Base API configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// API service for backend calls
class ApiService {
  
  // Get auth token from Supabase session
  private async getAuthToken(): Promise<string | null> {
    console.log('🔐 Getting auth token...');
    const { data: { session }, error } = await supabase.auth.getSession();
    console.log('📱 Session:', session ? 'Found' : 'None', error ? `Error: ${error.message}` : '');
    if (error || !session?.access_token) {
      console.error('Failed to get auth token:', error);
      return null;
    }
    console.log('✅ Auth token obtained');
    return session.access_token;
  }

  // Generic API call method
  private async apiCall<T>(
    endpoint: string, 
    method: string = 'GET', 
    data?: any
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        return { success: false, error: 'Authentication required' };
      }

      const config: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      };

      if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.body = JSON.stringify(data);
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const result = await response.json();

      if (!response.ok) {
        return { 
          success: false, 
          error: result.error || `HTTP ${response.status}: ${response.statusText}` 
        };
      }

      return { success: true, data: result.data || result };

    } catch (error: any) {
      console.error('API call failed:', error);
      return { 
        success: false, 
        error: error.message || 'Network error occurred' 
      };
    }
  }

  // Transaction API methods
  async createTransaction(transactionData: {
    amount: number;
    category: string;
    date: Date;
    notes?: string;
    type?: 'income' | 'expense';
  }) {
    console.log('💰 Creating transaction:', transactionData);
    
    // Map frontend data to backend format
    const backendData = {
      type: transactionData.type || 'expense', // Default to expense
      amount: transactionData.amount,
      category: transactionData.category,
      description: transactionData.notes || '',
      date: transactionData.date.toISOString(),
    };

    console.log('📤 Sending to backend:', backendData);
    const result = await this.apiCall('/transactions', 'POST', backendData);
    console.log('📥 Backend response:', result);
    return result;
  }

  async getTransactions(filters?: {
    startDate?: string;
    endDate?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }) {
    const queryParams = new URLSearchParams();
    
    if (filters?.startDate) queryParams.append('startDate', filters.startDate);
    if (filters?.endDate) queryParams.append('endDate', filters.endDate);
    if (filters?.category) queryParams.append('category', filters.category);
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());
    if (filters?.offset) queryParams.append('offset', filters.offset.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/transactions?${queryString}` : '/transactions';
    
    return this.apiCall(endpoint);
  }

  async getTransactionSummary(filters?: {
    startDate?: string;
    endDate?: string;
  }) {
    const queryParams = new URLSearchParams();
    
    if (filters?.startDate) queryParams.append('startDate', filters.startDate);
    if (filters?.endDate) queryParams.append('endDate', filters.endDate);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/transactions/summary?${queryString}` : '/transactions/summary';
    
    return this.apiCall(endpoint);
  }

  // Account API methods
  async getAccounts() {
    return this.apiCall('/accounts');
  }

  // Goals API methods  
  async getGoals() {
    return this.apiCall('/goals');
  }

  // Dashboard API methods
  async getDashboardData() {
    return this.apiCall('/dashboard');
  }

  async getTransactionById(id: string) {
    console.log('📖 Getting transaction by ID:', id);
    const result = await this.apiCall(`/transactions/${id}`);
    console.log('📥 Transaction response:', result);
    return result;
  }

  async updateTransaction(id: string, updates: {
    amount?: number;
    category?: string;
    description?: string;
    date?: Date;
    type?: 'income' | 'expense';
  }) {
    console.log('✏️ Updating transaction:', id, updates);
    
    // Map frontend data to backend format
    const backendData: any = {};
    if (updates.amount !== undefined) backendData.amount = updates.amount;
    if (updates.category !== undefined) backendData.category = updates.category;
    if (updates.description !== undefined) backendData.description = updates.description;
    if (updates.date !== undefined) backendData.date = updates.date.toISOString();
    if (updates.type !== undefined) backendData.is_expense = updates.type === 'expense';

    console.log('📤 Sending update to backend:', backendData);
    const result = await this.apiCall(`/transactions/${id}`, 'PUT', backendData);
    console.log('📥 Update response:', result);
    return result;
  }

  async deleteTransaction(id: string) {
    console.log('🗑️ Deleting transaction:', id);
    const result = await this.apiCall(`/transactions/${id}`, 'DELETE');
    console.log('📥 Delete response:', result);
    return result;
  }

  // Categories API methods
  async getCategories() {
    return this.apiCall('/categories');
  }
}

export const apiService = new ApiService();
export default apiService;