
import { createClient } from '@supabase/supabase-js';

const config = {
  url: process.env.SUPABASE_URL,
  key: process.env.SUPABASE_KEY,
  options: {
    auth: { persistSession: true },
    realtime: { params: { eventsPerSecond: 10 } }
  }
};

class SupabaseClient {
  constructor() {
    this.client = createClient(config.url, config.key, config.options);
    this._initialize();
  }

  async _initialize() {
    try {
      const { error } = await this.client
        .from('profiles')
        .select('*')
        .limit(1);
      if (!error) console.log('Supabase ready');
    } catch (error) {
      console.error('Supabase init failed:', error);
    }
  }

  // Table shortcuts
  get transactions() {
    return this.client.from('transactions');
  }

  get users() {
    return this.client.from('users');
  }

  // Auth shortcuts
  get auth() {
    return this.client.auth;
  }

  // Storage shortcuts
  get storage() {
    return this.client.storage;
  }
}

export default new SupabaseClient().client;

