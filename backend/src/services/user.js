// backend/services/user.service.js
const supabase = require('../config/database');
const UserRepository = require('../models/repositories/user.repository');

class UserService {
  static async getProfile(userId) {
    return await UserRepository.findById(userId);
  }

  static async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select();

    if (error) throw new Error(error.message);
    return data;
  }

  static async deleteAccount(userId) {
    
    await supabase.from('profiles').delete().eq('user_id', userId);
    
    
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) throw new Error(error.message);
  }
}

module.exports = UserService;