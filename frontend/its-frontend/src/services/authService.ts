import type { User, LoginRequest, RegisterRequest } from "@/types";
import api from "./api"; // Đảm bảo file này đã cấu hình baseURL trỏ về Gateway

export const authService = {
  // --- 1. LOGIN (Gọi API thật) ---
  async login(
    credentials: LoginRequest,
  ): Promise<{ user: User; token: string }> {
    // Backend Java hiện đã hỗ trợ key "email" trong LoginRequest
    const response = await api.post("/auth/login", {
      email: credentials.email,
      password: credentials.password,
    });

    // Backend trả về: { token, type: "Bearer", email, role }
    const data = response.data;

    // Tạo đối tượng User để lưu ở Client
    // Vì Backend chưa lưu "Tên thật" (Full Name), ta tạm dùng email làm tên hiển thị
    const user: User = {
      // id: 0, // Nếu type User của bạn yêu cầu id thì bỏ comment dòng này
      email: data.email,
      role: data.role,
      name: data.email.split("@")[0], // Lấy phần đầu email làm tên tạm
    };

    // Lưu session vào LocalStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(user));

    return { user, token: data.token };
  },

  // --- 2. REGISTER (Gọi API thật) ---
  async register(
    data: RegisterRequest,
  ): Promise<{ user: User; token: string }> {
    // Gọi API Đăng ký
    // Backend RegisterRequest mới chỉ cần: email, password, role
    await api.post("/auth/register", {
      email: data.email,
      password: data.password,
      role: data.role,
      // Lưu ý: Trường 'name' từ form frontend sẽ bị bỏ qua
      // vì Backend hiện tại chưa có cột lưu tên thật.
    });

    // Backend chỉ trả về message string, không trả token.
    // Nên ta gọi hàm login ngay lập tức để tự động đăng nhập.
    return this.login({
      email: data.email,
      password: data.password,
    });
  },

  // --- 3. GET CURRENT USER ---
  async getCurrentUser(): Promise<User | null> {
    // Lấy thông tin user từ LocalStorage (đã lưu lúc login)
    // Vì ta chưa xây dựng API /auth/me để lấy info từ token
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

  // --- 4. LOGOUT ---
  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Reload trang để reset toàn bộ state của React
    window.location.href = "/login";
  },
};
