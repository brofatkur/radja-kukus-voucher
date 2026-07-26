/**
 * Insforge Database Layer & Sync Driver for Radja Kukus Bali
 * Dual-Phase Promo Logic + Strict 1 Phone Number = 1 Voucher Rule
 */

const LOCAL_STORAGE_KEY = 'radja_kukus_vouchers_db';
const INSFORGE_CONFIG_KEY = 'insforge_config_radja';
const FORCE_RESET_VERSION_KEY = 'radja_db_version_reset_v4';
const PRIMARY_QUOTA = 100;

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
    const currentVersion = localStorage.getItem(FORCE_RESET_VERSION_KEY);

    if (currentVersion !== 'v4_b1g1_unlimited') {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.setItem(FORCE_RESET_VERSION_KEY, 'v4_b1g1_unlimited');
      this.resetDataToZero();
    } else if (localStorage.getItem(LOCAL_STORAGE_KEY) === null) {
      this.resetDataToZero();
    }
  }

  resetDataToZero() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
    if (window.BroadcastChannel) {
      const bc = new BroadcastChannel('radja_kukus_sync');
      bc.postMessage({ type: 'SYNC_UPDATE', timestamp: Date.now() });
    }
  }

  getLocalVouchers() {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return parsed.filter(v => !v.id || !v.id.startsWith('v_seed_'));
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

  getQuotaInfo() {
    const list = this.getLocalVouchers();
    const totalClaimed = list.length;
    const isPhase1 = totalClaimed < PRIMARY_QUOTA;
    const remainingPhase1 = Math.max(0, PRIMARY_QUOTA - totalClaimed);
    const percentageClaimed = Math.min(100, Math.round((totalClaimed / PRIMARY_QUOTA) * 100));

    return {
      totalQuota: PRIMARY_QUOTA,
      totalClaimed,
      remaining: remainingPhase1,
      percentageClaimed,
      isPhase1,
      promoType: isPhase1 ? 'TRAKTIR_GRATIS' : 'BUY1_GET1_FREE'
    };
  }

  /**
   * Check if WhatsApp number has already claimed a voucher
   */
  async isWhatsAppClaimed(phone) {
    const cleanPhone = this.formatWhatsApp(phone);
    if (!cleanPhone) return false;
    const vouchers = this.getLocalVouchers();
    return vouchers.some(v => v.whatsapp === cleanPhone);
  }

  /**
   * Get existing voucher by WhatsApp number
   */
  async getVoucherByWhatsApp(phone) {
    const cleanPhone = this.formatWhatsApp(phone);
    if (!cleanPhone) return null;
    const vouchers = this.getLocalVouchers();
    return vouchers.find(v => v.whatsapp === cleanPhone) || null;
  }

  /**
   * Create new lead voucher with Strict 1 Phone Number = 1 Voucher Validation
   */
  async createVoucher({ name, whatsapp, code }) {
    const formattedWA = this.formatWhatsApp(whatsapp);

    // Enforce Unique WhatsApp Check
    const existing = await this.getVoucherByWhatsApp(formattedWA);
    if (existing) {
      const error = new Error('DUPLICATE_WHATSAPP');
      error.existingVoucher = existing;
      throw error;
    }

    const quota = this.getQuotaInfo();

    const discountTitle = quota.isPhase1
      ? 'Voucher Traktir Kukusan & Dimsum (Gratis Utama)'
      : 'Voucher Promo BELI 1 GRATIS 1 (Buy 1 Get 1 Free)';

    const newEntry = {
      id: 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      code: code || this.generateUniqueCode(),
      name: name.trim(),
      whatsapp: formattedWA,
      createdAt: new Date().toISOString(),
      expiryDate: '2026-07-26T21:00:00+08:00',
      claimHours: '16.00 - 21.00 WITA',
      discount: discountTitle,
      isB1G1: !quota.isPhase1,
      status: 'BELUM_DITEBUS',
      redeemedAt: null
    };

    const vouchers = this.getLocalVouchers();
    vouchers.unshift(newEntry);
    this.saveLocalVouchers(vouchers);

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
      totalQuota: PRIMARY_QUOTA,
      isPhase1: quotaInfo.isPhase1
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
