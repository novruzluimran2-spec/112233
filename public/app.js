/* Antalya — фронтенд (Laravel API)
   - Меню из /api/menu
   - Корзина + localStorage (гость)
   - Оформление заказа → POST /api/orders
   - Бронирование → POST /api/reservations + генерация .ics
   - Тема (dark/light)
*/

const STORAGE = {
  theme: "antalya_theme",
  cart: "antalya_cart_v1",
  orders: "antalya_orders_v1",
  reservation: "antalya_reservation_v1"
};

const API = {
  menu: "/api/menu",
  orders: "/api/orders",
  reservations: "/api/reservations",
  myOrders: "/api/my/orders",
  myReservations: "/api/my/reservations",
  register: "/api/register",
  login: "/api/login",
  logout: "/api/logout",
  user: "/api/user",
};

const STATUS_LABEL = {
  new: "Новый",
  accepted: "Принят",
  confirmed: "Подтверждён",
  completed: "Выполнен",
  cancelled: "Отменён",
};

const RUB = (n) => `${Math.round(n)} ₽`;
const uid = () => Math.random().toString(16).slice(2, 10).toUpperCase();

let MENU = [];
let IMAGES = {};
let CATEGORIES = ["Все"];

function normalizeAssetPath(p){
  if (!p) return null;
  const s = String(p);
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/")) return s;
  return "/" + s;
}

/** Кодирует каждый сегмент пути (имена файлов с кириллицей) — иначе на Linux/nginx картинки 404 */
function encodePathSegments(path){
  if (!path) return path;
  const s = String(path);
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("data:")) return s;
  const lead = s.startsWith("/") ? "/" : "";
  const rest = lead ? s.slice(1) : s;
  const parts = rest.split("/").filter(Boolean);
  return lead + parts.map((seg) => encodeURIComponent(seg)).join("/");
}

async function loadMenuFromApi(){
  const res = await fetch(API.menu, { headers: { "Accept": "application/json" }});
  if (!res.ok) throw new Error(`Menu API failed: ${res.status}`);
  const data = await res.json();

  const categories = Array.isArray(data?.categories) ? data.categories : [];
  const items = [];
  const images = {};

  categories.forEach((cat) => {
    const catTitle = cat?.title ?? "";
    (cat?.items || []).forEach((it) => {
      items.push({
        id: it.id,
        name: it.title,
        cat: catTitle,
        price: Number(it.price),
        weight: it.weight || "",
        kcal: it.kcal ?? "",
        tags: [],
        desc: it.description || "",
        ingredients: it.ingredients || ""
      });
      if (it.image){
        images[it.id] = normalizeAssetPath(it.image);
      }
    });
  });

  MENU = items;
  IMAGES = images;
  CATEGORIES = ["Все", ...Array.from(new Set(MENU.map(x => x.cat)))];
}

// Пытаемся загрузить картинку с запасными расширениями
function setImageWithFallback(imgEl, primarySrc){
  if (!imgEl || !primarySrc) return;
  const normalized = normalizeAssetPath(primarySrc);
  const exts = [".jfif", ".jpg", ".jpeg", ".png", ".webp"];
  const dotIdx = normalized.lastIndexOf(".");
  const base = dotIdx > -1 ? normalized.slice(0, dotIdx) : normalized;
  const primaryExt = dotIdx > -1 ? normalized.slice(dotIdx).toLowerCase() : "";
  const order = [];
  if (primaryExt && exts.includes(primaryExt)) order.push(primaryExt);
  exts.forEach(e => { if (!order.includes(e)) order.push(e); });
  let tryIdx = 0;
  function tryNext(){
    if (tryIdx >= order.length){
      const wrap = imgEl.closest(".menuItem__imgWrap, .dishImgWrap");
      if (wrap) wrap.hidden = true, (wrap.style.display = "none");
      return;
    }
    const nextSrc = encodePathSegments(base + order[tryIdx++]);
    const wrap = imgEl.closest(".menuItem__imgWrap, .dishImgWrap");
    if (wrap) wrap.hidden = false, (wrap.style.display = "");
    imgEl.onerror = tryNext;
    imgEl.src = nextSrc;
  }
  if (primaryExt){
    imgEl.onerror = tryNext;
    imgEl.src = encodePathSegments(base + primaryExt);
  } else {
    tryNext();
  }
}

const els = {
  year: document.getElementById("year"),

  categoryChips: document.getElementById("categoryChips"),
  menuGrid: document.getElementById("menuGrid"),
  menuSearch: document.getElementById("menuSearch"),
  clearSearchBtn: document.getElementById("clearSearchBtn"),

  cartBtn: document.getElementById("cartBtn"),
  cartDrawer: document.getElementById("cartDrawer"),
  cartList: document.getElementById("cartList"),
  cartEmpty: document.getElementById("cartEmpty"),
  cartTotals: document.getElementById("cartTotals"),
  cartCount: document.getElementById("cartCount"),
  sumTotal: document.getElementById("sumTotal"),
  sumAdjust: document.getElementById("sumAdjust"),
  sumGrand: document.getElementById("sumGrand"),
  clearCartBtn: document.getElementById("clearCartBtn"),
  checkoutBtn: document.getElementById("checkoutBtn"),
  openCartFromOrder: document.getElementById("openCartFromOrder"),

  dishModal: document.getElementById("dishModal"),
  dishTitle: document.getElementById("dishTitle"),
  dishDesc: document.getElementById("dishDesc"),
  dishIngredients: document.getElementById("dishIngredients"),
  dishWeight: document.getElementById("dishWeight"),
  dishKcal: document.getElementById("dishKcal"),
  dishAddBtn: document.getElementById("dishAddBtn"),
  dishImg: document.getElementById("dishImg"),
  dishImgWrap: document.getElementById("dishImgWrap"),

  checkoutModal: document.getElementById("checkoutModal"),
  checkoutForm: document.getElementById("checkoutForm"),
  checkoutTotal: document.getElementById("checkoutTotal"),
  addressRow: document.getElementById("addressRow"),

  ordersList: document.getElementById("ordersList"),
  clearOrdersBtn: document.getElementById("clearOrdersBtn"),
  ordersHistoryHint: document.getElementById("ordersHistoryHint"),

  reserveForm: document.getElementById("reserveForm"),
  myReservationsList: document.getElementById("myReservationsList"),
  downloadIcsBtn: document.getElementById("downloadIcsBtn"),

  toast: document.getElementById("toast"),
  themeBtn: document.getElementById("themeBtn"),

  reviewText: document.getElementById("reviewText"),
  reviewMeta: document.getElementById("reviewMeta"),
  prevReview: document.getElementById("prevReview"),
  nextReview: document.getElementById("nextReview"),
};

let state = {
  activeCategory: "Все",
  search: "",
  cart: loadJSON(STORAGE.cart, {}),   // {id: qty}
  orders: loadJSON(STORAGE.orders, []),
  dishModalId: null,
  theme: localStorage.getItem(STORAGE.theme) || "dark",
  fulfillment: "delivery",
  user: null,
  serverOrders: [],
  serverReservations: [],
  pendingAction: null,
};

const REVIEWS = [
  { text: "“Очень сочный адана-кебаб, лаваш свежий, обслуживание быстрое.”", meta:"— Мария, 2 дня назад" },
  { text: "“Пахлава — топ! И чай как в Турции. Вернёмся обязательно.”", meta:"— Илья, 1 неделю назад" },
  { text: "“Быстрая доставка, всё тёплое, соусы вкусные.”", meta:"— Алия, 3 недели назад" }
];
let reviewIdx = 0;

/* ---------- utils ---------- */
function loadJSON(key, fallback){
  try{
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  }catch{ return fallback; }
}
function save(){
  localStorage.setItem(STORAGE.cart, JSON.stringify(state.cart));
  localStorage.setItem(STORAGE.orders, JSON.stringify(state.orders));
}
function toast(msg){
  if (!els.toast) return;
  els.toast.textContent = msg;
  els.toast.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => (els.toast.hidden = true), 2200);
}
function setTheme(theme){
  state.theme = theme;
  document.documentElement.dataset.theme = theme === "light" ? "light" : "dark";
  localStorage.setItem(STORAGE.theme, state.theme);
}
function cartCount(){
  return Object.values(state.cart).reduce((a,b)=>a+b, 0);
}
function cartItems(){
  return Object.entries(state.cart)
    .map(([id, qty]) => ({ item: MENU.find(x => String(x.id) === String(id)), qty }))
    .filter(x => x.item && x.qty > 0);
}
function computeTotals(){
  const items = cartItems();
  const sum = items.reduce((acc, x) => acc + x.item.price * x.qty, 0);

  // delivery fee or pickup discount (UI only; server recalculates)
  let adjust = 0;
  if (items.length > 0){
    if (state.fulfillment === "delivery"){
      adjust = 199;
    } else {
      adjust = -Math.round(sum * 0.10);
    }
  }
  const grand = Math.max(0, sum + adjust);
  return { sum, adjust, grand };
}

/* ---------- rendering ---------- */
function renderChips(){
  if (!els.categoryChips) return;
  els.categoryChips.innerHTML = "";
  CATEGORIES.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "chip";
    btn.type = "button";
    btn.textContent = cat;
    btn.setAttribute("aria-pressed", String(state.activeCategory === cat));
    btn.addEventListener("click", () => {
      state.activeCategory = cat;
      render();
    });
    els.categoryChips.appendChild(btn);
  });
}

function renderMenu(){
  if (!els.menuGrid) return;
  const q = state.search.trim().toLowerCase();
  const filtered = MENU.filter(x => {
    const byCat = state.activeCategory === "Все" ? true : x.cat === state.activeCategory;
    const bySearch = !q ? true : (x.name + " " + x.desc + " " + (x.tags || []).join(" ")).toLowerCase().includes(q);
    return byCat && bySearch;
  });

  els.menuGrid.innerHTML = "";

  if (filtered.length === 0){
    const empty = document.createElement("div");
    empty.className = "card";
    empty.innerHTML = `<strong>Ничего не найдено</strong><p class="muted">Попробуйте изменить категорию или запрос.</p>`;
    els.menuGrid.appendChild(empty);
    return;
  }

  filtered.forEach(x => {
    const el = document.createElement("article");
    el.className = "card menuItem";
    el.tabIndex = 0;
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", `Открыть: ${x.name}`);

    el.innerHTML = `
      ${IMAGES[x.id] ? `<div class="menuItem__imgWrap"><img class="menuItem__img" alt="${escapeHtml(x.name)}" loading="lazy"/></div>` : ``}
      <div class="menuItem__top">
        <div>
          <h3 class="menuItem__name">${escapeHtml(x.name)}</h3>
          <div class="menuItem__meta">
            <span class="pill2">${escapeHtml(x.cat)}</span>
            <span class="pill2">${escapeHtml(x.weight)}</span>
          </div>
        </div>
        <div class="menuItem__price">${RUB(x.price)}</div>
      </div>
      <p class="menuItem__desc">${escapeHtml(x.desc)}</p>
      <div class="menuItem__meta">
        ${(x.tags || []).map(t => `<span class="pill2">${escapeHtml(t)}</span>`).join("")}
      </div>
      <div class="menuItem__actions">
        <button class="btn btn--primary" type="button" data-add="${x.id}">Добавить</button>
        <button class="iconBtn" type="button" aria-label="Подробнее">ℹ️</button>
      </div>
    `;

    const img = el.querySelector(".menuItem__img");
    if (img && IMAGES[x.id]){
      setImageWithFallback(img, IMAGES[x.id]);
    }

    el.addEventListener("click", (e) => {
      const addId = e.target?.dataset?.add;
      if (addId){
        addToCart(addId, 1);
        e.stopPropagation();
        return;
      }
      openDishModal(x.id);
    });

    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " "){
        e.preventDefault();
        openDishModal(x.id);
      }
    });

    els.menuGrid.appendChild(el);
  });
}

function renderCart(){
  if (!els.cartCount) return;
  const items = cartItems();
  els.cartCount.textContent = String(cartCount());

  if (els.cartList) els.cartList.innerHTML = "";

  if (items.length === 0){
    if (els.cartEmpty) els.cartEmpty.hidden = false;
    if (els.cartTotals) els.cartTotals.hidden = true;
    return;
  }
  if (els.cartEmpty) els.cartEmpty.hidden = true;
  if (els.cartTotals) els.cartTotals.hidden = false;

  items.forEach(({item, qty}) => {
    const row = document.createElement("div");
    row.className = "cartRow";
    row.innerHTML = `
      <div>
        <div class="cartRow__name">${escapeHtml(item.name)}</div>
        <div class="cartRow__sub">${escapeHtml(item.weight)} • ${RUB(item.price)}</div>
      </div>
      <div class="qty" aria-label="Количество">
        <button class="qty__btn" type="button" data-dec="${item.id}" aria-label="Уменьшить">−</button>
        <div class="qty__num" aria-label="Текущее количество">${qty}</div>
        <button class="qty__btn" type="button" data-inc="${item.id}" aria-label="Увеличить">+</button>
      </div>
    `;
    row.addEventListener("click", (e) => {
      if (e.target?.dataset?.dec) addToCart(e.target.dataset.dec, -1);
      if (e.target?.dataset?.inc) addToCart(e.target.dataset.inc, +1);
    });
    els.cartList?.appendChild(row);
  });

  const { sum, adjust, grand } = computeTotals();
  if (els.sumTotal) els.sumTotal.textContent = RUB(sum);

  const adjText = (adjust > 0 ? `+ ${RUB(adjust)}` : adjust < 0 ? `− ${RUB(Math.abs(adjust))}` : RUB(0));
  if (els.sumAdjust) els.sumAdjust.textContent = adjText;
  if (els.sumGrand) els.sumGrand.textContent = RUB(grand);
}

function renderOrders(){
  if (!els.ordersList) return;
  els.ordersList.innerHTML = "";

  const orders = state.user ? state.serverOrders : state.orders;
  if (!orders.length){
    const hint = state.user
      ? "Оформите заказ — он появится в вашем аккаунте."
      : "Оформите заказ — он появится здесь. Войдите, чтобы видеть историю на всех устройствах.";
    els.ordersList.innerHTML = `<div class="orderItem"><strong>Пока нет заказов</strong><div class="orderItem__sub">${hint}</div></div>`;
    return;
  }

  orders.slice(0, 6).forEach(o => {
    const status = o.status ? ` • ${STATUS_LABEL[o.status] || o.status}` : "";
    const el = document.createElement("div");
    el.className = "orderItem";
    el.innerHTML = `
      <div class="orderItem__top">
        <span>Заказ #${escapeHtml(o.number)}</span>
        <span>${escapeHtml(o.total)}</span>
      </div>
      <div class="orderItem__sub">${escapeHtml(o.when)} • ${escapeHtml(o.fulfillment)}${escapeHtml(status)}</div>
      <div class="orderItem__sub">${escapeHtml(o.itemsSummary)}</div>
    `;
    els.ordersList.appendChild(el);
  });
}

function renderMyReservations(){
  if (!els.myReservationsList) return;
  els.myReservationsList.innerHTML = "";

  if (!state.user){
    els.myReservationsList.innerHTML = `<div class="orderItem"><strong>Войдите в аккаунт</strong><div class="orderItem__sub">После входа здесь появятся ваши бронирования.</div></div>`;
    return;
  }

  if (!state.serverReservations.length){
    els.myReservationsList.innerHTML = `<div class="orderItem"><strong>Пока нет бронирований</strong><div class="orderItem__sub">Заполните форму выше — бронь сохранится в аккаунте.</div></div>`;
    return;
  }

  state.serverReservations.slice(0, 10).forEach(r => {
    const status = STATUS_LABEL[r.status] || r.status;
    const el = document.createElement("div");
    el.className = "orderItem";
    el.innerHTML = `
      <div class="orderItem__top">
        <span>${escapeHtml(r.date)} в ${escapeHtml(r.time)}</span>
        <span>${escapeHtml(r.guests)} гост.</span>
      </div>
      <div class="orderItem__sub">${escapeHtml(status)}${r.note ? ` • ${escapeHtml(r.note)}` : ""}</div>
    `;
    els.myReservationsList.appendChild(el);
  });
}

function renderReview(){
  if (!els.reviewText || !els.reviewMeta) return;
  const r = REVIEWS[reviewIdx % REVIEWS.length];
  els.reviewText.textContent = r.text;
  els.reviewMeta.textContent = r.meta;
}

function render(){
  if (els.categoryChips) renderChips();
  if (els.menuGrid) renderMenu();
  if (els.cartList || els.cartTotals || els.cartEmpty) renderCart();
  if (els.ordersList) renderOrders();
  if (els.myReservationsList) renderMyReservations();
}

/* ---------- interactions ---------- */
function addToCart(id, delta){
  const key = String(id);
  const cur = state.cart[key] || 0;
  const next = cur + delta;
  if (next <= 0) delete state.cart[key];
  else state.cart[key] = next;

  save();
  renderCart();

  const it = MENU.find(x => String(x.id) === String(id));
  if (delta > 0) toast(`Добавлено: ${it?.name || "блюдо"}`);
}

function openDrawer(){
  if (!els.cartDrawer) return;
  els.cartDrawer.setAttribute("aria-hidden", "false");
  els.cartDrawer.querySelector("button, [href], input")?.focus?.();
}
function closeDrawer(){
  if (!els.cartDrawer) return;
  els.cartDrawer.setAttribute("aria-hidden", "true");
  els.cartBtn?.focus?.();
}

function openDishModal(id){
  const it = MENU.find(x => String(x.id) === String(id));
  if (!it || !els.dishModal) return;
  state.dishModalId = it.id;
  if (els.dishTitle) els.dishTitle.textContent = it.name;
  if (els.dishDesc) els.dishDesc.textContent = it.desc;
  if (els.dishIngredients) els.dishIngredients.textContent = it.ingredients;
  if (els.dishWeight) els.dishWeight.textContent = it.weight;
  if (els.dishKcal) els.dishKcal.textContent = it.kcal;

  const imgSrc = IMAGES[it.id];
  if (imgSrc && els.dishImgWrap && els.dishImg){
    els.dishImgWrap.hidden = false;
    els.dishImg.alt = it.name;
    setImageWithFallback(els.dishImg, imgSrc);
  } else if (els.dishImgWrap && els.dishImg) {
    els.dishImgWrap.hidden = true;
    els.dishImg.removeAttribute("src");
    els.dishImg.alt = "";
  }

  els.dishModal.setAttribute("aria-hidden", "false");
  els.dishAddBtn?.focus?.();
}
function closeDishModal(){
  if (!els.dishModal) return;
  els.dishModal.setAttribute("aria-hidden", "true");
  state.dishModalId = null;
}

function prefillUserForms(){
  const u = state.user;
  if (!u) return;
  if (els.checkoutForm?.name) els.checkoutForm.name.value = u.name || "";
  if (els.checkoutForm?.phone) els.checkoutForm.phone.value = u.phone || "";
  if (els.reserveForm?.name) els.reserveForm.name.value = u.name || "";
  if (els.reserveForm?.phone) els.reserveForm.phone.value = u.phone || "";
}

function handleCheckoutClick(){
  const items = cartItems();
  if (!items.length){
    toast("Корзина пустая");
    return;
  }
  if (!state.user){
    state.pendingAction = "checkout";
    closeDrawer();
    openAuthModal(true);
    toast("Войдите или зарегистрируйтесь, чтобы оформить заказ");
    return;
  }
  openCheckout();
}

function openCheckout(){
  const items = cartItems();
  if (!items.length){
    toast("Корзина пустая");
    return;
  }
  prefillUserForms();
  const { grand } = computeTotals();
  if (els.checkoutTotal) els.checkoutTotal.textContent = RUB(grand);

  const isDelivery = state.fulfillment === "delivery";
  if (els.addressRow) els.addressRow.style.display = isDelivery ? "" : "none";
  if (els.checkoutForm?.address) els.checkoutForm.address.required = isDelivery;

  els.checkoutModal?.setAttribute("aria-hidden", "false");
  els.checkoutForm?.name?.focus?.();
}
function closeCheckout(){
  els.checkoutModal?.setAttribute("aria-hidden", "true");
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

/* ---------- forms ---------- */
function normalizePhone(raw){
  const digits = raw.replace(/[^\d+]/g, "");
  return digits;
}

function validateForm(form){
  let ok = true;
  const inputs = form.querySelectorAll("input,textarea,select");
  inputs.forEach(inp => {
    const valid = inp.checkValidity();
    inp.style.borderColor = valid ? "" : "var(--danger)";
    if (!valid) ok = false;
  });
  return ok;
}

function formatDateTimeLocal(dt = new Date()){
  const pad = (n) => String(n).padStart(2,"0");
  return `${pad(dt.getDate())}.${pad(dt.getMonth()+1)}.${dt.getFullYear()} ${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
}

/* ---------- ICS (reservation) ---------- */
function buildIcs({ name, date, time, guests }){
  const start = new Date(`${date}T${time}:00`);
  const end = new Date(start.getTime() + 90*60*1000);
  const toICS = (d) => {
    const pad = (n) => String(n).padStart(2,"0");
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
  };

  const uidStr = `${uid()}@antalya`;
  const now = toICS(new Date());
  const dtStart = toICS(start);
  const dtEnd = toICS(end);

  const summary = `Бронирование Antalya (${guests} гост.)`;
  const desc = `Имя: ${name}\nГостей: ${guests}\nПодтверждение: по телефону`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Antalya//RU",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uidStr}`,
    `DTSTAMP:${now}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${desc}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
}

function downloadFile(filename, content, mime="text/plain"){
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function submitOrderToApi(payload){
  const res = await fetch(API.orders, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "X-XSRF-TOKEN": csrfToken(),
    },
    body: JSON.stringify(payload)
  });

  const isJson = (res.headers.get("content-type") || "").includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok){
    const msg = data?.message || `Ошибка оформления заказа (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

async function submitReservationToApi(payload){
  const res = await fetch(API.reservations, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "X-XSRF-TOKEN": csrfToken(),
    },
    body: JSON.stringify(payload)
  });

  const isJson = (res.headers.get("content-type") || "").includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok){
    const msg = data?.message || `Ошибка бронирования (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

/* ---------- auth (регистрация / вход гостя) ---------- */
function csrfToken(){
  const raw = document.cookie.split("; ").find((c) => c.startsWith("XSRF-TOKEN="));
  return raw ? decodeURIComponent(raw.split("=")[1]) : "";
}

async function apiPost(url, body){
  const res = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "X-XSRF-TOKEN": csrfToken(),
    },
    body: JSON.stringify(body),
  });
  const isJson = (res.headers.get("content-type") || "").includes("application/json");
  const data = isJson ? await res.json() : null;
  if (!res.ok){
    const msg = data?.message
      || Object.values(data?.errors || {}).flat()?.[0]
      || `Ошибка запроса (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

function ensureAuthModal(){
  if (document.getElementById("authModal")) return;

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.id = "authModal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "Вход и регистрация");
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="modal__overlay" data-close="auth" tabindex="-1"></div>
    <div class="modal__panel" role="document">
      <div class="modal__head">
        <h3 id="authModalTitle">Вход</h3>
        <button class="iconBtn" type="button" data-close="auth" aria-label="Закрыть">✕</button>
      </div>
      <div class="modal__body">
        <form class="form" id="authLoginForm">
          <label>Email<input name="email" type="email" autocomplete="email" required placeholder="you@example.com"/></label>
          <label>Пароль<input name="password" type="password" autocomplete="current-password" required minlength="8" placeholder="Не менее 8 символов"/></label>
          <button class="btn btn--primary btn--wide" type="submit">Войти</button>
        </form>
        <form class="form" id="authRegisterForm" hidden>
          <label>Имя<input name="name" autocomplete="name" required minlength="2" placeholder="Ваше имя"/></label>
          <label>Телефон<input name="phone" inputmode="tel" autocomplete="tel" required placeholder="+7 (___) ___-__-__"/></label>
          <label>Email<input name="email" type="email" autocomplete="email" required placeholder="you@example.com"/></label>
          <label>Пароль<input name="password" type="password" autocomplete="new-password" required minlength="8" placeholder="Не менее 8 символов"/></label>
          <label>Повтор пароля<input name="password_confirmation" type="password" autocomplete="new-password" required minlength="8"/></label>
          <button class="btn btn--primary btn--wide" type="submit">Зарегистрироваться</button>
        </form>
        <p class="muted small" style="margin-top:12px;text-align:center">
          <button class="btn btn--ghost" type="button" id="authToggleMode">Нет аккаунта? Зарегистрироваться</button>
        </p>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const loginForm = modal.querySelector("#authLoginForm");
  const registerForm = modal.querySelector("#authRegisterForm");
  const toggleBtn = modal.querySelector("#authToggleMode");
  const title = modal.querySelector("#authModalTitle");
  let registerMode = false;

  function setAuthMode(register){
    registerMode = register;
    loginForm.hidden = register;
    registerForm.hidden = !register;
    title.textContent = register ? "Регистрация" : "Вход";
    toggleBtn.textContent = register ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться";
  }

  toggleBtn.addEventListener("click", () => setAuthMode(!registerMode));

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(loginForm);
    try{
      const data = await apiPost(API.login, {
        email: String(fd.get("email") || "").trim(),
        password: String(fd.get("password") || ""),
      });
      state.user = data.user;
      await afterAuthSuccess(`Добро пожаловать, ${state.user.name}!`);
    }catch(err){
      toast(err?.message || "Ошибка входа");
    }
  });

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(registerForm);
    try{
      const data = await apiPost(API.register, {
        name: String(fd.get("name") || "").trim(),
        phone: normalizePhone(String(fd.get("phone") || "")),
        email: String(fd.get("email") || "").trim(),
        password: String(fd.get("password") || ""),
        password_confirmation: String(fd.get("password_confirmation") || ""),
      });
      state.user = data.user;
      await afterAuthSuccess(`Регистрация успешна. Добро пожаловать, ${state.user.name}!`);
    }catch(err){
      toast(err?.message || "Ошибка регистрации");
    }
  });
}

function openAuthModal(register = false){
  ensureAuthModal();
  const modal = document.getElementById("authModal");
  const toggleBtn = document.getElementById("authToggleMode");
  if (toggleBtn){
    const loginForm = document.getElementById("authLoginForm");
    const registerForm = document.getElementById("authRegisterForm");
    const title = document.getElementById("authModalTitle");
    loginForm.hidden = register;
    registerForm.hidden = !register;
    title.textContent = register ? "Регистрация" : "Вход";
    toggleBtn.textContent = register ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться";
  }
  modal.setAttribute("aria-hidden", "false");
  modal.querySelector("input:not([hidden])")?.focus?.();
}

function closeAuthModal(){
  const modal = document.getElementById("authModal");
  if (!modal) return;
  modal.setAttribute("aria-hidden", "true");
}

async function afterAuthSuccess(message){
  renderProfile();
  prefillUserForms();
  await fetchAccountData();
  closeAuthModal();
  toast(message);
  const action = state.pendingAction;
  state.pendingAction = null;
  if (action === "checkout") openCheckout();
  else if (action === "reservation") await submitReservationForm();
}

function renderProfile(){
  const profileName = document.querySelector(".profile__name");
  const profileAvatar = document.querySelector(".profile__avatar");
  const profileLogin = document.getElementById("profileLogin");
  let profileLogout = document.getElementById("profileLogout");
  let profileEmail = document.getElementById("profileEmail");

  if (profileName){
    profileName.textContent = state.user?.name || "Гость";
  }

  if (profileAvatar){
    const initial = state.user?.name?.trim()?.[0]?.toUpperCase();
    profileAvatar.textContent = initial || "👤";
  }

  if (!profileEmail && profileLogin?.parentElement){
    profileEmail = document.createElement("div");
    profileEmail.className = "profile__item profile__item--meta";
    profileEmail.id = "profileEmail";
    profileEmail.setAttribute("role", "presentation");
    profileLogin.parentElement.insertBefore(profileEmail, profileLogin);
  }
  if (profileEmail){
    profileEmail.textContent = state.user?.email || "";
    profileEmail.hidden = !state.user?.email;
  }

  if (!profileLogout && profileLogin?.parentElement){
    profileLogout = document.createElement("button");
    profileLogout.className = "profile__item";
    profileLogout.type = "button";
    profileLogout.id = "profileLogout";
    profileLogout.setAttribute("role", "menuitem");
    profileLogout.textContent = "Выйти";
    profileLogin.parentElement.insertBefore(profileLogout, profileLogin.nextSibling);
    profileLogout.addEventListener("click", async () => {
      try{
        await apiPost(API.logout, {});
      }catch(_e){ /* ignore */ }
      state.user = null;
      state.serverOrders = [];
      state.serverReservations = [];
      state.pendingAction = null;
      renderProfile();
      renderOrders();
      renderMyReservations();
      if (els.clearOrdersBtn) els.clearOrdersBtn.hidden = false;
      if (els.ordersHistoryHint){
        els.ordersHistoryHint.textContent = "Без входа история хранится в браузере. Войдите, чтобы видеть заказы на всех устройствах.";
      }
      toast("Вы вышли из аккаунта");
    });
  }

  if (profileLogin) profileLogin.hidden = !!state.user;
  if (profileLogout) profileLogout.hidden = !state.user;
  if (els.clearOrdersBtn) els.clearOrdersBtn.hidden = !!state.user;
  if (els.ordersHistoryHint && state.user){
    els.ordersHistoryHint.textContent = "История заказов привязана к вашему аккаунту.";
  }
}

async function fetchAccountData(){
  if (!state.user){
    state.serverOrders = [];
    state.serverReservations = [];
    renderOrders();
    renderMyReservations();
    return;
  }
  try{
    const [ordersRes, resRes] = await Promise.all([
      fetch(API.myOrders, { credentials: "same-origin", headers: { Accept: "application/json" } }),
      fetch(API.myReservations, { credentials: "same-origin", headers: { Accept: "application/json" } }),
    ]);
    if (ordersRes.ok){
      const data = await ordersRes.json();
      state.serverOrders = data.orders || [];
    }
    if (resRes.ok){
      const data = await resRes.json();
      state.serverReservations = data.reservations || [];
    }
    renderOrders();
    renderMyReservations();
  }catch(_e){
    /* offline */
  }
}

async function submitReservationForm(){
  if (!els.reserveForm) return;
  if (!validateForm(els.reserveForm)){
    toast("Проверьте поля бронирования");
    return;
  }

  const payload = {
    name: els.reserveForm.name.value.trim(),
    phone: normalizePhone(els.reserveForm.phone.value),
    guests: Number(els.reserveForm.guests.value),
    date: els.reserveForm.date.value,
    time: els.reserveForm.time.value,
    note: els.reserveForm.note.value.trim() || null,
  };

  await submitReservationToApi(payload);
  localStorage.setItem(STORAGE.reservation, JSON.stringify({ ...payload, createdAt: new Date().toISOString() }));
  await fetchAccountData();
  toast("Бронь создана ✅");
}

async function fetchCurrentUser(){
  try{
    const res = await fetch(API.user, {
      credentials: "same-origin",
      headers: { "Accept": "application/json" },
    });
    if (!res.ok) return;
    const data = await res.json();
    state.user = data?.user || null;
    renderProfile();
    prefillUserForms();
    await fetchAccountData();
  }catch(_e){
    /* offline / static */
  }
}

/* ---------- init ---------- */
async function init(){
  if (els.year) els.year.textContent = String(new Date().getFullYear());

  setTheme(state.theme);
  els.themeBtn?.addEventListener("click", () => {
    setTheme(state.theme === "light" ? "dark" : "light");
    toast(state.theme === "light" ? "Светлая тема" : "Тёмная тема");
  });

  try{
    await loadMenuFromApi();
  }catch(e){
    console.error(e);
    toast("Не удалось загрузить меню");
  }

  // profile menu
  const profileBtn = document.getElementById("profileBtn");
  const profileMenu = document.getElementById("profileMenu");
  const profileLogin = document.getElementById("profileLogin");
  const profileOrders = document.getElementById("profileOrders");
  const profileReservations = document.getElementById("profileReservations");

  function openProfileMenu(){
    if (!profileMenu || !profileBtn) return;
    profileMenu.hidden = false;
    profileBtn.setAttribute("aria-expanded","true");
  }
  function closeProfileMenu(){
    if (!profileMenu || !profileBtn) return;
    profileMenu.hidden = true;
    profileBtn.setAttribute("aria-expanded","false");
  }

  profileBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!profileMenu) return;
    profileMenu.hidden ? openProfileMenu() : closeProfileMenu();
  });

  profileLogin?.addEventListener("click", () => {
    closeProfileMenu();
    openAuthModal(false);
  });

  await fetchCurrentUser();
  ensureAuthModal();

  profileOrders?.addEventListener("click", () => {
    closeProfileMenu();
    location.href = "/order.html";
  });

  profileReservations?.addEventListener("click", () => {
    closeProfileMenu();
    if (location.pathname.includes("reserve")){
      document.getElementById("myReservations")?.scrollIntoView({ behavior: "smooth" });
    } else {
      location.href = "/reserve.html#myReservations";
    }
  });

  document.addEventListener("click", (e) => {
    if (!profileMenu || profileMenu.hidden) return;
    const profile = document.getElementById("profile");
    if (profile && !profile.contains(e.target)) closeProfileMenu();
  });

  // search
  els.menuSearch?.addEventListener("input", (e) => {
    state.search = e.target.value;
    if (els.menuGrid) renderMenu();
  });
  els.clearSearchBtn?.addEventListener("click", () => {
    state.search = "";
    if (els.menuSearch) els.menuSearch.value = "";
    if (els.menuGrid) renderMenu();
    toast("Поиск сброшен");
  });

  // drawer open/close
  els.cartBtn?.addEventListener("click", openDrawer);
  els.openCartFromOrder?.addEventListener("click", openDrawer);

  // nav drawer (mobile)
  const navDrawer = document.getElementById("navDrawer");
  const menuBtn = document.getElementById("menuBtn");

  function openNav(){
    if (!navDrawer) return;
    navDrawer.setAttribute("aria-hidden","false");
    menuBtn?.setAttribute("aria-expanded","true");
    navDrawer.querySelector("a,button")?.focus?.();
  }
  function closeNav(){
    if (!navDrawer) return;
    navDrawer.setAttribute("aria-hidden","true");
    menuBtn?.setAttribute("aria-expanded","false");
    menuBtn?.focus?.();
  }

  menuBtn?.addEventListener("click", openNav);

  // overlay close
  document.addEventListener("click", (e) => {
    const close = e.target?.dataset?.close;
    if (close === "drawer") closeDrawer();
    if (close === "modal") closeDishModal();
    if (close === "checkout") closeCheckout();
    if (close === "auth") closeAuthModal();
    if (close === "nav") closeNav();
  });

  // esc close
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (els.checkoutModal?.getAttribute("aria-hidden") === "false") closeCheckout();
    else if (document.getElementById("authModal")?.getAttribute("aria-hidden") === "false") closeAuthModal();
    else if (els.dishModal?.getAttribute("aria-hidden") === "false") closeDishModal();
    else if (els.cartDrawer?.getAttribute("aria-hidden") === "false") closeDrawer();
    else if (navDrawer?.getAttribute("aria-hidden") === "false") closeNav();
    else {
      if (profileMenu && !profileMenu.hidden) {
        profileMenu.hidden = true;
        profileBtn?.setAttribute("aria-expanded","false");
      }
    }
  });

  // dish add
  els.dishAddBtn?.addEventListener("click", () => {
    if (!state.dishModalId) return;
    addToCart(state.dishModalId, 1);
    closeDishModal();
  });

  // fulfillment
  els.cartDrawer?.querySelectorAll('input[name="fulfillment"]')?.forEach(r => {
    r.addEventListener("change", () => {
      state.fulfillment = els.cartDrawer.querySelector('input[name="fulfillment"]:checked')?.value || "delivery";
      renderCart();
    });
  });

  // clear cart
  els.clearCartBtn?.addEventListener("click", () => {
    state.cart = {};
    save();
    renderCart();
    toast("Корзина очищена");
  });

  // checkout
  els.checkoutBtn?.addEventListener("click", handleCheckoutClick);

  els.checkoutForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!state.user){
      state.pendingAction = "checkout";
      closeCheckout();
      openAuthModal(true);
      toast("Войдите или зарегистрируйтесь, чтобы оформить заказ");
      return;
    }
    if (!validateForm(els.checkoutForm)){
      toast("Проверьте поля оформления");
      return;
    }

    const items = cartItems();
    if (!items.length){
      toast("Корзина пустая");
      return;
    }

    const fulfillmentText = state.fulfillment === "delivery" ? "Доставка" : "Самовывоз";
    const name = els.checkoutForm.name.value.trim();
    const phone = normalizePhone(els.checkoutForm.phone.value);
    const address = (state.fulfillment === "delivery") ? (els.checkoutForm.address.value.trim() || "") : "";
    const payment = els.checkoutForm.payment.value;
    const note = els.checkoutForm.note.value.trim();

    try{
      const apiPayload = {
        customer_name: name,
        phone,
        delivery_type: state.fulfillment,
        address: state.fulfillment === "delivery" ? address : null,
        payment_method: payment,
        note: note || null,
        items: items.map(x => ({ menu_item_id: x.item.id, qty: x.qty }))
      };
      const result = await submitOrderToApi(apiPayload);

      const { grand } = computeTotals();
      const order = {
        number: String(result?.id ?? uid()),
        when: formatDateTimeLocal(new Date()),
        fulfillment: fulfillmentText,
        total: RUB(grand),
        itemsSummary: items.map(x => `${x.item.name} ×${x.qty}`).join(", ")
      };

      state.cart = {};
      save();

      if (state.user){
        await fetchAccountData();
      } else {
        state.orders.unshift(order);
        state.orders = state.orders.slice(0, 20);
        save();
        renderOrders();
      }

      closeCheckout();
      closeDrawer();
      renderCart();
      toast(`Заказ #${order.number} оформлен ✅`);
      els.checkoutForm.reset();
      prefillUserForms();
    }catch(err){
      console.error(err);
      if (err?.message?.includes("войти") || err?.message?.includes("зарегистр")){
        state.pendingAction = "checkout";
        closeCheckout();
        openAuthModal(true);
      }
      toast(err?.message || "Ошибка оформления заказа");
    }
  });

  // orders clear
  els.clearOrdersBtn?.addEventListener("click", () => {
    if (state.user){
      toast("История заказов хранится в аккаунте");
      return;
    }
    state.orders = [];
    save();
    renderOrders();
    toast("История заказов очищена");
  });

  // reservation
  if (els.reserveForm){
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth()+1).padStart(2,"0");
    const dd = String(today.getDate()).padStart(2,"0");
    const minDate = `${yyyy}-${mm}-${dd}`;
    if (els.reserveForm.date) els.reserveForm.date.min = minDate;
    if (els.reserveForm.time) els.reserveForm.time.value = "19:00";

    els.reserveForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!state.user){
        state.pendingAction = "reservation";
        openAuthModal(true);
        toast("Войдите или зарегистрируйтесь, чтобы забронировать столик");
        return;
      }
      try{
        await submitReservationForm();
      }catch(err){
        console.error(err);
        if (err?.message?.includes("войти") || err?.message?.includes("зарегистр")){
          state.pendingAction = "reservation";
          openAuthModal(true);
        }
        toast(err?.message || "Ошибка бронирования");
      }
    });
  }

  if (location.hash === "#myReservations"){
    document.getElementById("myReservations")?.scrollIntoView({ behavior: "smooth" });
  }

  els.downloadIcsBtn?.addEventListener("click", () => {
    if (!els.reserveForm){
      toast("Сначала откройте страницу бронирования");
      return;
    }
    let name = els.reserveForm.name.value.trim();
    let date = els.reserveForm.date.value;
    let time = els.reserveForm.time.value;
    let guests = els.reserveForm.guests.value || "2";

    if (!name || !date || !time){
      const saved = loadJSON(STORAGE.reservation, null);
      if (saved){
        name = name || saved.name;
        date = date || saved.date;
        time = time || saved.time;
        guests = guests || saved.guests;
      }
    }
    if (!name || !date || !time){
      toast("Сначала заполните форму бронирования");
      return;
    }

    const ics = buildIcs({ name, date, time, guests });
    downloadFile(`reservation-antalya-${date}.ics`, ics, "text/calendar");
    toast("Файл .ics скачан");
  });

  // reviews
  if (els.reviewText && els.reviewMeta){
    renderReview();
    els.prevReview?.addEventListener("click", () => { reviewIdx = (reviewIdx - 1 + REVIEWS.length) % REVIEWS.length; renderReview(); });
    els.nextReview?.addEventListener("click", () => { reviewIdx = (reviewIdx + 1) % REVIEWS.length; renderReview(); });
  }

  // smooth hash scroll (nice)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", () => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      if (els.cartDrawer?.getAttribute("aria-hidden") === "false") closeDrawer();
    });
  });

  render();
}

init();

