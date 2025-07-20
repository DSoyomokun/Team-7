import { createClient, SupabaseClient, SupabaseClientOptions } from '@supabase/supabase-js';

interface SupabaseConfig {
  url: string;
  key: string;
  options?: SupabaseClientOptions<any>;
}

const config: SupabaseConfig = {
  url: process.env.SUPABASE_URL as string,
  key: process.env.SUPABASE_KEY as string,
  options: {
    auth: { persistSession: true },
    realtime: { params: { eventsPerSecond: 10 } }
  }
};

class CustomSupabaseClient {
  public client: SupabaseClient;

  constructor() {
    if (!config.url || !config.key) {
      throw new Error('Missing Supabase URL or Key in environment');
    }
    this.client = createClient(config.url, config.key, config.options);
    this._initialize();
  }

  private async _initialize(): Promise<void> {
    try {
      const { error } = await this.client
        .from('profiles')
        .select('*')
        .limit(1);
      if (!error) console.log('Supabase ready');
    } catch (error: any) {
      console.error('Supabase init failed:', error.message || error);
    }
  }

  // Table shortcuts
  get transactions() {
    return this.client.from('transactions');
  }

  get users() {
    return this.client.from('users');
  }

  // Auth shortcut
  get auth() {
    return this.client.auth;
  }

  // Storage shortcut
  get storage() {
    return this.client.storage;
  }
}

export default new CustomSupabaseClient().client;
