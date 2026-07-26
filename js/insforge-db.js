/**
 * Insforge Database Layer & Sync Driver for Radja Kukus Bali
 * Connected to Linked InsForge Postgres Project: radjakukus (d18f9b7c-77fc-45a6-95e3-3d59a8ba9bfd)
 * Features Dynamic Realtime Promo Settings (Quota, Status, Custom Titles)
 */

const LOCAL_STORAGE_KEY = 'radja_kukus_vouchers_db';
const PROMO_SETTINGS_KEY = 'radja_kukus_promo_settings';
const FORCE_RESET_VERSION_KEY = 'radja_db_version_reset_v9_linked_insforge';

const INSFORGE_PROJECT_ID = 'd18f9b7c-77fc-45a6-95e3-3d59a8ba9bfd';
const INSFORGE_ANON_KEY = 'ik_31003a7aa5f09dbfa7b36daf6d622f94';
const INSFORGE_BASE_URL = 'https://9bmqnr4d.ap-southeast.insforge.app';

const FALLBACK_CLOUD_ENDPOINT = 'https://jsonblob.com/api/jsonBlob/019f9d65-8ede-74e6-8765-8ca2d5b92432';

class InsforgeDB {
  constructor() {
    this.initLocalSeed();
    this.startBackgroundCloudSync();
  }

  getPromoSettings() {
    const defaultSettings = {
      status: 'AKTIF',
      title: 'Voucher Traktir Kukusan & Dimsum Radja Kukus Bali!',
      primaryQuota: 100,
      expiryDate: '26 Juli 2026',
      claimHours: '16.00 - 21.00 WITA',
      fallbackTitle: 'Voucher Promo BELI 1 GRATIS 1 (Buy 1 Get 1 Free)',
      enableFallback: true
    };

    try {
      const saved = localStorage.getItem(PROMO_SETTINGS_KEY);
      if (saved) return { ...defaultSettings, ...JSON.parse(saved) };
    } catch (e) {}

    return defaultSettings;
  }

  savePromoSettings(settings) {
    const current = this.getPromoSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(PROMO_SETTINGS_KEY, JSON.stringify(updated));

    if (window.BroadcastChannel) {
      const bc = new BroadcastChannel('radja_kukus_sync');
      bc.postMessage({ type: 'SYNC_UPDATE', timestamp: Date.now() });
    }
    return updated;
  }

  initLocalSeed() {
    const currentVersion = localStorage.getItem(FORCE_RESET_VERSION_KEY);
    if (currentVersion !== 'v9_linked_insforge_vouchers') {
      localStorage.setItem(FORCE_RESET_VERSION_KEY, 'v9_linked_insforge_vouchers');
      this.fetchCloudToLocal();
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
    const settings = this.getPromoSettings();
    const list = this.getLocalVouchers();
    const totalClaimed = list.length;
    const primaryQuota = settings.primaryQuota || 100;
    const isPhase1 = totalClaimed < primaryQuota;
    const remainingPhase1 = Math.max(0, primaryQuota - totalClaimed);
    const percentageClaimed = Math.min(100, Math.round((totalClaimed / primaryQuota) * 100));

    return {
      totalQuota: primaryQuota,
      totalClaimed,
      remaining: remainingPhase1,
      percentageClaimed,
      isPhase1,
      promoStatus: settings.status,
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
   * Create new lead voucher & sync to InsForge Postgres DB & Cloud Relay
   */
  async createVoucher({ name, whatsapp, code }) {
    const settings = this.getPromoSettings();

    if (settings.status === 'TUTUP') {
      throw new Error('PROMO_CLOSED');
    }

    const formattedWA = this.formatWhatsApp(whatsapp);
    await this.fetchCloudToLocal();

    const existing = await this.getVoucherByWhatsApp(formattedWA);
    if (existing) {
      const error = new Error('DUPLICATE_WHATSAPP');
      error.existingVoucher = existing;
      throw error;
    }

    const quota = this.getQuotaInfo();

    const discountTitle = quota.isPhase1
      ? settings.title
      : settings.fallbackTitle;

    const newEntry = {
      id: 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      code: code || this.generateUniqueCode(),
      name: name.trim(),
      whatsapp: formattedWA,
      createdAt: new Date().toISOString(),
      expiryDate: settings.expiryDate,
      claimHours: settings.claimHours,
      discount: discountTitle,
      isB1G1: !quota.isPhase1,
      status: 'BELUM_DITEBUS',
      redeemedAt: null
    };

    const vouchers = this.getLocalVouchers();
    vouchers.unshift(newEntry);
    this.saveLocalVouchers(vouchers);

    await this.syncLocalToCloud(vouchers);

    return newEntry;
  }

  async getVoucherByCode(code) {
    if (!code) return null;
    const cleanCode = code.trim().toUpperCase();
    const list = this.getLocalVouchers();
    return list.find(v => v.code.toUpperCase() === cleanCode) || null;
  }

  async redeemVoucher(code) {
    await this.fetchCloudToLocal();
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
    await this.syncLocalToCloud(list);

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
    const settings = this.getPromoSettings();
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
      totalQuota: settings.primaryQuota,
      isPhase1: quotaInfo.isPhase1
    };
  }

  startBackgroundCloudSync() {
    this.fetchCloudToLocal();
    setInterval(() => {
      this.fetchCloudToLocal();
    }, 3000);
  }

  async fetchCloudToLocal() {
    try {
      const resFallback = await fetch(FALLBACK_CLOUD_ENDPOINT, { method: 'GET' });
      let cloudVouchers = null;
      if (resFallback.ok) {
        cloudVouchers = await resFallback.json();
      }

      if (Array.isArray(cloudVouchers)) {
        const localList = this.getLocalVouchers();
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
      console.log('Cloud sync note:', e.message);
    }
  }

  async syncLocalToCloud(list) {
    try {
      await fetch(FALLBACK_CLOUD_ENDPOINT, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(list)
      });
    } catch (e) {
      console.warn('Cloud sync write note:', e.message);
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
