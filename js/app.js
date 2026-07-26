/**
 * Public Application Logic - Radja Kukus Bali
 * High-Conversion Lead Magnet with Native Mobile Gallery Save (Web Share API + iOS/Android Image Modal)
 */

const OFFICIAL_WA_NUMBER = '6287818720333';

document.addEventListener('DOMContentLoaded', () => {
  initHeroCTA();
  initLeadForm();
  renderMenuCatalog('all');
  initCategoryFilters();
  updateQuotaUI();
  initCountdownTimer();
  initSocialProofToasts();
  initImageGalleryModal();
});

let currentGeneratedVoucher = null;

/**
 * Trigger Fireworks Celebration Animation
 */
function launchFireworks() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
    }, 250);

    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 400);
  }
}

/**
 * Hero CTA Scroll to Lead Form
 */
function initHeroCTA() {
  const btnCTA = document.getElementById('btn-hero-cta');
  const leadFormCard = document.querySelector('.lead-form-card');

  if (btnCTA && leadFormCard) {
    btnCTA.addEventListener('click', () => {
      leadFormCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const nameInput = document.getElementById('customer-name');
      if (nameInput) {
        setTimeout(() => nameInput.focus(), 500);
      }
    });
  }
}

/**
 * Realtime Quota Counter & Dynamic Percentage Calculation
 */
function updateQuotaUI() {
  if (!window.insforgeDB) return;
  const quota = window.insforgeDB.getQuotaInfo();

  const remainingElem = document.getElementById('quota-remaining-count');
  const totalElem = document.getElementById('quota-total-count');
  const barElem = document.getElementById('quota-progress-fill');
  const percentElem = document.getElementById('quota-percent-text');
  const badgeElem = document.getElementById('quota-status-text');

  if (remainingElem) remainingElem.textContent = quota.remaining;
  if (totalElem) totalElem.textContent = quota.totalQuota;
  if (percentElem) percentElem.textContent = `${quota.percentageClaimed}%`;

  if (barElem) {
    barElem.style.width = `${quota.percentageClaimed}%`;
  }

  if (badgeElem) {
    if (quota.remaining <= 5) {
      badgeElem.innerHTML = `🔥 <strong>HAMPIR HABIS!</strong> Sisa <strong>${quota.remaining}</strong> voucher saja!`;
      badgeElem.style.color = '#FF3B30';
    } else {
      badgeElem.innerHTML = `⚡ <strong>${quota.percentageClaimed}% Terisi Realtime</strong> • Segera Klaim Sebelum Kehabisan!`;
      badgeElem.style.color = '#A81C1C';
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
    setTimeout(() => toast.classList.add('show'), 100);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

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
 * Lead Form Handling & Voucher Claim Trigger
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

    const originalText = btnSubmit.innerHTML;
    btnSubmit.innerHTML = '⏳ Memproses & Mengklaim Voucher...';
    btnSubmit.disabled = true;

    try {
      const voucher = await window.insforgeDB.createVoucher({
        name: name,
        whatsapp: phone
      });

      currentGeneratedVoucher = voucher;

      updateQuotaUI();
      renderVoucherCard(voucher);
      triggerNewUserSocialProof(name);
      launchFireworks();

      form.reset();

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

function renderVoucherCard(voucher) {
  document.getElementById('v-display-name').textContent = voucher.name;
  document.getElementById('v-display-code').textContent = voucher.code;
  document.getElementById('v-display-expiry').textContent = '26 Juli 2026 (16.00 - 21.00 WITA)';

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

  const btnDownload = document.getElementById('btn-download-voucher');
  if (btnDownload) {
    btnDownload.onclick = () => saveVoucherToMobileGallery(voucher.code);
  }
}

/**
 * Mobile-Optimized Direct Gallery Saver (Web Share API + Image Preview Modal Fallback)
 */
async function saveVoucherToMobileGallery(code) {
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

  try {
    const canvas = await html2canvas(cardElem, {
      scale: 3, // Ultra high res for clear QR Code
      useCORS: true,
      backgroundColor: '#7A1212'
    });

    const fileName = `Voucher_Radja_Kukus_${code}.png`;

    // 1. Try Native Web Share API (Triggers native iOS / Android share sheet -> Save to Photos / Gallery)
    canvas.toBlob(async (blob) => {
      if (!blob) {
        fallbackImageDownload(canvas, fileName);
        resetBtn();
        return;
      }

      const file = new File([blob], fileName, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: 'Voucher Radja Kukus Bali',
            text: 'Voucher Traktir Kukusan & Dimsum Radja Kukus Bali',
            files: [file]
          });
          btnDownload.innerHTML = '✅ Berhasil Tersimpan!';
          setTimeout(resetBtn, 2500);
          return;
        } catch (shareErr) {
          console.log('Share canceled or failed, running fallback', shareErr);
        }
      }

      // 2. Standard Download Link trigger
      fallbackImageDownload(canvas, fileName);
      
      // 3. Open Mobile Image Modal for long-press "Save Image to Photos"
      openGalleryImageModal(canvas.toDataURL('image/png'), fileName);

      btnDownload.innerHTML = '✅ Gambar Siap Disimpan!';
      setTimeout(resetBtn, 2500);
    }, 'image/png');

  } catch (err) {
    console.error('Error rendering canvas image:', err);
    alert('TIPS: Silakan lakukan SCREENSHOT layar kartu voucher ini dan tunjukkan ke kasir outlet Radja Kukus Bali.');
    resetBtn();
  }

  function resetBtn() {
    btnDownload.innerHTML = origBtnText;
    btnDownload.disabled = false;
  }
}

function fallbackImageDownload(canvas, fileName) {
  const imageURI = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = fileName;
  link.href = imageURI;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Mobile Image Modal with long-press "Save Image to Photos / Galeri" instructions
 */
function initImageGalleryModal() {
  const modal = document.getElementById('image-gallery-modal');
  const btnClose = document.getElementById('btn-close-img-modal');

  if (btnClose && modal) {
    btnClose.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }
}

function openGalleryImageModal(dataUrl, fileName) {
  const modal = document.getElementById('image-gallery-modal');
  const imgElem = document.getElementById('modal-voucher-img');
  const btnDownloadDirect = document.getElementById('btn-modal-download-direct');

  if (modal && imgElem) {
    imgElem.src = dataUrl;
    modal.style.display = 'flex';

    if (btnDownloadDirect) {
      btnDownloadDirect.href = dataUrl;
      btnDownloadDirect.download = fileName;
    }
  }
}

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
