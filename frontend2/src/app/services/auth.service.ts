import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { Observable, tap } from "rxjs";

export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  password?: string;
  telefono?: string;
  direccion?: string;
  activo?: boolean;
  fechaRegistro?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
  direccion?: string;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = "http://localhost:8080/api/clientes";
  private readonly storageKey = "trendstore_cliente";

  readonly currentClient = signal<Cliente | null>(this.getStoredClient());

  login(request: LoginRequest): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiUrl}/login`, request).pipe(
      tap((client) => this.setClient(client)),
    );
  }

  register(request: RegisterRequest): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, request).pipe(
      tap((client) => this.setClient(client)),
    );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.currentClient.set(null);
  }

  getClientId(): number | null {
    return this.currentClient()?.id ?? null;
  }

  updateProfile(clientId: number, data: Cliente): Observable<Cliente> {
  return this.http.put<Cliente>(`${this.apiUrl}/${clientId}`, data).pipe(
    tap((client) => this.setClient(client)),
  );
}

  private setClient(client: Cliente): void {
    localStorage.setItem(this.storageKey, JSON.stringify(client));
    this.currentClient.set(client);
  }

  private getStoredClient(): Cliente | null {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) as Cliente : null;
  }
}
