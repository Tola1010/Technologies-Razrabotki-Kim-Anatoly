async function loadData() {
  try {
    const [dashRes, notifRes] = await Promise.all([
      fetch('data/dashboard.json'),
      fetch('data/notifications.json'),
    ]);

    if (!dashRes.ok || !notifRes.ok) {
      throw new Error('Не удалось загрузить данные');
    }

    const dashboard = await dashRes.json();
    const notifications = await notifRes.json();

    renderMetrics(dashboard.metrics);
    renderRows(dashboard.rows);
    renderNotifications(notifications);
  } catch (err) {
    console.error(err);
    showToast('Ошибка загрузки данных', 'danger');
  }
}

// ---------- 2. Карточки показателей ----------
function renderMetrics(metrics) {
  const container = document.getElementById('metrics');
  if (!container) return;

  container.innerHTML = metrics.map((m) => `
    <div class="col-12 col-md-6 col-xl-3">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <p class="text-muted mb-1">${escapeHtml(m.title)}</p>
          <p class="h3 mb-0">${escapeHtml(String(m.value))}</p>
        </div>
      </div>
    </div>
  `).join('');
}

// ---------- 3. Таблица последних действий ----------
function renderRows(rows) {
  const body = document.getElementById('recentBody');
  if (!body) return;

  body.innerHTML = rows.map((r) => `
    <tr>
      <th scope="row">${r.id}</th>
      <td>${escapeHtml(r.action)}</td>
      <td>${statusBadge(r.status)}</td>
    </tr>
  `).join('');
}

function statusBadge(status) {
  const map = {
    'Готово': 'success',
    'В работе': 'warning',
    'Новая': 'secondary',
  };
  const cls = map[status] || 'secondary';
  return `<span class="badge text-bg-${cls}">${escapeHtml(status)}</span>`;
}

// ---------- 4. Загрузка текста первого уведомления в toast ----------
let defaultToastText = 'Изменения сохранены';
function renderNotifications(notifications) {
  if (Array.isArray(notifications) && notifications[0]?.text) {
    defaultToastText = notifications[0].text;
  }
}

// ---------- 5. Toast через Bootstrap JS ----------
function showToast(text, variant = 'success') {
  const el = document.getElementById('saveToast');
  const textEl = document.getElementById('toastText');
  if (!el || !textEl) return;

  textEl.textContent = text || defaultToastText;

  el.classList.remove('text-bg-success', 'text-bg-warning', 'text-bg-danger');
  el.classList.add(`text-bg-${variant}`);

  const toast = bootstrap.Toast.getOrCreateInstance(el);
  toast.show();
}

// ---------- 6. Обработчик формы в модальном окне (добавление записи) ----------
function initAddForm() {
  const form = document.getElementById('addForm');
  const body = document.getElementById('recentBody');
  if (!form || !body) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const titleInput = document.getElementById('addTitle');
    const statusSelect = document.getElementById('addStatus');

    let valid = true;

    if (!titleInput.value || titleInput.value.trim().length < 2) {
      titleInput.classList.add('is-invalid');
      valid = false;
    } else {
      titleInput.classList.remove('is-invalid');
      titleInput.classList.add('is-valid');
    }

    if (!statusSelect.value) {
      statusSelect.classList.add('is-invalid');
      valid = false;
    } else {
      statusSelect.classList.remove('is-invalid');
      statusSelect.classList.add('is-valid');
    }

    if (!valid) {
      showToast('Проверьте обязательные поля', 'warning');
      return;
    }

    // Добавляем новую строку в таблицу
    const id = body.children.length + 1;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <th scope="row">${id}</th>
      <td>${escapeHtml(titleInput.value.trim())}</td>
      <td>${statusBadge(statusSelect.value)}</td>
    `;
    body.appendChild(tr);

    // Закрываем модальное окно через Bootstrap API
    const modalEl = document.getElementById('addModal');
    bootstrap.Modal.getOrCreateInstance(modalEl).hide();

    // Сбрасываем форму
    form.reset();
    form.querySelectorAll('.is-valid, .is-invalid').forEach((el) => {
      el.classList.remove('is-valid', 'is-invalid');
    });

    // Показываем toast
    showToast('Запись добавлена', 'success');
  });
}

// ---------- 7. Валидация быстрой формы (email) ----------
function initQuickForm() {
  const form = document.getElementById('quickForm');
  const email = document.getElementById('quickEmail');
  if (!form || !email) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!email.value || !email.checkValidity()) {
      email.classList.add('is-invalid');
      email.classList.remove('is-valid');
      showToast('Введите корректный email', 'warning');
      return;
    }

    email.classList.remove('is-invalid');
    email.classList.add('is-valid');

    showToast('Форма отправлена', 'success');
    form.reset();
  });
}

// ---------- 8. Счётчик действий в navbar ----------
function initCounter() {
  const link = document.querySelector('a[href="#recent"]');
  if (!link) return;

  const update = () => {
    const count = document.getElementById('recentBody')?.children.length ?? 0;
    link.textContent = `Действия (${count})`;
  };

  update();

  const body = document.getElementById('recentBody');
  if (body) {
    const observer = new MutationObserver(update);
    observer.observe(body, { childList: true });
  }
}

// ---------- 9. Экранирование HTML ----------
function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// ---------- 10. Инициализация после загрузки DOM ----------
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  initAddForm();
  initQuickForm();
  initCounter();
});