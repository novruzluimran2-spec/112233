<!doctype html>
<html lang="ru">
<head>
 <meta charset="UTF-8" />
 <meta name="viewport" content="width=device-width, initial-scale=1"/>
 <meta name="description" content="Ресторан Antalya — турецкая кухня, доставка, самовывоз и бронирование столиков."/>
 <title>Antalya — ресторан турецкой кухни</title>

 <link rel="stylesheet" href="/styles.css"/>
 <script defer src="/app.js"></script>

 <!-- Простая favicon-иконка (SVG data-uri) -->
 <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect width='64' height='64' rx='14' fill='%23111'/%3E%3Cpath d='M18 41c10-14 18-14 28 0' fill='none' stroke='%23f2c14e' stroke-width='4' stroke-linecap='round'/%3E%3Ccircle cx='32' cy='23' r='8' fill='%23f2c14e'/%3E%3C/svg%3E"/>
</head>

<body>
 <a class="skip-link" href="#main">Перейти к содержимому</a>

 <header class="header header--choco" id="top">
  <div class="container header__row header__row--v2">
   <button class="iconBtn header__burger" id="menuBtn" type="button"
       aria-label="Открыть меню" aria-controls="navDrawer" aria-expanded="false">☰</button>

   <a class="brand" href="#top" aria-label="Antalya">
    <div class="brand__mark" aria-hidden="true">A</div>
    <div class="brand__text">
     <div class="brand__name">Antalya</div>
     <div class="brand__tag">турецкая кухня • гриль • десерты</div>
    </div>
   </a>

   <nav class="nav nav--desktop" aria-label="Основная навигация">
    <a href="/menu.html">Меню</a>
    <a href="/order.html">Заказ</a>
    <a href="/reserve.html">Бронирование</a>
    <a href="/about.html">О нас</a>
    <a href="/contacts.html">Контакты</a>
   </nav>

   <div class="header__actions header__actions--v2">
    <button class="btn btn--ghost" id="themeBtn" type="button" aria-label="Переключить тему">
     <span aria-hidden="true">🌓</span>
    </button>

    <button class="btn btn--ghost" id="cartBtn" type="button" aria-haspopup="dialog" aria-controls="cartDrawer">
     <span aria-hidden="true">🧺</span>
     <span class="btn__text">Корзина</span>
     <span class="badge" id="cartCount" aria-label="Товаров в корзине">0</span>
    </button>

    <div class="profile" id="profile">
     <button class="profile__btn" id="profileBtn" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="profileMenu">
      <span class="profile__avatar" aria-hidden="true">👤</span>
      <span class="profile__name">Гость</span>
      <span class="profile__chev" aria-hidden="true">▾</span>
     </button>

     <div class="profile__menu" id="profileMenu" role="menu" hidden>
      <button class="profile__item" role="menuitem" type="button" id="profileLogin">Войти / регистрация</button>
      <button class="profile__item" role="menuitem" type="button" id="profileOrders">Мои заказы</button>
      <a class="profile__item" role="menuitem" href="#reserve">Мои бронирования</a>
      <a class="profile__item" role="menuitem" href="#contacts">Связаться с нами</a>
     </div>
    </div>

    <a class="btn btn--primary" href="/reserve.html">Забронировать</a>
   </div>
  </div>
 </header>

 <!-- MOBILE NAV DRAWER -->
 <div class="drawer drawer--left" id="navDrawer" role="dialog" aria-modal="true" aria-label="Меню" aria-hidden="true">
  <div class="drawer__overlay" data-close="nav" tabindex="-1"></div>
  <div class="drawer__panel" role="document">
   <div class="drawer__head">
    <h3>Навигация</h3>
    <button class="iconBtn" type="button" data-close="nav" aria-label="Закрыть">✕</button>
   </div>
   <div class="drawer__body">
   <nav class="nav nav--mobile" aria-label="Навигация">
    <a href="/menu.html" data-close="nav">Меню</a>
    <a href="/order.html" data-close="nav">Заказ</a>
    <a href="/reserve.html" data-close="nav">Бронирование</a>
    <a href="/about.html" data-close="nav">О нас</a>
    <a href="/contacts.html" data-close="nav">Контакты</a>
   </nav>

    <div class="divider"></div>
    @include('partials.contact-drawer')
   </div>
  </div>
 </div>

 <main id="main">
 <!-- HERO -->
 <section class="hero">
 <div class="container hero__grid">
 <div class="hero__content">
 <p class="pill">🔥 Новое: сет “Кебаб-микс” • −10% при самовывозе</p>
 <h1>Antalya — вкус Турции рядом с вами</h1>
 <p class="hero__lead">
 Авторские мезе, сочные кебабы, свежая выпечка и десерты.
 Закажите онлайн или забронируйте столик — быстро и удобно.
 </p>

 <div class="hero__cta">
<a class="btn btn--primary" href="/menu.html">Смотреть меню</a>
<a class="btn btn--ghost" href="/order.html">Заказать онлайн</a>
 </div>

 <div class="hero__facts" role="list">
 <div class="fact" role="listitem">
 <div class="fact__top">⏱️ 35–55 мин</div>
 <div class="fact__sub">средняя доставка</div>
 </div>
 <div class="fact" role="listitem">
 <div class="fact__top">🥙 30+ блюд</div>
 <div class="fact__sub">классика и авторское</div>
 </div>
 <div class="fact" role="listitem">
 <div class="fact__top">⭐ 4.8/5</div>
 <div class="fact__sub">по отзывам гостей</div>
 </div>
 </div>
 </div>

 <div class="hero__card" aria-label="Карточка акции">
 <div class="hero__cardTop">
 <div class="hero__badge">Спецпредложение</div>
 <div class="hero__price">от 690 ₽</div>
 </div>
 <div class="hero__dish">
 <div class="dishArt" aria-hidden="true">
 <!-- декоративная "тарелка" SVG -->
 <svg viewBox="0 0 240 240" class="dishArt__svg">
 <circle cx="120" cy="120" r="92" fill="none" stroke="currentColor" stroke-width="10" opacity="0.25"/>
 <circle cx="120" cy="120" r="70" fill="none" stroke="currentColor" stroke-width="8" opacity="0.2"/>
 <path d="M70 120c18-26 34-26 52 0s34 26 52 0" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>
 <circle cx="95" cy="98" r="8" fill="currentColor" opacity="0.6"/>
 <circle cx="145" cy="98" r="8" fill="currentColor" opacity="0.6"/>
 </svg>
 </div>
 <div>
 <h3 class="hero__dishTitle">Кебаб-микс (сет)</h3>
 <p class="hero__dishText">3 вида кебаба + лаваш + соусы. Идеально на компанию.</p>
 </div>
 </div>
 <a class="btn btn--primary btn--wide" href="#order">Оформить заказ</a>
 <p class="muted small"></p>
 </div>
 </div>
 </section>

 <!-- MENU -->
 <section class="section" id="menu">
 <div class="container">
<div class="section__head">
<h2>Меню</h2>
<p class="muted">Фильтруйте блюда по категориям и добавляйте в корзину.</p>
</div>

<div class="menuPhoto" aria-label="Фото меню">
<img src="/images/menu.jpg" alt="Меню ресторана Antalya" loading="lazy"/>
</div>

<div class="toolbar" role="region" aria-label="Фильтры меню">
 <div class="chips" id="categoryChips" aria-label="Категории"></div>

 <div class="search">
 <input id="menuSearch" type="search" placeholder="Поиск по меню: кебаб, суп, десерт…" aria-label="Поиск по меню"/>
 <button class="btn btn--ghost" id="clearSearchBtn" type="button">Сброс</button>
 </div>
 </div>

 <div class="grid" id="menuGrid" aria-live="polite"></div>

 <div class="note">
 <strong>Подсказка:</strong> нажмите на блюдо, чтобы открыть описание и состав.
 </div>
 </div>
 </section>

 <!-- ORDER -->
 <section class="section section--alt" id="order">
 <div class="container">
 <div class="section__head">
 <h2>Онлайн-заказ</h2>
 <p class="muted">
 Оформляйте заказ онлайн: добавьте блюда в корзину и заполните данные для подтверждения.
 </p>
 </div>

 <div class="orderGrid">
 <div class="card">
 <h3>Как это работает</h3>
 <ol class="steps">
 <li>Выберите блюда в меню и добавьте в корзину.</li>
 <li>Откройте корзину, укажите способ получения.</li>
 <li>Нажмите “Оформить” — получите номер заказа (сохраняется в браузере).</li>
 </ol>

 <div class="miniStats">
 <div class="miniStat">
 <div class="miniStat__k">Доставка</div>
 <div class="miniStat__v">от 199 ₽</div>
 </div>
 <div class="miniStat">
 <div class="miniStat__k">Самовывоз</div>
 <div class="miniStat__v">−10%</div>
 </div>
 <div class="miniStat">
 <div class="miniStat__k">Время</div>
 <div class="miniStat__v">35–55 мин</div>
 </div>
 </div>

 <button class="btn btn--primary btn--wide" type="button" id="openCartFromOrder">
 Открыть корзину
 </button>
 </div>

 <div class="card">
 <h3>Последние заказы</h3>
 <p class="muted small">История хранится в вашем браузере.</p>

 <div class="ordersList" id="ordersList" aria-live="polite"></div>
 <button class="btn btn--ghost btn--wide" type="button" id="clearOrdersBtn">
 Очистить историю заказов
 </button>
 </div>
 </div>
 </div>
 </section>

 <!-- RESERVE -->
 <section class="section" id="reserve">
 <div class="container">
 <div class="section__head">
 <h2>Бронирование столика</h2>
 <p class="muted"></p>
 </div>

 <div class="reserveGrid">
 <form class="card form" id="reserveForm" novalidate>
 <div class="form__row">
 <label>
 Имя
 <input name="name" autocomplete="name" required minlength="2" placeholder="Например, Айгуль"/>
 </label>
 <label>
 Телефон
 <input name="phone" inputmode="tel" autocomplete="tel" required placeholder="+7 (___) ___-__-__"/>
 </label>
 </div>

 <div class="form__row">
 <label>
 Гостей
 <input name="guests" type="number" min="1" max="20" required value="2"/>
 </label>
 <label>
 Дата
 <input name="date" type="date" required/>
 </label>
 <label>
 Время
 <input name="time" type="time" required/>
 </label>
 </div>

 <label>
 Комментарий (по желанию)
 <textarea name="note" rows="3" placeholder="Детский стул, столик у окна, без лука…"></textarea>
 </label>

 <div class="form__actions">
 <button class="btn btn--primary" type="submit">Забронировать</button>
 <button class="btn btn--ghost" type="button" id="downloadIcsBtn">Скачать .ics</button>
 </div>

 <p class="muted small"></p>
 </form>

 <div class="card">
 <h3>Условия</h3>
 <ul class="bullets">
 <li>Бронь держим 15 минут.</li>
 <li>Компании от 8 гостей — предзаказ приветствуется.</li>
 <li>По просьбе подготовим свечи/десерт ко дню рождения.</li>
 </ul>

 <div class="divider"></div>

 <h3>Отзывы</h3>
 <div class="reviews" aria-label="Отзывы гостей">
 <div class="review" id="reviewText">“Очень сочный адана-кебаб, лаваш свежий, обслуживание быстрое.”</div>
 <div class="review__meta" id="reviewMeta">— Мария, 2 дня назад</div>
 <div class="review__actions">
 <button class="btn btn--ghost" type="button" id="prevReview">←</button>
 <button class="btn btn--ghost" type="button" id="nextReview">→</button>
 </div>
 </div>
 </div>
 </div>
 </div>
 </section>

 <!-- ABOUT -->
 <section class="section section--alt" id="about">
 <div class="container">
 <div class="section__head">
 <h2>О ресторане</h2>
 <p class="muted">
 Antalya — это уютный ресторан турецкой кухни с акцентом на качество ингредиентов
 и традиционные техники приготовления.
 </p>
 </div>

 <div class="aboutGrid">
 <div class="card">
 <h3>Концепция</h3>
 <p>
 Мы готовим кебабы на углях, мезе — из свежих овощей и специй, а выпечку
 — в течение дня небольшими партиями.
 </p>
 <div class="tags">
 <span class="tag">халяль-опции</span>
 <span class="tag">вегетарианские блюда</span>
 <span class="tag">домашние соусы</span>
 </div>
 </div>

 <div class="card">
 <h3>Часы работы</h3>
 <div class="hours">
 <div><span>Пн–Чт</span><strong>11:00–22:00</strong></div>
 <div><span>Пт–Сб</span><strong>11:00–23:00</strong></div>
 <div><span>Вс</span><strong>12:00–22:00</strong></div>
 </div>
 </div>

 <div class="card">
 <h3>Преимущества</h3>
 <ul class="bullets">
 <li>Быстрый онлайн-заказ (-реализация)</li>
 <li>Адаптивный интерфейс для телефона</li>
 <li>Корзина и история — в localStorage</li>
 <li>Темная/светлая тема</li>
 </ul>
 </div>
 </div>
 </div>
 </section>

 <!-- CONTACTS -->
 <section class="section" id="contacts">
 <div class="container">
 @include('partials.contacts-section')
 </div>
 </section>
 </main>

 <footer class="footer">
 <div class="container footer__row">
 <div class="footer__left">
 <div class="brand brand--small">
 <div class="brand__mark" aria-hidden="true">A</div>
 <div class="brand__text">
 <div class="brand__name">Antalya</div>
 <div class="brand__tag">© <span id="year"></span></div>
 </div>
 </div>
 </div>
 <div class="footer__right">
 <a href="#top">Наверх ↑</a>
 <span class="muted small">Турецкая кухня • Antalya</span>
 </div>
 </div>
 </footer>

 <!-- CART DRAWER -->
 <div class="drawer" id="cartDrawer" role="dialog" aria-modal="true" aria-label="Корзина" aria-hidden="true">
 <div class="drawer__overlay" data-close="drawer" tabindex="-1"></div>

 <div class="drawer__panel" role="document">
 <div class="drawer__head">
 <h3>Корзина</h3>
 <button class="iconBtn" type="button" data-close="drawer" aria-label="Закрыть">✕</button>
 </div>

 <div class="drawer__body">
 <div class="cartMeta">
 <label class="radio">
 <input type="radio" name="fulfillment" value="delivery" checked/>
 <span>Доставка</span>
 </label>
 <label class="radio">
 <input type="radio" name="fulfillment" value="pickup"/>
 <span>Самовывоз (−10%)</span>
 </label>
 </div>

 <div class="cartList" id="cartList" aria-live="polite"></div>

 <div class="cartEmpty" id="cartEmpty" hidden>
 <p><strong>Пока пусто.</strong> Добавьте блюда из меню 🙂</p>
<a class="btn btn--primary btn--wide" href="/menu.html" data-close="drawer">Перейти в меню</a>
 </div>

 <div class="cartTotals" id="cartTotals" hidden>
 <div class="totRow">
 <span>Сумма</span>
 <strong id="sumTotal">0 ₽</strong>
 </div>
 <div class="totRow">
 <span>Скидка/доставка</span>
 <strong id="sumAdjust">0 ₽</strong>
 </div>
 <div class="totRow totRow--final">
 <span>Итого</span>
 <strong id="sumGrand">0 ₽</strong>
 </div>

 <button class="btn btn--primary btn--wide" id="checkoutBtn" type="button">
 Оформить заказ
 </button>
 <button class="btn btn--ghost btn--wide" id="clearCartBtn" type="button">
 Очистить корзину
 </button>
 <p class="muted small"></p>
 </div>
 </div>
 </div>
 </div>

 <!-- DISH MODAL -->
 <div class="modal" id="dishModal" role="dialog" aria-modal="true" aria-label="Информация о блюде" aria-hidden="true">
 <div class="modal__overlay" data-close="modal" tabindex="-1"></div>
 <div class="modal__panel" role="document">
 <div class="modal__head">
 <h3 id="dishTitle">Блюдо</h3>
 <button class="iconBtn" type="button" data-close="modal" aria-label="Закрыть">✕</button>
 </div>
 <div class="modal__body">
<div class="dishImgWrap" id="dishImgWrap" hidden>
<img id="dishImg" alt="" loading="lazy"/>
</div>
<p class="muted" id="dishDesc"></p>
 <div class="dishInfo">
 <div><span class="muted small">Состав:</span> <strong id="dishIngredients"></strong></div>
 <div><span class="muted small">Порция:</span> <strong id="dishWeight"></strong></div>
 <div><span class="muted small">Ккал:</span> <strong id="dishKcal"></strong></div>
 </div>
 <div class="modal__actions">
 <button class="btn btn--primary" id="dishAddBtn" type="button">Добавить в корзину</button>
 <button class="btn btn--ghost" data-close="modal" type="button">Закрыть</button>
 </div>
 </div>
 </div>
 </div>

 <!-- CHECKOUT MODAL -->
 <div class="modal" id="checkoutModal" role="dialog" aria-modal="true" aria-label="Оформление заказа" aria-hidden="true">
 <div class="modal__overlay" data-close="checkout" tabindex="-1"></div>
 <div class="modal__panel" role="document">
 <div class="modal__head">
 <h3>Оформление</h3>
 <button class="iconBtn" type="button" data-close="checkout" aria-label="Закрыть">✕</button>
 </div>

 <div class="modal__body">
 <form class="form" id="checkoutForm" novalidate>
 <div class="form__row">
 <label>
 Имя
 <input name="name" autocomplete="name" required minlength="2" placeholder="Ваше имя"/>
 </label>
 <label>
 Телефон
 <input name="phone" inputmode="tel" autocomplete="tel" required placeholder="+7 (___) ___-__-__"/>
 </label>
 </div>

 <div class="form__row" id="addressRow">
 <label class="grow">
 Адрес доставки
 <input name="address" autocomplete="street-address" placeholder="Улица, дом, квартира"/>
 </label>
 </div>

 <div class="form__row">
 <label>
 Способ оплаты
 <select name="payment">
 <option value="card">Карта</option>
 <option value="cash">Наличные</option>
 </select>
 </label>

 <label>
 Комментарий
 <input name="note" placeholder="Например: без лука, домофон 12…"/>
 </label>
 </div>

 <div class="divider"></div>

 <div class="totRow totRow--final">
 <span>К оплате</span>
 <strong id="checkoutTotal">0 ₽</strong>
 </div>

 <button class="btn btn--primary btn--wide" type="submit">Подтвердить заказ</button>
 <p class="muted small"></p>
 </form>
 </div>
 </div>
 </div>

 <!-- TOAST -->
 <div class="toast" id="toast" role="status" aria-live="polite" aria-atomic="true" hidden></div>

 <!-- JSON-LD (структурированные данные) -->
 <script type="application/ld+json">
@verbatim
 {
 "@context": "https://schema.org",
 "@type": "Restaurant",
 "name": "Antalya",
 "servesCuisine": ["Turkish", "Mediterranean"],
 "priceRange": "$$",
 "telephone": "+7-993-907-22-47",
 "email": "imran.novruzlu.06@mail.ru",
 "address": {
 "@type": "PostalAddress",
 "addressLocality": "Волгоград",
 "streetAddress": "бульвар 30-летия Победы, 21"
 }
 }
@endverbatim
 </script>
</body>
</html>

