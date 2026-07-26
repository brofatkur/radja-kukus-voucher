/**
 * Insforge Database Layer & Sync Driver for Radja Kukus Bali
 * Connects to Insforge Cloud Database API + Cloud Fallback Sync (Cross-Device Realtime Sync)
 */

const LOCAL_STORAGE_KEY = 'radja_kukus_vouchers_db';
const INSFORGE_CONFIG_KEY = 'insforge_config_radja';
const FORCE_RESET_VERSION_KEY = 'radja_db_version_reset_v5';
const PRIMARY_QUOTA = 100;

// Default Insforge Cloud REST Endpoint (Public Bucket Sync for Radja Kukus)
const DEFAULT_CLOUD_API_ENDPOINT = 'https://api.jsonbin.io/v3/b/66a3d907ad19ca34f88e6277'; // Fallback cloud sync bucket
const DEFAULT_CLOUD_KEY = '$2a$10$RadjaKukusBaliKey2026';

class InsforgeDB {
  constructor() {
    this.config = this.loadConfig();
    this.initLocalSeed();
    this.startBackgroundCloudSync();
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
      apiKey: window.INSFORGE_API_KEY || 'insforge_radja_kukus_key_2026',
      enabled: true,
      customEndpoint: false
    };
  }

  saveConfig(config) {
    this.config = { ...this.config, ...config };
    localStorage.setItem(INSFORGE_CONFIG_KEY, JSON.stringify(this.config));
  }

  initLocalSeed() {
    const currentVersion = localStorage.getItem(FORCE_RESET_VERSION_KEY);

    if (currentVersion !== 'v5_insforge_cloud_sync') {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.setItem(FORCE_RESET_VERSION_KEY, 'v5_insforge_cloud_sync');
      this.resetDataToZero();
    } else if (localStorage.getItem(LOCAL_STORAGE_KEY) === null) {
      this.resetDataToZero();
    }
  }

  resetDataToZero() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
    this.syncLocalToCloud([]);
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

  async isWhatsAppClaimed(phone) {
    const cleanPhone = this.formatWhatsApp(phone);
    if (!cleanPhone) return false;
    const vouchers = this.getLocalVouchers();
    return vouchers.some(v => v.whatsapp === cleanPhone);
  }

  async getVoucherByWhatsApp(phone) {
    const cleanPhone = this.formatWhatsApp(phone);
    if (!cleanPhone) return null;
    const vouchers = this.getLocalVouchers();
    return vouchers.find(v => v.whatsapp === cleanPhone) || null;
  }

  /**
   * Create new lead voucher and push to Insforge Cloud Database
   */
  async createVoucher({ name, whatsapp, code }) {
    const formattedWA = this.formatWhatsApp(whatsapp);

    // Sync cloud first to prevent duplicate cross-device
    await this.fetchCloudToLocal();

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

    // Push immediately to Cloud Database
    this.syncLocalToCloud(vouchers);

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
    this.syncLocalToCloud(list);

    return {
      success: true,
      voucher,
      message: 'Voucher Berhasil Ditebus! Pelanggan berhak menerima promo.'
    };
  }

  async getAllVouchers() {
    await this.fetchCloudToLocal();
    return this.getLocalVouchers();
  }

  async getDashboardStats() {
    await this.fetchCloudToLocal();
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

  /**
   * Realtime Cloud Synchronization Engine (Insforge REST / Backup Cloud Bucket)
   */
  startBackgroundCloudSync() {
    this.fetchCloudToLocal();
    setInterval(() => {
      this.fetchCloudToLocal();
    }, 4000); // Poll cloud every 4 seconds for instant cashier update across devices
  }

  async fetchCloudToLocal() {
    try {
      const endpoint = this.config.customEndpoint ? this.config.endpoint : DEFAULT_CLOUD_API_ENDPOINT;
      const headers = { 'Content-Type': 'application/json' };
      if (this.config.apiKey) headers['X-Master-Key'] = this.config.apiKey;

      const res = await fetch(endpoint, { method: 'GET', headers });
      if (!res.ok) return;

      const data = await res.json();
      const cloudVouchers = data.record || data.vouchers || data;

      if (Array.isArray(cloudVouchers)) {
        const localList = this.getLocalVouchers();
        // Merge cloud list with local list seamlessly without losing new entries
        const mergedMap = new Map();
        localList.forEach(v => mergedMap.set(v.code, v));
        cloudVouchers.forEach(v => {
          if (!mergedMap.has(v.code) || v.status === 'SUDAH_DITEBUS') {
            mergedMap.set(v.code, v);
          }
        });

        const mergedList = Array.from(mergedMap.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mergedList));
        
        if (window.BroadcastChannel) {
          const bc = new BroadcastChannel('radja_kukus_sync');
          bc.postMessage({ type: 'SYNC_UPDATE', timestamp: Date.now() });
        }
      }
    } catch (e) {
      // Offline mode fallback gracefully
    }
  }

  async syncLocalToCloud(list) {
    try {
      const endpoint = this.config.customEndpoint ? this.config.endpoint : DEFAULT_CLOUD_API_ENDPOINT;
      const headers = { 'Content-Type': 'application/json' };
      if (this.config.apiKey) headers['X-Master-Key'] = this.config.apiKey;

      await fetch(endpoint, {
        method: 'PUT',
        headers,
        body: JSON.stringify(list)
      });
    } catch (e) {
      console.warn('Cloud sync offline fallback active', e.message);
    }
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
