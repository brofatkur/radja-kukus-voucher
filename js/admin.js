/**
 * Admin Portal Application Logic - Radja Kukus Bali
 * Handles Admin Security, Camera QR Code Scanning, Voucher Redemption, & Lead Dashboard
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdminAuth();
  initBroadcastSync();
});

let html5QrCodeScanner = null;

function initAdminAuth() {
  const adminSection = document.getElementById('admin-main-content');
  const authCard = document.getElementById('admin-auth-card');
  const pinInput = document.getElementById('admin-pin-input');
  const btnLogin = document.getElementById('btn-admin-login');

  // Check session storage
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
}

/**
 * Load stats for summary cards
 */
async function loadDashboardStats() {
  if (!window.insforgeDB) return;
  const stats = await window.insforgeDB.getDashboardStats();

  document.getElementById('stat-total-leads').textContent = stats.totalLeads;
  document.getElementById('stat-total-redeemed').textContent = stats.totalRedeemed;
  document.getElementById('stat-total-active').textContent = stats.totalActive;
  document.getElementById('stat-conversion-rate').textContent = `${stats.conversionRate}%`;
}

/**
 * Load all leads into Admin Table
 */
async function loadLeadsTable(searchTerm = '') {
  const tbody = document.getElementById('admin-leads-table-body');
  if (!tbody || !window.insforgeDB) return;

  const vouchers = await window.insforgeDB.getAllVouchers();
  tbody.innerHTML = '';

  const filtered = vouchers.filter(v => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return v.name.toLowerCase().includes(q) ||
           v.code.toLowerCase().includes(q) ||
           v.whatsapp.includes(q);
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:#888;">Tidak ada data lead ditemukan.</td></tr>`;
    return;
  }

  filtered.forEach(item => {
    const tr = document.createElement('tr');

    const createdStr = new Date(item.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const isRedeemed = item.status === 'SUDAH_DITEBUS';
    const statusBadge = isRedeemed
      ? `<span class="status-badge sudah">✓ SUDAH DITEBUS</span>`
      : `<span class="status-badge belum">⏱ BELUM DITEBUS</span>`;

    const waLink = `https://wa.me/${item.whatsapp}?text=${encodeURIComponent('Halo ' + item.name + ', salam hangat dari Radja Kukus Bali!')}`;

    tr.innerHTML = `
      <td><strong>${item.code}</strong></td>
      <td>${item.name}</td>
      <td>
        <a href="${waLink}" target="_blank" style="color:#25D366; font-weight:600;">
          💬 ${item.whatsapp}
        </a>
      </td>
      <td>${createdStr}</td>
      <td>${statusBadge}</td>
      <td>
        ${!isRedeemed ? `<button onclick="quickRedeemCode('${item.code}')" style="background:#1E4D2B; color:white; padding:4px 10px; border-radius:6px; font-weight:600; font-size:0.8rem;">Tebus Now</button>` : `<span style="font-size:0.8rem; color:#888;">${new Date(item.redeemedAt).toLocaleDateString('id-ID')}</span>`}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * Manual Voucher Search & Verification
 */
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

  // Table search bar
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
      <h3 style="color:#D32F2F;">❌ Kode Voucher Tidak Valid!</h3>
      <p>Kode <strong>${code}</strong> tidak terdaftar dalam sistem Radja Kukus Bali.</p>
    `;
    return;
  }

  const isRedeemed = voucher.status === 'SUDAH_DITEBUS';

  if (isRedeemed) {
    resultBox.className = 'redeem-result-card already';
    resultBox.innerHTML = `
      <h3 style="color:#D32F2F;">⚠️ Voucher Sudah Pernah Ditebus!</h3>
      <p><strong>Nama Pelanggan:</strong> ${voucher.name} (${voucher.whatsapp})</p>
      <p><strong>Kode:</strong> ${voucher.code}</p>
      <p><strong>Waktu Ditebus:</strong> ${new Date(voucher.redeemedAt).toLocaleString('id-ID')}</p>
    `;
  } else {
    resultBox.className = 'redeem-result-card success';
    resultBox.innerHTML = `
      <h3 style="color:#2E7D32;">✅ Voucher Valid (Siap Ditebus)</h3>
      <p style="margin-top:8px;"><strong>Nama Pelanggan:</strong> ${voucher.name}</p>
      <p><strong>No. WhatsApp:</strong> ${voucher.whatsapp}</p>
      <p><strong>Kode Unik:</strong> <span style="font-family:monospace; font-size:1.1rem; font-weight:bold;">${voucher.code}</span></p>
      <p><strong>Promo:</strong> ${voucher.discount}</p>
      <button onclick="confirmRedeem('${voucher.code}')" style="margin-top:12px; background:#1E4D2B; color:white; padding:10px 20px; border-radius:8px; font-weight:700; font-size:1rem; width:100%;">
        🎉 Konfirmasi Penukaran Voucher Sekarang
      </button>
    `;
  }
}

window.quickRedeemCode = function(code) {
  const inputCode = document.getElementById('input-verify-code');
  if (inputCode) inputCode.value = code;
  verifyVoucherCode(code);
  document.getElementById('admin-verify-container').scrollIntoView({ behavior: 'smooth' });
};

window.confirmRedeem = async function(code) {
  if (!confirm(`Konfirmasi penukaran voucher ${code} untuk pelanggan?`)) return;

  const result = await window.insforgeDB.redeemVoucher(code);
  if (result.success) {
    alert('🎉 Success! Voucher berhasil ditebus.');
    loadDashboardStats();
    loadLeadsTable();
    verifyVoucherCode(code); // re-render result box as redeemed
  } else {
    alert(result.message);
  }
};

/**
 * Camera QR Scanner Integration (html5-qrcode)
 */
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
      qrbox: { width: 250, height: 250 }
    },
    (decodedText) => {
      // Scanned successfully!
      console.log('Scanned QR:', decodedText);
      stopCameraScanner();

      // Extract code (in case decoded text is JSON or raw string)
      let code = decodedText;
      try {
        const parsed = JSON.parse(decodedText);
        if (parsed.code) code = parsed.code;
      } catch (e) {}

      document.getElementById('input-verify-code').value = code;
      verifyVoucherCode(code);
    },
    (errorMessage) => {
      // scanning... ignore frame errors
    }
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

/**
 * Export Leads to CSV File
 */
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

/**
 * Real-time BroadcastChannel sync across browser tabs
 */
function initBroadcastSync() {
  if (window.BroadcastChannel) {
    const bc = new BroadcastChannel('radja_kukus_sync');
    bc.onmessage = (event) => {
      if (event.data && event.data.type === 'SYNC_UPDATE') {
        console.log('Realtime sync update received');
        loadDashboardStats();
        loadLeadsTable();
      }
    };
  }
}
