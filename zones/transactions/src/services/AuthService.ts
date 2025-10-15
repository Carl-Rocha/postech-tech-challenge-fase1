const API_URL = '/api';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  result: {
    token: string;
  };
}

export interface UserResponse {
  message: string;
  result: User;
}

export class AuthService {
  private static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  static async register(userData: {
    username: string;
    email: string;
    password: string;
  }): Promise<UserResponse> {
    const response = await fetch(`${API_URL}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar usuário');
    }

    return response.json();
  }

  static async login(credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/user/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao fazer login');
    }

    const data = await response.json();
    if (data.result?.token) {
      localStorage.setItem('authToken', data.result.token);
    }

    return data;
  }

  static async getAccount(): Promise<any> {
    const response = await fetch(`${API_URL}/account`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao buscar conta');
    }

    return response.json();
  }

  static async getStatement(accountId: string): Promise<any> {
    const response = await fetch(`${API_URL}/account/${accountId}/statement`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao buscar extrato');
    }

    return response.json();
  }

  static logout(): void {
    localStorage.removeItem('authToken');
  }

  static isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  static getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}

