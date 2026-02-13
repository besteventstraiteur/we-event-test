import { apiClient } from './api-client';
import { ApiResponse } from '../types/api';
import { Contract, CreateContractDTO, UpdateContractDTO } from '../types/contract';

class ContractService {
  async getContracts(eventId?: string): Promise<ApiResponse<Contract[]>> {
    return apiClient.get<Contract[]>('/contracts', { params: { event_id: eventId } });
  }

  async getContractById(contractId: string): Promise<ApiResponse<Contract>> {
    return apiClient.get<Contract>(`/contracts/${contractId}`);
  }

  async createContract(data: CreateContractDTO): Promise<ApiResponse<Contract>> {
    return apiClient.post<Contract>('/contracts', data);
  }

  async updateContract(contractId: string, data: UpdateContractDTO): Promise<ApiResponse<Contract>> {
    return apiClient.patch<Contract>(`/contracts/${contractId}`, data);
  }

  async signContract(contractId: string): Promise<ApiResponse<Contract>> {
    return apiClient.post<Contract>(`/contracts/${contractId}/sign`);
  }

  async generatePDF(contractId: string): Promise<ApiResponse<{ pdf_url: string }>> {
    return apiClient.post<{ pdf_url: string }>(`/contracts/${contractId}/generate-pdf`);
  }
}

export const contractService = new ContractService();
export default contractService;
