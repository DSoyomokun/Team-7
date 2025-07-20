const { supabase } = require('../../config/database');

class UserRepository {
  static async findById(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw new Error(`User not found: ${error.message}`);
    return data;
  }

  static async create(userData) {
    const { data, error } = await supabase
      .from('profiles')
      .insert(userData)
      .select()
      .single();

    if (error) throw new Error(`Failed to create user: ${error.message}`);
    return data;
  }

  static async update(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update user: ${error.message}`);
    return data;
  }

  static async delete(userId) {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('user_id', userId);

    if (error) throw new Error(`Failed to delete user: ${error.message}`);
  }
}

module.exports = UserRepository; 