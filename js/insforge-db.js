/**
 * Insforge Database Layer & Sync Driver for Radja Kukus Bali
 * Handles Realtime Dynamic Quota (100 Vouchers max), Expiry Date, & Realtime Percentage Math
 */

const LOCAL_STORAGE_KEY = 'radja_kukus_vouchers_db';
const INSFORGE_CONFIG_KEY = 'insforge_config_radja';
const TOTAL_QUOTA = 100;

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

  initLocalSeed() {
    if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
      // Seed initial claims so total claim starts at 83, sisa 17 (dapat bertambah/berkurang realtime)
      const initialSeed = [];
      const sampleNames = [
        'Kadek Arimbawa', 'Ni Luh Gede', 'I Wayan Sudiarta', 'Made Suryani',
        'Ketut Rai', 'Budi Santoso', 'Gede Agus Pratama', 'Ni Putu Lestari',
        'Dewa Nyoman', 'Komang Triana', 'I Made Ari', 'Ni Kadek Yuni',
        'Cokorda Agung', 'Desak Made', 'Anak Agung Raka', 'Siti Rahmawati',
        'Rizky Ramadhan', 'Dewa Ayu Sinta', 'I Gede Suardana', 'Made Wirawan'
      ];

      for (let i = 0; i < 83; i++) {
        const name = sampleNames[i % sampleNames.length] + (i > 19 ? ` ${Math.floor(i/10)}` : '');
        initialSeed.push({
          id: `v_seed_${i+1}`,
          code: `RK-BALI-${80000 + i}`,
          name: name,
          whatsapp: `62812${Math.floor(1000000 + Math.random() * 8999999)}`,
          createdAt: new Date(Date.now() - (83 - i) * 180000).toISOString(),
          expiryDate: '2026-07-26T21:00:00+08:00',
          discount: 'Voucher Traktir Kukusan & Dimsum (Diskon Special)',
          status: i % 4 === 0 ? 'SUDAH_DITEBUS' : 'BELUM_DITEBUS',
          redeemedAt: i % 4 === 0 ? new Date(Date.now() - (83 - i) * 120000).toISOString() : null
        });
      }
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
    if (window.BroadcastChannel) {
      const bc = new BroadcastChannel('radja_kukus_sync');
      bc.postMessage({ type: 'SYNC_UPDATE', timestamp: Date.now() });
    }
  }

  /**
   * Calculate Realtime Dynamic Quota & Percentage
   */
  getQuotaInfo() {
    const list = this.getLocalVouchers();
    const totalClaimed = list.length;
    const remaining = Math.max(0, TOTAL_QUOTA - totalClaimed);
    const percentageClaimed = Math.min(100, Math.round((totalClaimed / TOTAL_QUOTA) * 100));

    return {
      totalQuota: TOTAL_QUOTA,
      totalClaimed,
      remaining,
      percentageClaimed
    };
  }

  /**
   * Create a new lead voucher
   */
  async createVoucher({ name, whatsapp, code }) {
    const quota = this.getQuotaInfo();

    if (quota.remaining <= 0) {
      throw new Error('QUOTA_FULL');
    }

    const newEntry = {
      id: 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      code: code || this.generateUniqueCode(),
      name: name.trim(),
      whatsapp: this.formatWhatsApp(whatsapp),
      createdAt: new Date().toISOString(),
      expiryDate: '2026-07-26T21:00:00+08:00',
      claimHours: '16.00 - 21.00 WITA',
      discount: 'Voucher Traktir Kukusan & Dimsum (Berlaku 26 Juli 2026, 16:00-21:00 WITA)',
      status: 'BELUM_DITEBUS',
      redeemedAt: null
    };

    // Save to LocalStorage
    const vouchers = this.getLocalVouchers();
    vouchers.unshift(newEntry);
    this.saveLocalVouchers(vouchers);

    // Sync to Insforge Backend API
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

  async getVoucherByCode(code) {
    if (!code) return null;
    const cleanCode = code.trim().toUpperCase();
    const list = this.getLocalVouchers();
    return list.find(v => v.code.toUpperCase() === cleanCode) || null;
  }

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

    voucher.status = 'SUDAH_DITEBUS';
    voucher.redeemedAt = new Date().toISOString();
    list[index] = voucher;

    this.saveLocalVouchers(list);

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

  async getAllVouchers() {
    return this.getLocalVouchers();
  }

  async getDashboardStats() {
    const list = this.getLocalVouchers();
    const totalLeads = list.length;
    const totalRedeemed = list.filter(v => v.status === 'SUDAH_DITEBUS').length;
    const totalActive = list.filter(v => v.status === 'BELUM_DITEBUS').length;
    const conversionRate = totalLeads > 0 ? Math.round((totalRedeemed / totalLeads) * 100) : 0;
    const quotaInfo = this.getQuotaInfo();

    return {
      totalLeads,
      totalRedeemed,
      totalActive,
      conversionRate,
      remainingQuota: quotaInfo.remaining,
      totalQuota: TOTAL_QUOTA
    };
  }

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

window.insforgeDB = new InsforgeDB();
