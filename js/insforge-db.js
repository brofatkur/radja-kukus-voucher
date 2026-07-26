/**
 * Insforge Database Layer & Sync Driver for Radja Kukus Bali
 * Provides dual storage: Insforge Cloud API & LocalStorage Fallback
 */

const LOCAL_STORAGE_KEY = 'radja_kukus_vouchers_db';
const INSFORGE_CONFIG_KEY = 'insforge_config_radja';

class InsforgeDB {
  constructor() {
    this.config = this.loadConfig();
    this.initLocalSeed();
  }

  loadConfig() {
    const saved = localStorage.getItem(INSFORGE_CONFIG_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Invalid Insforge config format', e);
      }
    }
    return {
      endpoint: window.INSFORGE_ENDPOINT || 'https://api.insforge.com/v1',
      apiKey: window.INSFORGE_API_KEY || 'insforge_demo_anon_key',
      enabled: true
    };
  }

  saveConfig(endpoint, apiKey) {
    this.config = { endpoint, apiKey, enabled: true };
    localStorage.setItem(INSFORGE_CONFIG_KEY, JSON.stringify(this.config));
  }

  initLocalSeed() {
    if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
      const initialSeed = [
        {
          id: 'v_seed_1',
          code: 'RK-BALI-88X92',
          name: 'Budi Santoso',
          whatsapp: '081234567890',
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          expiryDate: new Date(Date.now() + 3600000 * 24 * 6).toISOString(),
          discount: 'Voucher Traktir Kukusan & Dimsum (Diskon 20%)',
          status: 'BELUM_DITEBUS',
          redeemedAt: null
        },
        {
          id: 'v_seed_2',
          code: 'RK-BALI-33A71',
          name: 'Ni Wayan Putu',
          whatsapp: '081987654321',
          createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
          expiryDate: new Date(Date.now() + 3600000 * 24 * 5).toISOString(),
          discount: 'Voucher Traktir Kukusan & Dimsum (Diskon 20%)',
          status: 'SUDAH_DITEBUS',
          redeemedAt: new Date(Date.now() - 3600000 * 12).toISOString()
        }
      ];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialSeed));
    }
  }

  getLocalVouchers() {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  saveLocalVouchers(list) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    // Broadcast change to other open tabs (e.g. admin tab)
    if (window.BroadcastChannel) {
      const bc = new BroadcastChannel('radja_kukus_sync');
      bc.postMessage({ type: 'SYNC_UPDATE', timestamp: Date.now() });
    }
  }

  /**
   * Create a new lead voucher
   */
  async createVoucher({ name, whatsapp, code, expiryDate, discount }) {
    const newEntry = {
      id: 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      code: code || this.generateUniqueCode(),
      name: name.trim(),
      whatsapp: this.formatWhatsApp(whatsapp),
      createdAt: new Date().toISOString(),
      expiryDate: expiryDate || new Date(Date.now() + 7 * 24 * 3600000).toISOString(),
      discount: discount || 'Voucher Traktir Kukusan & Dimsum (Gratis/Diskon Special)',
      status: 'BELUM_DITEBUS',
      redeemedAt: null
    };

    // 1. Save to LocalStorage
    const vouchers = this.getLocalVouchers();
    vouchers.unshift(newEntry);
    this.saveLocalVouchers(vouchers);

    // 2. Sync to Insforge Backend Database API asynchronously
    try {
      if (this.config.enabled && this.config.endpoint) {
        fetch(`${this.config.endpoint}/vouchers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`,
            'X-Insforge-Source': 'RadjaKukusLeadMagnet'
          },
          body: JSON.stringify(newEntry)
        }).catch(err => console.log('Insforge async sync note:', err.message));
      }
    } catch (err) {
      console.warn('Insforge API sync fallback to local', err);
    }

    return newEntry;
  }

  /**
   * Search voucher by unique code
   */
  async getVoucherByCode(code) {
    if (!code) return null;
    const cleanCode = code.trim().toUpperCase();
    const list = this.getLocalVouchers();
    const found = list.find(v => v.code.toUpperCase() === cleanCode);
    return found || null;
  }

  /**
   * Redeem a voucher (Status -> SUDAH_DITEBUS)
   */
  async redeemVoucher(code) {
    const list = this.getLocalVouchers();
    const cleanCode = code.trim().toUpperCase();
    const index = list.findIndex(v => v.code.toUpperCase() === cleanCode);

    if (index === -1) {
      return { success: false, message: 'Kode Voucher tidak ditemukan!' };
    }

    const voucher = list[index];

    if (voucher.status === 'SUDAH_DITEBUS') {
      return {
        success: false,
        alreadyRedeemed: true,
        voucher,
        message: `Voucher ini sudah pernah ditebus pada ${new Date(voucher.redeemedAt).toLocaleString('id-ID')}`
      };
    }

    // Check expiry
    if (new Date(voucher.expiryDate) < new Date()) {
      return {
        success: false,
        expired: true,
        voucher,
        message: 'Voucher telah melewati tanggal masa berlaku (Expired).'
      };
    }

    // Update status
    voucher.status = 'SUDAH_DITEBUS';
    voucher.redeemedAt = new Date().toISOString();
    list[index] = voucher;

    this.saveLocalVouchers(list);

    // Sync update to Insforge Cloud DB
    try {
      if (this.config.enabled) {
        fetch(`${this.config.endpoint}/vouchers/${voucher.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`
          },
          body: JSON.stringify({ status: 'SUDAH_DITEBUS', redeemedAt: voucher.redeemedAt })
        }).catch(e => console.log('Insforge update note:', e.message));
      }
    } catch (e) {}

    return {
      success: true,
      voucher,
      message: 'Voucher Berhasil Ditebus! Pelanggan berhak menerima promo.'
    };
  }

  /**
   * Get all lead vouchers
   */
  async getAllVouchers() {
    return this.getLocalVouchers();
  }

  /**
   * Calculate stats for Admin Dashboard
   */
  async getDashboardStats() {
    const list = this.getLocalVouchers();
    const totalLeads = list.length;
    const totalRedeemed = list.filter(v => v.status === 'SUDAH_DITEBUS').length;
    const totalActive = list.filter(v => v.status === 'BELUM_DITEBUS').length;
    const conversionRate = totalLeads > 0 ? Math.round((totalRedeemed / totalLeads) * 100) : 0;

    return {
      totalLeads,
      totalRedeemed,
      totalActive,
      conversionRate
    };
  }

  /**
   * Generate random code e.g. RK-BALI-89X2L
   */
  generateUniqueCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let rand = '';
    for (let i = 0; i < 5; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `RK-BALI-${rand}`;
  }

  formatWhatsApp(phone) {
    if (!phone) return '';
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1);
    }
    return cleaned;
  }
}

// Global singleton instance
window.insforgeDB = new InsforgeDB();
