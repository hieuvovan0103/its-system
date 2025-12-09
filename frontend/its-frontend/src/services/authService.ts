import type { User, LoginRequest, RegisterRequest } from "@/types";
import api from "./api"; 

export const authService = {
  
  async login(
    credentials: LoginRequest,
  ): Promise<{ user: User; token: string }> {
    
    const response = await api.post("/auth/login", {
      email: credentials.email,
      password: credentials.password,
    });

    
    const data = response.data;

        
    const user: User = {
      
      email: data.email,
      role: data.role,
      name: data.email.split("@")[0], 
    };

    
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(user));

    return { user, token: data.token };
  },

  
  async register(
    data: RegisterRequest,
  ): Promise<{ user: User; token: string }> {
    
    await api.post("/auth/register", {
      email: data.email,
      password: data.password,
      role: data.role,
      
    });

    
    return this.login({
      email: data.email,
      password: data.password,
    });
  },

  
  async getCurrentUser(): Promise<User | null> {
    
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error("Error parsing user data", e);
        return null;
      }
    }
    return null;
  },

 
  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    window.location.href = "/login";
  },
};
