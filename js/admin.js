/**
 * Admin Portal Application Logic - Radja Kukus Bali
 * Mobile First App UI Driver with Camera QR Code Scanning & Campaign Reset
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdminAuth();
  initBroadcastSync();
});

let html5QrCodeScanner = null;

function initAdminAuth() {
  const pinInput = document.getElementById('admin-pin-input');
  const btnLogin = document.getElementById('btn-admin-login');

  if (sessionStorage.getItem('radja_admin_logged_in') === 'true') {
    showAdminDashboard();
    return;
  }

  if (btnLogin) {
    btnLogin.addEventListener('click', handleLogin);
    pinInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleLogin();
    });
  }

  function handleLogin() {
    const pin = pinInput.value.trim();
    if (pin === '1234' || pin === 'admin') {
      sessionStorage.setItem('radja_admin_logged_in', 'true');
      showAdminDashboard();
    } else {
      alert('PIN Admin Salah! (Gunakan PIN default: 1234)');
    }
  }
}

function showAdminDashboard() {
  const authCard = document.getElementById('admin-auth-card');
  const mainContent = document.getElementById('admin-main-content');

  if (authCard) authCard.style.display = 'none';
  if (mainContent) mainContent.style.display = 'block';

  loadDashboardStats();
  loadLeadsTable();
  initSearchAndRedeem();
  initQRScanner();
  initExportCSV();
  initResetButton();
}

/**
 * Reset All Data to 0 for Real Promotion
 */
function initResetButton() {
  const btnReset = document.getElementById('btn-reset-db-zero');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm('Apakah Anda yakin ingin MENGHAPUS SELURUH DATA SAMPLE & MEMULAI PROMOSI DARI 0 LEAD?')) {
        window.insforgeDB.resetDataToZero();
        loadDashboardStats();
        loadLeadsTable();
        alert('✅ Database telah BERHASIL DIRESET KE 0! Siap untuk promosi real.');
      }
    });
  }
}

/**
 * Mobile App Segmented Tab Switcher
 */
window.switchAdminTab = function(tabName) {
  const btnScanner = document.getElementById('tab-btn-scanner');
  const btnLeads = document.getElementById('tab-btn-leads');
  const contentScanner = document.getElementById('tab-content-scanner');
  const contentLeads = document.getElementById('tab-content-leads');

  if (tabName === 'scanner') {
    btnScanner.classList.add('active');
    btnLeads.classList.remove('active');
    contentScanner.style.display = 'block';
    contentLeads.style.display = 'none';
  } else {
    btnLeads.classList.add('active');
    btnScanner.classList.remove('active');
    contentLeads.style.display = 'block';
    contentScanner.style.display = 'none';
    loadLeadsTable();
  }
};

/**
 * Load stats for summary cards
 */
async function loadDashboardStats() {
  if (!window.insforgeDB) return;
  const stats = await window.insforgeDB.getDashboardStats();

  document.getElementById('stat-total-leads').textContent = stats.totalLeads;
  document.getElementById('stat-total-redeemed').textContent = stats.totalRedeemed;
  document.getElementById('stat-total-active').textContent = stats.remainingQuota;
  document.getElementById('stat-conversion-rate').textContent = `${stats.conversionRate}%`;
}

/**
 * Load all leads into Mobile App Cards & Desktop Table
 */
async function loadLeadsTable(searchTerm = '') {
  const mobileContainer = document.getElementById('mobile-leads-container');
  const tbody = document.getElementById('admin-leads-table-body');
  if (!window.insforgeDB) return;

  const vouchers = await window.insforgeDB.getAllVouchers();
  if (mobileContainer) mobileContainer.innerHTML = '';
  if (tbody) tbody.innerHTML = '';

  const filtered = vouchers.filter(v => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return v.name.toLowerCase().includes(q) ||
           v.code.toLowerCase().includes(q) ||
           v.whatsapp.includes(q);
  });

  if (filtered.length === 0) {
    const emptyHtml = `<div style="text-align:center; padding:2rem; color:#888;">Belum ada data lead masuk (0 Lead). Siap menerima klaim real!</div>`;
    if (mobileContainer) mobileContainer.innerHTML = emptyHtml;
    if (tbody) tbody.innerHTML = `<tr><td colspan="6">${emptyHtml}</td></tr>`;
    return;
  }

  filtered.forEach(item => {
    const createdStr = new Date(item.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });

    const isRedeemed = item.status === 'SUDAH_DITEBUS';
    const statusBadge = isRedeemed
      ? `<span class="status-tag sudah">✓ SUDAH DITEBUS</span>`
      : `<span class="status-tag belum">⏱ BELUM DITEBUS</span>`;

    const waLink = `https://wa.me/${item.whatsapp}?text=${encodeURIComponent('Halo ' + item.name + ', salam hangat dari Radja Kukus Bali!')}`;

    if (mobileContainer) {
      const card = document.createElement('div');
      card.className = 'lead-item-card';
      card.innerHTML = `
        <div class="lead-item-header">
          <span class="lead-code-badge">${item.code}</span>
          ${statusBadge}
        </div>
        <div class="lead-item-body">
          <div class="lead-customer-name">👤 ${item.name}</div>
          <div style="margin-top:4px; font-size:0.8rem; color:#666;">
            📅 ${createdStr}
          </div>
        </div>
        <div class="lead-item-footer">
          <a href="${waLink}" target="_blank" style="color:#25D366; font-weight:700; font-size:0.82rem;">
            💬 ${item.whatsapp}
          </a>
          ${!isRedeemed ? `<button onclick="quickRedeemCode('${item.code}')" class="btn-app-redeem-now">Tebus Now</button>` : `<span style="font-size:0.75rem; color:#888;">${new Date(item.redeemedAt).toLocaleDateString('id-ID')}</span>`}
        </div>
      `;
      mobileContainer.appendChild(card);
    }

    if (tbody) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${item.code}</strong></td>
        <td>${item.name}</td>
        <td><a href="${waLink}" target="_blank" style="color:#25D366; font-weight:600;">💬 ${item.whatsapp}</a></td>
        <td>${createdStr}</td>
        <td>${statusBadge}</td>
        <td>
          ${!isRedeemed ? `<button onclick="quickRedeemCode('${item.code}')" class="btn-app-redeem-now">Tebus Now</button>` : `<span style="font-size:0.8rem; color:#888;">${new Date(item.redeemedAt).toLocaleDateString('id-ID')}</span>`}
        </td>
      `;
      tbody.appendChild(tr);
    }
  });
}

function initSearchAndRedeem() {
  const inputCode = document.getElementById('input-verify-code');
  const btnVerify = document.getElementById('btn-search-verify');

  if (!btnVerify) return;

  btnVerify.addEventListener('click', () => {
    const code = inputCode.value.trim();
    if (!code) {
      alert('Masukkan nomor kode voucher yang ingin diverifikasi!');
      return;
    }
    verifyVoucherCode(code);
  });

  const tableSearch = document.getElementById('table-search-input');
  if (tableSearch) {
    tableSearch.addEventListener('input', (e) => {
      loadLeadsTable(e.target.value.trim());
    });
  }
}

async function verifyVoucherCode(code) {
  const resultBox = document.getElementById('redeem-result-box');
  const voucher = await window.insforgeDB.getVoucherByCode(code);

  resultBox.style.display = 'block';

  if (!voucher) {
    resultBox.className = 'redeem-result-card already';
    resultBox.innerHTML = `
      <h3 style="color:#D32F2F; font-size:1.05rem;">❌ Kode Voucher Tidak Valid!</h3>
      <p style="font-size:0.85rem; margin-top:4px;">Kode <strong>${code}</strong> tidak terdaftar dalam sistem.</p>
    `;
    return;
  }

  const isRedeemed = voucher.status === 'SUDAH_DITEBUS';

  if (isRedeemed) {
    resultBox.className = 'redeem-result-card already';
    resultBox.innerHTML = `
      <h3 style="color:#D32F2F; font-size:1.05rem;">⚠️ Voucher Sudah Pernah Ditebus!</h3>
      <p style="font-size:0.85rem; margin-top:6px;"><strong>Nama:</strong> ${voucher.name} (${voucher.whatsapp})</p>
      <p style="font-size:0.85rem;"><strong>Kode:</strong> ${voucher.code}</p>
      <p style="font-size:0.85rem;"><strong>Waktu Ditebus:</strong> ${new Date(voucher.redeemedAt).toLocaleString('id-ID')}</p>
    `;
  } else {
    resultBox.className = 'redeem-result-card success';
    resultBox.innerHTML = `
      <h3 style="color:#2E7D32; font-size:1.05rem;">✅ Voucher Valid (Siap Ditebus)</h3>
      <p style="font-size:0.85rem; margin-top:6px;"><strong>Nama:</strong> ${voucher.name}</p>
      <p style="font-size:0.85rem;"><strong>No. WA:</strong> ${voucher.whatsapp}</p>
      <p style="font-size:0.85rem;"><strong>Kode:</strong> <span style="font-family:monospace; font-weight:bold;">${voucher.code}</span></p>
      <p style="font-size:0.85rem;"><strong>Promo:</strong> ${voucher.discount}</p>
      <button onclick="confirmRedeem('${voucher.code}')" style="margin-top:10px; background:#1E4D2B; color:white; padding:12px; border-radius:8px; font-weight:800; font-size:0.95rem; width:100%;">
        🎉 Konfirmasi Penukaran Sekarang
      </button>
    `;
  }
}

window.quickRedeemCode = function(code) {
  switchAdminTab('scanner');
  const inputCode = document.getElementById('input-verify-code');
  if (inputCode) inputCode.value = code;
  verifyVoucherCode(code);
};

window.confirmRedeem = async function(code) {
  if (!confirm(`Konfirmasi penukaran voucher ${code} untuk pelanggan?`)) return;

  const result = await window.insforgeDB.redeemVoucher(code);
  if (result.success) {
    alert('🎉 Success! Voucher berhasil ditebus.');
    loadDashboardStats();
    loadLeadsTable();
    verifyVoucherCode(code);
  } else {
    alert(result.message);
  }
};

function initQRScanner() {
  const btnScan = document.getElementById('btn-open-scanner');
  const modal = document.getElementById('scanner-modal');
  const btnClose = document.getElementById('btn-close-scanner');

  if (!btnScan || !modal) return;

  btnScan.addEventListener('click', () => {
    modal.style.display = 'flex';
    startCameraScanner();
  });

  if (btnClose) {
    btnClose.addEventListener('click', stopCameraScanner);
  }
}

function startCameraScanner() {
  if (typeof Html5Qrcode === 'undefined') {
    alert('Modul QR Scanner belum siap. Silakan periksa koneksi internet.');
    return;
  }

  const qrReader = new Html5Qrcode("qr-reader-container");
  html5QrCodeScanner = qrReader;

  qrReader.start(
    { facingMode: "environment" },
    {
      fps: 10,
      qrbox: { width: 220, height: 220 }
    },
    (decodedText) => {
      console.log('Scanned QR:', decodedText);
      stopCameraScanner();

      let code = decodedText;
      try {
        const parsed = JSON.parse(decodedText);
        if (parsed.code) code = parsed.code;
      } catch (e) {}

      document.getElementById('input-verify-code').value = code;
      verifyVoucherCode(code);
    },
    (errorMessage) => {}
  ).catch(err => {
    console.error('Camera access error:', err);
    alert('Tidak dapat mengaktifkan kamera. Pastikan izin kamera telah diberikan atau gunakan opsi Input Manual.');
    stopCameraScanner();
  });
}

function stopCameraScanner() {
  const modal = document.getElementById('scanner-modal');
  if (modal) modal.style.display = 'none';

  if (html5QrCodeScanner) {
    html5QrCodeScanner.stop().then(() => {
      html5QrCodeScanner.clear();
      html5QrCodeScanner = null;
    }).catch(err => console.log('Scanner stop note:', err));
  }
}

function initExportCSV() {
  const btnExport = document.getElementById('btn-export-csv');
  if (!btnExport) return;

  btnExport.addEventListener('click', async () => {
    const vouchers = await window.insforgeDB.getAllVouchers();
    if (!vouchers.length) {
      alert('Belum ada data lead untuk diexport.');
      return;
    }

    let csvContent = 'Kode Voucher,Nama Pelanggan,WhatsApp,Tanggal Klaim,Status,Tanggal Ditebus\n';

    vouchers.forEach(v => {
      const created = new Date(v.createdAt).toISOString();
      const redeemed = v.redeemedAt ? new Date(v.redeemedAt).toISOString() : '-';
      csvContent += `"${v.code}","${v.name}","${v.whatsapp}","${created}","${v.status}","${redeemed}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rekap_Lead_Radja_Kukus_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
}

function initBroadcastSync() {
  if (window.BroadcastChannel) {
    const bc = new BroadcastChannel('radja_kukus_sync');
    bc.onmessage = (event) => {
      if (event.data && event.data.type === 'SYNC_UPDATE') {
        loadDashboardStats();
        loadLeadsTable();
      }
    };
  }
}
