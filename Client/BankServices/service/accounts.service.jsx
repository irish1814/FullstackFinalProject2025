import { http } from '../http.jsx';

export const AccountsService = {
  async getMyAccount() {
    const res = await http('/accounts/me');
    return res?.data?.data ?? null; 
  },

  async getAccountById(id) {
    const res = await http(`/accounts/${id}`);
    return res?.data?.data ?? null;
  }
};
