import { http } from '../http.jsx';

export const AccountsService = {
  async getAccounts() {
    const res = await http('/accounts');
    return res?.data?.data ?? []; 
  },

  async getAccountById(id) {
    return await http(`/accounts/${id}`);
  }
};
