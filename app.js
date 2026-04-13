(function () {
  const STORAGE_KEY = 'rifa_elian_2026';
  const ADMIN_PASS = 'RifaEli2026';
  const TOTAL_NUMBERS = 20;
  const TOTAL_START = 441;
  const SORTEO_DATE = new Date('2026-04-29T20:00:00');

  const firebaseConfig = {
    apiKey: "AIzaSyC6YgTKYfhhSWwOLMFXyPz3iNoWhzx_sOU",
    authDomain: "rifa-elian-2026.firebaseapp.com",
    databaseURL: "https://rifa-elian-2026-default-rtdb.firebaseio.com",
    projectId: "rifa-elian-2026",
    storageBucket: "rifa-elian-2026.firebasestorage.app",
    messagingSenderId: "710331810842",
    appId: "1:710331810842:web:0493a6fa15c17f39707da3",
    measurementId: "G-JC9HSZYF5X"
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  const RIFA_REF = db.ref('rifa_elian_2026');

  RIFA_REF.on('value', (snapshot) => {
    const data = snapshot.val();
    if (data && data.numbers) {
      state.numbers = data.numbers;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      render();
    }
  });

  function saveToFirebase() {
    RIFA_REF.set({ numbers: state.numbers, lastUpdate: Date.now() });
  }

  const SOUNDS = [
    'https://www.myinstants.com/media/sounds/gracias-me-gusta-el-dinero.mp3',
    'https://www.myinstants.com/media/sounds/muchas-gracias.mp3',
    'https://www.myinstants.com/media/sounds/gracias-mi-estimado.mp3',
    'https://www.myinstants.com/media/sounds/thank-you-michael-scott.mp3',
    'https://www.myinstants.com/media/sounds/cr7-muchas-gracias-aficion.mp3'
  ];

  const GIFS = [
    'https://media.giphy.com/media/cdNSpL5vCU7aQrYnV/giphy.gif',
    'https://media.giphy.com/media/TdfyKrN7HGTIY/giphy.gif',
    'https://media.giphy.com/media/IglQkzvuewsoD6E1Pj/giphy.gif',
    'https://media.giphy.com/media/s2qXK8wAvkHTO/giphy.gif',
    'https://media.giphy.com/media/o75ajIFH0QnQC3nCeD/giphy.gif',
    'https://media.giphy.com/media/geslvCFM31sFW/giphy.gif',
    'https://media.giphy.com/media/iJgoGwkqb1mmH1mES3/giphy.gif',
    'https://media.giphy.com/media/hZj44bR9FVI3K/giphy.gif'
  ];

  const CELEBRATION_TEXT = '¡GRACIAS CRACK! 🎉';

  const frases = [
    "¡Ese número pica! 🔥",
    "Buena elección 👀",
    "Uff, número ganador 🏆",
    "¡Te lo sentís! 🍀",
    "Vamos con todo 💪",
    "Ese es EL número 🔮",
    "¡Qué ojo! 👁️",
    "¡Tío, este es el winner! 🦁",
    "Elian te lo va a agradecer 🙏",
    "¡Familia unite! 💪"
  ];

  let state = { numbers: {}, adminMode: false };
  let tapCount = 0;
  let tapTimer = null;

  document.getElementById('celebration-text').textContent = CELEBRATION_TEXT;

  function playRandomSound() {
    const sound = document.getElementById('sound-success');
    const randomSound = SOUNDS[Math.floor(Math.random() * SOUNDS.length)];
    sound.src = randomSound;
    sound.currentTime = 0;
    sound.play().catch(() => { });
  }

  function createConfetti() {
    const colors = ['#E63946', '#F4A261', '#2A9D8F', '#E9C46A', '#fff'];
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 2 + 's';
      confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 4000);
    }
  }

  function showCelebration(n) {
    const overlay = document.getElementById('celebration');
    const gifIndex = (n - 1) % GIFS.length;
    document.getElementById('celebration-gif').src = GIFS[gifIndex];

    overlay.style.display = 'flex';
    playRandomSound();
    createConfetti();

    setTimeout(() => {
      overlay.style.display = 'none';
    }, 3500);
  }

  function showRoulette(num, callback) {
    const overlay = document.getElementById('roulette');
    const numDisplay = document.getElementById('roulette-num');
    overlay.style.display = 'flex';

    let count = 0;
    const interval = setInterval(() => {
      const randomNum = Math.floor(Math.random() * TOTAL_NUMBERS) + 1;
      numDisplay.textContent = formatNum(randomNum);
      count++;
      if (count > 15) {
        clearInterval(interval);
        numDisplay.textContent = formatNum(num);
        setTimeout(() => {
          overlay.style.display = 'none';
          callback();
        }, 500);
      }
    }, 100);
  }

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) state = JSON.parse(saved);
    } catch (e) { }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) { }
    saveToFirebase();
  }

  function updateProgress() {
    let total = 0;
    let paid = 0;
    for (let i = 1; i <= TOTAL_NUMBERS; i++) {
      const num = state.numbers[i];
      if (num && (num.status === 'reserved' || num.status === 'paid')) {
        total++;
        if (num.status === 'paid') paid++;
      }
    }
    const percent = Math.round((total / TOTAL_NUMBERS) * 100);
    document.getElementById('progress-bar').style.setProperty('--progress', percent + '%');
    document.getElementById('progress-percent').textContent = percent + '%';
  }

  function updateCountdown() {
    const now = new Date();
    const diff = SORTEO_DATE - now;

    if (diff <= 0) {
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('mins').textContent = '00';
      document.getElementById('secs').textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('mins').textContent = String(mins).padStart(2, '0');
    document.getElementById('secs').textContent = String(secs).padStart(2, '0');
  }

  function formatNum(i) {
    return String(TOTAL_START + i - 1).padStart(3, '0');
  }

  function render() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';

    for (let i = 1; i <= TOTAL_NUMBERS; i++) {
      const num = state.numbers[i] || { status: 'available' };
      const btn = document.createElement('button');
      btn.textContent = formatNum(i);

      if (num.status === 'reserved') btn.className = 'reserved';
      else if (num.status === 'paid') btn.className = 'paid';

      if (num.name) {
        btn.setAttribute('data-name', num.name);
      }

      btn.onclick = () => handleClick(i);
      grid.appendChild(btn);
    }

    document.getElementById('admin-badge').style.display = state.adminMode ? 'block' : 'none';
    updateProgress();
  }

  function handleClick(n) {
    const num = state.numbers[n] || { status: 'available' };

    if (state.adminMode) {
      showAdminModal(n, num);
    } else {
      if (num.status === 'available') {
        showRoulette(n, () => showReserveModal(n));
      } else if (num.status === 'reserved') {
        showPaymentModal(n, num);
      } else {
        showInfoModal(n, num);
      }
    }
  }

  function randomFrase() {
    return frases[Math.floor(Math.random() * frases.length)];
  }

  function showReserveModal(n) {
    const content = document.getElementById('modal-content');
    content.innerHTML = `
      <div class="modal-center">
        <div class="icon">🎟️</div>
        <h3>Número ${formatNum(n)}</h3>
        <p class="sub">${randomFrase()}</p>
      </div>
      <input type="text" id="inp-name" placeholder="¿A nombre de quién va?">
      <div class="modal-buttons">
        <button onclick="closeModal()">Nah, paso</button>
        <button class="primary" onclick="confirmReserve(${n})">¡Lo quiero!</button>
      </div>
    `;
    document.getElementById('modal').style.display = 'block';
    setTimeout(() => document.getElementById('inp-name').focus(), 100);
  }

  window.confirmReserve = function (n) {
    const name = document.getElementById('inp-name').value.trim();

    if (!name) {
      alert('¡Poné tu nombre así sabemos quién gana!');
      return;
    }

    state.numbers[n] = { status: 'reserved', name };
    saveState();
    render();
    closeModal();

    showCelebration(n);

    setTimeout(() => {
      showPaymentModal(n, state.numbers[n]);
    }, 3500);
  };

  function showPaymentModal(n, num) {
    const content = document.getElementById('modal-content');
    const gifIndex = (n - 1) % GIFS.length;
    content.innerHTML = `
      <div class="modal-center">
        <img class="gif" src="${GIFS[gifIndex]}" alt="Gracias">
        <h3>¡Listo ${num.name}!</h3>
        <p class="sub">El <strong>${formatNum(n)}</strong> es tuyo, solo falta la transferencia</p>
        <div class="alias-box">
          <div class="label">Mandá $3.000 a</div>
          <div class="alias">Alda.elian.mp</div>
        </div>
        <p class="hint">Cuando llegue la plata te lo marcamos como pagado ✓</p>
        <button class="primary" onclick="closeModal()" style="width: 100%;">Dale, ya transfiero 💸</button>
      </div>
    `;
    document.getElementById('modal').style.display = 'block';
  }

  function showInfoModal(n, num) {
    const content = document.getElementById('modal-content');
    content.innerHTML = `
      <div class="modal-center">
        <div class="icon">✅</div>
        <h3>Número ${formatNum(n)}</h3>
        <p class="sub success">Ya está pagado por <strong>${num.name}</strong></p>
        <p class="hint">Elegí otro que queden 🍀</p>
        <button onclick="closeModal()" style="width: 100%;">Ver otros números</button>
      </div>
    `;
    document.getElementById('modal').style.display = 'block';
  }

  function showAdminModal(n, num) {
    const content = document.getElementById('modal-content');
    const statusText = num.status === 'available' ? 'Libre' : num.status === 'reserved' ? 'Reservado' : 'Pagado';
    const info = num.name ? `<p style="font-size: 15px; margin-bottom: 1rem;">👤 <strong>${num.name}</strong></p>` : '<p style="font-size: 14px; color: #999; margin-bottom: 1rem;">Sin reserva todavía</p>';

    content.innerHTML = `
      <div class="modal-center">
        <h3>🔧 Número ${formatNum(n)}</h3>
        <p class="sub">Estado: ${statusText}</p>
        ${info}
      </div>
      <div class="modal-admin-buttons">
        <button onclick="setStatus(${n}, 'available')" ${num.status === 'available' ? 'disabled' : ''}>Liberar número</button>
        <button class="reserved" onclick="setStatus(${n}, 'reserved')" ${num.status === 'reserved' ? 'disabled' : ''}>Marcar reservado</button>
        <button class="paid" onclick="setStatus(${n}, 'paid')" ${num.status === 'paid' ? 'disabled' : ''}>✓ Marcar pagado</button>
        <button onclick="closeModal()" style="margin-top: 0.5rem;">Cerrar</button>
      </div>
    `;
    document.getElementById('modal').style.display = 'block';
  }

  window.setStatus = function (n, status) {
    if (!state.numbers[n]) state.numbers[n] = {};
    state.numbers[n].status = status;
    if (status === 'available') {
      delete state.numbers[n].name;
    }
    saveState();
    render();
    closeModal();
  };

  window.closeModal = function () {
    document.getElementById('modal').style.display = 'none';
  };

  document.getElementById('modal').onclick = function (e) {
    if (e.target === this) closeModal();
  };

  document.getElementById('celebration').onclick = function () {
    this.style.display = 'none';
  };

  document.getElementById('main-title').onclick = function () {
    tapCount++;
    clearTimeout(tapTimer);
    tapTimer = setTimeout(() => { tapCount = 0; }, 1000);

    if (tapCount >= 3) {
      tapCount = 0;
      if (state.adminMode) {
        state.adminMode = false;
        document.getElementById('admin-panel').classList.remove('show');
        document.getElementById('admin-shortcut').style.display = 'block';
        render();
      } else {
        const pass = prompt('🔐 Clave secreta:');
        if (pass === ADMIN_PASS) {
          state.adminMode = true;
          document.getElementById('admin-panel').classList.add('show');
          document.getElementById('admin-shortcut').style.display = 'none';
          renderPendingList();
          render();
        }
      }
    }
  };

  document.getElementById('share-btn').onclick = function () {
    const text = '🎰 ¡Entrá a la rifa de Elian! 🥋\n\nAyudalo a cumplir su sueño. Cada número sale $3.000 y hay $300.000 en premios!\n\n';
    const url = window.location.href;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + url)}`;
    window.open(whatsappUrl, '_blank');
  };

  function toggleAdminPanel() {
    const panel = document.getElementById('admin-panel');
    const shortcut = document.getElementById('admin-shortcut');

    if (panel.classList.contains('show')) {
      panel.classList.remove('show');
      shortcut.style.display = 'block';
    } else {
      const pass = prompt('🔐 Clave admin:');
      if (pass === ADMIN_PASS) {
        panel.classList.add('show');
        shortcut.style.display = 'none';
        renderPendingList();
      } else {
        alert('Clave incorrecta');
      }
    }
  }

  window.toggleAdminPanel = toggleAdminPanel;

  function renderPendingList() {
    const list = document.getElementById('pending-list');
    const reserved = [];
    const paid = [];

    for (let i = 1; i <= TOTAL_NUMBERS; i++) {
      const num = state.numbers[i];
      if (num && num.status === 'reserved') {
        reserved.push({ num: i, name: num.name });
      } else if (num && num.status === 'paid') {
        paid.push({ num: i, name: num.name });
      }
    }

    if (reserved.length === 0 && paid.length === 0) {
      list.innerHTML = '<div class="no-pending">No hay reservas aún 📭</div>';
      return;
    }

    let html = '';

    if (reserved.length > 0) {
      html += `
        <div class="pending-section">
          <div class="pending-section-title reserved">
            ⏳ Reservas pendientes <span class="count">${reserved.length}</span>
          </div>
          ${reserved.map(p => `
            <div class="pending-item">
              <span class="num">${formatNum(p.num)}</span>
              <span class="name">${p.name}</span>
              <span class="status-badge reserved">esperando</span>
              <div class="actions">
                <button class="confirm-btn" onclick="confirmPayment(${p.num})">✓ Confirmar</button>
                <button class="cancel-btn" onclick="cancelReservation(${p.num})">✕ Cancelar</button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (paid.length > 0) {
      html += `
        <div class="pending-section">
          <div class="pending-section-title paid">
            ✅ Pagados <span class="count">${paid.length}</span>
          </div>
          ${paid.map(p => `
            <div class="pending-item">
              <span class="num">${formatNum(p.num)}</span>
              <span class="name">${p.name}</span>
              <span class="status-badge paid">pagado</span>
              <div class="actions">
                <button class="cancel-btn" onclick="cancelReservation(${p.num})">✕ Cancelar</button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    list.innerHTML = html;
  }

  window.confirmPayment = function (n) {
    if (!state.numbers[n]) return;
    state.numbers[n].status = 'paid';
    saveState();
    render();
    renderPendingList();
  };

  window.cancelReservation = function (n) {
    const numData = state.numbers[n];

    if (!numData) {
      alert('Error: número no encontrado en los datos');
      return;
    }

    const confirmText = prompt(`¿Cancelar número ${formatNum(n)} de ${numData.name}?\n\nEstado actual: ${numData.status}\n\nEscribí "CANCELAR" para confirmar:`);

    if (confirmText === 'CANCELAR') {
      delete state.numbers[n];
      saveState();
      render();
      renderPendingList();
      alert(`Número ${formatNum(n)} cancelado y liberado ✓`);
    } else if (confirmText !== null && confirmText !== 'CANCELAR') {
      alert('Texto incorrecto. Escribí "CANCELAR" para confirmar la cancelación.');
    }
  };

  loadState();
  render();
  updateCountdown();
  setInterval(updateCountdown, 1000);
})();
