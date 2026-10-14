import { branchRepository } from "../repository/branch.repository";
import { Branch, CreateBranchDto, UpdateBranchDto } from "../domain/branch.entity";

export class BranchService {
  async getActiveBranches(): Promise<Branch[]> {
    return branchRepository.findAll(true);
  }

  async getDomesticBranches(): Promise<Branch[]> {
    return branchRepository.findDomestic(true);
  }

  async getInternationalBranches(): Promise<Branch[]> {
    return branchRepository.findInternational(true);
  }

  async getAllBranches(): Promise<Branch[]> {
    return branchRepository.findAll(false);
  }

  async getBranchById(id: string): Promise<Branch | null> {
    return branchRepository.findById(id);
  }

  async createBranch(data: CreateBranchDto): Promise<Branch> {
    return branchRepository.create(data);
  }

  async updateBranch(data: UpdateBranchDto): Promise<Branch> {
    return branchRepository.update(data);
  }

  async deleteBranch(id: string): Promise<boolean> {
    return branchRepository.delete(id);
  }
}

export const branchService = new BranchService();
