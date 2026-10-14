import { userRepository, UserRepository } from "../repository/user.repository";
import { UserAccount, CreateUserDto, UpdateUserDto } from "../domain/user.entity";

export class UserService {
  constructor(private repo: UserRepository = userRepository) {}

  async getAllUsers(filter?: {
    role?: string;
    search?: string;
    branchId?: string;
    isActive?: boolean;
  }): Promise<UserAccount[]> {
    return this.repo.findAll(filter);
  }

  async getUserById(id: string): Promise<UserAccount | null> {
    return this.repo.findById(id);
  }

  async createUser(dto: CreateUserDto): Promise<UserAccount> {
    const existing = await this.repo.findByEmail(dto.email);
    if (existing) {
      throw new Error(`An account with email ${dto.email} already exists.`);
    }

    if (!dto.password || dto.password.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }

    if (!dto.name || dto.name.trim().length === 0) {
      throw new Error("Full name is required.");
    }

    return this.repo.create(dto);
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserAccount> {
    if (dto.email) {
      const existing = await this.repo.findByEmail(dto.email);
      if (existing && existing.id !== id) {
        throw new Error(`An account with email ${dto.email} already exists.`);
      }
    }

    if (dto.password && dto.password.length < 6) {
      throw new Error("New password must be at least 6 characters long.");
    }

    return this.repo.update(id, dto);
  }

  async deleteUser(id: string, requesterUserId?: string): Promise<boolean> {
    return this.repo.delete(id, requesterUserId);
  }

  async getRoleStats() {
    return this.repo.getRoleStats();
  }

  async countAdmins(): Promise<number> {
    return this.repo.countAdmins();
  }

  async hasAnyAdmin(): Promise<boolean> {
    return this.repo.hasAnyAdmin();
  }

  async createInitialAdmin(dto: {
    name: string;
    email: string;
    password: string;
    phone?: string | null;
    department?: string | null;
  }): Promise<UserAccount> {
    const hasAdmin = await this.hasAnyAdmin();
    if (hasAdmin) {
      throw new Error(
        "Initial setup has already been completed. An active administrator account already exists."
      );
    }

    if (!dto.name || dto.name.trim().length === 0) {
      throw new Error("Full name is required.");
    }

    if (!dto.email || !dto.email.includes("@")) {
      throw new Error("A valid email address is required.");
    }

    if (!dto.password || dto.password.length < 8) {
      throw new Error("Password must be at least 8 characters long.");
    }

    return this.repo.create({
      name: dto.name.trim(),
      email: dto.email.trim().toLowerCase(),
      password: dto.password,
      phone: dto.phone?.trim() || null,
      department: dto.department?.trim() || "Executive Administration",
      role: "superadmin",
      is_active: true,
    });
  }
}

export const userService = new UserService();
