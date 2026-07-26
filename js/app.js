/**
 * Public Application Logic - Radja Kukus Bali
 * Handles Lead Capture, QR Code Voucher Generation, HTML2Canvas Download & Menu Renderer
 */

document.addEventListener('DOMContentLoaded', () => {
  initLeadForm();
  renderMenuCatalog('all');
  initCategoryFilters();
});

let currentGeneratedVoucher = null;

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
    btnSubmit.innerHTML = '⏳ Memproses Voucher...';
    btnSubmit.disabled = true;

    try {
      // Create voucher entry via Insforge DB / Local storage sync
      const voucher = await window.insforgeDB.createVoucher({
        name: name,
        whatsapp: phone
      });

      currentGeneratedVoucher = voucher;

      // Render voucher details on UI
      renderVoucherCard(voucher);

      // Reset form
      form.reset();

      // Show result section & smooth scroll
      const resultSec = document.getElementById('voucher-result-section');
      resultSec.style.display = 'block';
      resultSec.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (error) {
      console.error('Error generating voucher:', error);
      alert('Gagal membuat voucher. Silakan coba beberapa saat lagi.');
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

  const expDateStr = new Date(voucher.expiryDate).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  document.getElementById('v-display-expiry').textContent = expDateStr;

  // Render QR Code inside #voucher-qrcode
  const qrContainer = document.getElementById('voucher-qrcode');
  qrContainer.innerHTML = ''; // clear previous

  // The QR code contains verification URL payload
  const verificationPayload = JSON.stringify({
    code: voucher.code,
    name: voucher.name,
    wa: voucher.whatsapp,
    brand: 'Radja Kukus Bali'
  });

  if (window.QRCode) {
    new QRCode(qrContainer, {
      text: voucher.code, // encode voucher code for fast scanner parsing
      width: 110,
      height: 110,
      colorDark: '#7A1212',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
  } else {
    qrContainer.innerHTML = `<div style="font-size:0.8rem; padding:10px;">[QR: ${voucher.code}]</div>`;
  }

  // Setup WhatsApp Claim Button
  const btnWA = document.getElementById('btn-wa-claim');
  if (btnWA) {
    const waText = encodeURIComponent(
      `Halo Admin Radja Kukus Bali, saya mau klaim Voucher Traktir Kukusan & Dimsum!\n\n` +
      `*Nama*: ${voucher.name}\n` +
      `*Kode Voucher*: ${voucher.code}\n` +
      `*Berlaku S.d*: ${expDateStr}\n\n` +
      `Mohon konfirmasi ketersediaan meja/promo. Terima kasih!`
    );
    btnWA.href = `https://wa.me/6281234567890?text=${waText}`;
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
    scale: 2, // High resolution output
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
 * Catalog Menu Renderer
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

    const orderText = encodeURIComponent(`Halo Radja Kukus Bali, saya ingin pesan: ${item.name} (${item.price})`);

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
          <a href="https://wa.me/6281234567890?text=${orderText}" target="_blank" class="btn-order-direct">
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
