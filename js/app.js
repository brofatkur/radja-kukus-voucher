/**
 * Public Application Logic - Radja Kukus Bali
 * High-Conversion Lead Magnet with Quota Counter, Social Proof Toasts, & WA Contact 087818720333
 */

const OFFICIAL_WA_NUMBER = '6287818720333'; // 087818720333

document.addEventListener('DOMContentLoaded', () => {
  initLeadForm();
  renderMenuCatalog('all');
  initCategoryFilters();
  updateQuotaUI();
  initCountdownTimer();
  initSocialProofToasts();
});

let currentGeneratedVoucher = null;

/**
 * Realtime Quota Counter & Progress Bar UI Update
 */
function updateQuotaUI() {
  if (!window.insforgeDB) return;
  const quota = window.insforgeDB.getQuotaInfo();

  const remainingElem = document.getElementById('quota-remaining-count');
  const totalElem = document.getElementById('quota-total-count');
  const barElem = document.getElementById('quota-progress-fill');
  const badgeElem = document.getElementById('quota-status-text');

  if (remainingElem) remainingElem.textContent = quota.remaining;
  if (totalElem) totalElem.textContent = quota.totalQuota;

  if (barElem) {
    barElem.style.width = `${quota.percentageClaimed}%`;
  }

  if (badgeElem) {
    if (quota.remaining <= 5) {
      badgeElem.textContent = '🔥 HAMPIR HABIS! Sisa beberapa voucher lagi!';
      badgeElem.style.color = '#FF4D4D';
    } else {
      badgeElem.textContent = `⚡ Terisi ${quota.percentageClaimed}% - Segera Klaim Sebelum Kehabisan!`;
    }
  }
}

/**
 * Countdown Timer to 26 Juli 2026 21:00 WITA
 */
function initCountdownTimer() {
  const hoursElem = document.getElementById('timer-hours');
  const minsElem = document.getElementById('timer-minutes');
  const secsElem = document.getElementById('timer-seconds');

  if (!hoursElem) return;

  // Target: 26 Juli 2026, 21:00:00 WITA (UTC+8)
  const targetDate = new Date('2026-07-26T21:00:00+08:00').getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      hoursElem.textContent = '00';
      minsElem.textContent = '00';
      secsElem.textContent = '00';
      return;
    }

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    hoursElem.textContent = String(hours).padStart(2, '0');
    minsElem.textContent = String(minutes).padStart(2, '0');
    secsElem.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/**
 * Social Proof Live Toast Notifications
 */
function initSocialProofToasts() {
  const toastContainer = document.getElementById('social-proof-container');
  if (!toastContainer) return;

  const proofList = [
    { name: 'Ni Wayan Putu', loc: 'Denpasar', time: '2 menit lalu' },
    { name: 'I Made Sudiarta', loc: 'Sanur', time: '5 menit lalu' },
    { name: 'Ketut Rai', loc: 'Kuta', time: '8 menit lalu' },
    { name: 'Gede Agus Pratama', loc: 'Jimbaran', time: '12 menit lalu' },
    { name: 'Ni Luh Gede', loc: 'Ubud', time: '15 menit lalu' },
    { name: 'Budi Santoso', loc: 'Denpasar Barat', time: '18 menit lalu' },
    { name: 'Dewa Nyoman', loc: 'Seminyak', time: '22 menit lalu' }
  ];

  let index = 0;

  function showNextToast() {
    const item = proofList[index % proofList.length];
    index++;

    const toast = document.createElement('div');
    toast.className = 'social-proof-toast';
    toast.innerHTML = `
      <div class="proof-avatar">🥟</div>
      <div class="proof-info">
        <p class="proof-text">🔥 <strong>${item.name}</strong> (${item.loc})</p>
        <p class="proof-sub">Baru saja mengklaim Voucher Traktir Kukusan! <span class="proof-time">• ${item.time}</span></p>
      </div>
    `;

    toastContainer.appendChild(toast);

    // Fade in
    setTimeout(() => toast.classList.add('show'), 100);

    // Auto remove after 4.5s
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

  // Show first toast after 3 seconds, then cycle every 7-10 seconds
  setTimeout(() => {
    showNextToast();
    setInterval(showNextToast, 8500);
  }, 3000);
}

function triggerNewUserSocialProof(name) {
  const toastContainer = document.getElementById('social-proof-container');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = 'social-proof-toast highlight';
  toast.innerHTML = `
    <div class="proof-avatar">🎉</div>
    <div class="proof-info">
      <p class="proof-text">✨ <strong>${name}</strong></p>
      <p class="proof-sub">Selamat! Voucher Traktir Anda Berhasil Dibuat!</p>
    </div>
  `;

  toastContainer.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 100);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 5000);
}

/**
 * Lead Form Handling
 */
function initLeadForm() {
  const form = document.getElementById('lead-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('customer-name');
    const phoneInput = document.getElementById('customer-wa');
    const btnSubmit = form.querySelector('.btn-submit-lead');

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();

    if (!name || !phone) {
      alert('Mohon lengkapi Nama dan Nomor WhatsApp Anda!');
      return;
    }

    if (phone.replace(/\D/g, '').length < 9) {
      alert('Nomor WhatsApp tidak valid. Mohon periksa kembali.');
      return;
    }

    // UI Loading state
    const originalText = btnSubmit.innerHTML;
    btnSubmit.innerHTML = '⏳ Memproses & Mengklaim Voucher...';
    btnSubmit.disabled = true;

    try {
      // Create voucher entry via Insforge DB / Local storage sync
      const voucher = await window.insforgeDB.createVoucher({
        name: name,
        whatsapp: phone
      });

      currentGeneratedVoucher = voucher;

      // Update realtime quota
      updateQuotaUI();

      // Render voucher details on UI
      renderVoucherCard(voucher);

      // Trigger high-conversion social proof celebration
      triggerNewUserSocialProof(name);

      // Reset form
      form.reset();

      // Show result section & smooth scroll
      const resultSec = document.getElementById('voucher-result-section');
      resultSec.style.display = 'block';
      resultSec.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (error) {
      console.error('Error generating voucher:', error);
      if (error.message === 'QUOTA_FULL') {
        alert('Mohon maaf, Kuota 100 Voucher untuk promo hari ini telah HABIS sepenuhnya!');
      } else {
        alert('Gagal membuat voucher. Silakan coba beberapa saat lagi.');
      }
    } finally {
      btnSubmit.innerHTML = originalText;
      btnSubmit.disabled = false;
    }
  });
}

/**
 * Render generated voucher card details & QR Code
 */
function renderVoucherCard(voucher) {
  document.getElementById('v-display-name').textContent = voucher.name;
  document.getElementById('v-display-code').textContent = voucher.code;

  // Fixed Expiry Display: 26 Juli 2026 (Jam 16.00 - 21.00 WITA)
  document.getElementById('v-display-expiry').textContent = '26 Juli 2026 (16.00 - 21.00 WITA)';

  // Render QR Code
  const qrContainer = document.getElementById('voucher-qrcode');
  qrContainer.innerHTML = '';

  if (window.QRCode) {
    new QRCode(qrContainer, {
      text: voucher.code,
      width: 110,
      height: 110,
      colorDark: '#7A1212',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
  } else {
    qrContainer.innerHTML = `<div style="font-size:0.8rem; padding:10px;">[QR: ${voucher.code}]</div>`;
  }

  // Setup WhatsApp Claim Button (Contact: 087818720333)
  const btnWA = document.getElementById('btn-wa-claim');
  if (btnWA) {
    const waText = encodeURIComponent(
      `Halo Admin Radja Kukus Bali (087818720333), saya mau klaim Voucher Traktir Kukusan & Dimsum!\n\n` +
      `*Nama*: ${voucher.name}\n` +
      `*Kode Voucher*: ${voucher.code}\n` +
      `*Berlaku*: 26 Juli 2026 (Jam 16.00 - 21.00 WITA)\n\n` +
      `Mohon konfirmasi ketersediaan meja/penukaran. Terima kasih!`
    );
    btnWA.href = `https://wa.me/${OFFICIAL_WA_NUMBER}?text=${waText}`;
    btnWA.target = '_blank';
  }

  // Setup Download Image Button
  const btnDownload = document.getElementById('btn-download-voucher');
  if (btnDownload) {
    btnDownload.onclick = () => downloadVoucherImage(voucher.code);
  }
}

/**
 * Export Voucher Card element as downloadable PNG image using html2canvas
 */
function downloadVoucherImage(code) {
  const cardElem = document.getElementById('voucher-printable-card');
  if (!cardElem) return;

  if (typeof html2canvas === 'undefined') {
    alert('Modul pengunduh gambar sedang dimuat, silakan coba 2 detik lagi.');
    return;
  }

  const btnDownload = document.getElementById('btn-download-voucher');
  const origBtnText = btnDownload.innerHTML;
  btnDownload.innerHTML = '⏳ Menyiapkan Gambar...';
  btnDownload.disabled = true;

  html2canvas(cardElem, {
    scale: 2,
    useCORS: true,
    backgroundColor: null
  }).then((canvas) => {
    const imageURI = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `Voucher_Radja_Kukus_${code}.png`;
    link.href = imageURI;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    btnDownload.innerHTML = '✅ Gambar Berhasil Diunduh!';
    setTimeout(() => {
      btnDownload.innerHTML = origBtnText;
      btnDownload.disabled = false;
    }, 2500);
  }).catch((err) => {
    console.error('Error generating canvas PNG:', err);
    alert('Terjadi kesalahan saat mengunduh gambar voucher.');
    btnDownload.innerHTML = origBtnText;
    btnDownload.disabled = false;
  });
}

/**
 * Catalog Menu Renderer with WA Contact 087818720333
 */
function renderMenuCatalog(categoryFilter = 'all') {
  const gridContainer = document.getElementById('menu-grid');
  if (!gridContainer || !window.RADJA_MENU_DATA) return;

  gridContainer.innerHTML = '';

  const filtered = categoryFilter === 'all'
    ? RADJA_MENU_DATA
    : RADJA_MENU_DATA.filter(item => item.category === categoryFilter);

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'menu-card';

    const orderText = encodeURIComponent(`Halo Radja Kukus Bali (087818720333), saya ingin pesan: ${item.name} (${item.price})`);

    card.innerHTML = `
      <div class="menu-img-wrapper">
        <img src="${item.image}" alt="${item.name}" class="menu-img" loading="lazy">
        ${item.badge ? `<span class="menu-badge">${item.badge}</span>` : ''}
      </div>
      <div class="menu-card-body">
        <h3 class="menu-card-title">${item.name}</h3>
        <p class="menu-card-desc">${item.description}</p>
        <div class="menu-card-footer">
          <span class="menu-price">${item.price}</span>
          <a href="https://wa.me/${OFFICIAL_WA_NUMBER}?text=${orderText}" target="_blank" class="btn-order-direct">
            Pesan WA 💬
          </a>
        </div>
      </div>
    `;
    gridContainer.appendChild(card);
  });
}

function initCategoryFilters() {
  const filterBtns = document.querySelectorAll('.category-tab-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-category');
      renderMenuCatalog(cat);
    });
  });
}
