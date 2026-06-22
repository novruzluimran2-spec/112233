<!doctype html>
<html lang="ru">
<head>
 <meta charset="UTF-8" />
 <meta name="viewport" content="width=device-width, initial-scale=1"/>
 <meta name="description" content="Бронирование столика — Antalya"/>
 <title>Бронирование — Antalya</title>
 <link rel="stylesheet" href="/styles.css"/>
 <script defer src="/app.js"></script>
</head>
<body>
 <a class="skip-link" href="#main">Перейти к содержимому</a>
 <header class="header header--choco" id="top">
  <div class="container header__row header__row--v2">
   <button class="iconBtn header__burger" id="menuBtn" type="button" aria-label="Открыть меню" aria-controls="navDrawer" aria-expanded="false">☰</button>
   <a class="brand" href="/index.html" aria-label="Antalya">
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
    <button class="btn btn--ghost" id="themeBtn" type="button" aria-label="Переключить тему"><span aria-hidden="true">🌓</span></button>
    <button class="btn btn--ghost" id="cartBtn" type="button" aria-haspopup="dialog" aria-controls="cartDrawer"><span aria-hidden="true">🧺</span><span class="btn__text">Корзина</span><span class="badge" id="cartCount" aria-label="Товаров в корзине">0</span></button>
    <div class="profile" id="profile">
     <button class="profile__btn" id="profileBtn" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="profileMenu">
      <span class="profile__avatar" aria-hidden="true">👤</span>
      <span class="profile__name">Гость</span>
      <span class="profile__chev" aria-hidden="true">▾</span>
     </button>
     <div class="profile__menu" id="profileMenu" role="menu" hidden>
      <button class="profile__item" role="menuitem" type="button" id="profileLogin">Войти / регистрация</button>
      <button class="profile__item" role="menuitem" type="button" id="profileOrders">Мои заказы</button>
      <a class="profile__item" role="menuitem" href="/reserve.html">Мои бронирования</a>
      <a class="profile__item" role="menuitem" href="/contacts.html">Связаться с нами</a>
     </div>
    </div>
    <a class="btn btn--primary" href="/reserve.html">Забронировать</a>
   </div>
  </div>
 </header>

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
  <section class="section" id="reserve">
   <div class="container">
    <div class="section__head">
     <h2>Бронирование столика</h2>
     <p class="muted"></p>
    </div>
    <div class="reserveGrid">
     <form class="card form" id="reserveForm" novalidate>
      <div class="form__row">
       <label>Имя<input name="name" autocomplete="name" required minlength="2" placeholder="Например, Айгуль"/></label>
       <label>Телефон<input name="phone" inputmode="tel" autocomplete="tel" required placeholder="+7 (___) ___-__-__"/></label>
      </div>
      <div class="form__row">
       <label>Гостей<input name="guests" type="number" min="1" max="20" required value="2"/></label>
       <label>Дата<input name="date" type="date" required/></label>
       <label>Время<input name="time" type="time" required/></label>
      </div>
      <label>Комментарий (по желанию)<textarea name="note" rows="3" placeholder="Детский стул, столик у окна, без лука…"></textarea></label>
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

 <!-- Shared drawers/modals -->
 <div class="drawer" id="cartDrawer" role="dialog" aria-modal="true" aria-label="Корзина" aria-hidden="true">
  <div class="drawer__overlay" data-close="drawer" tabindex="-1"></div>
  <div class="drawer__panel" role="document">
   <div class="drawer__head"><h3>Корзина</h3><button class="iconBtn" type="button" data-close="drawer" aria-label="Закрыть">✕</button></div>
   <div class="drawer__body">
    <div class="cartMeta">
     <label class="radio"><input type="radio" name="fulfillment" value="delivery" checked/><span>Доставка</span></label>
     <label class="radio"><input type="radio" name="fulfillment" value="pickup"/><span>Самовывоз (−10%)</span></label>
    </div>
    <div class="cartList" id="cartList" aria-live="polite"></div>
    <div class="cartEmpty" id="cartEmpty" hidden>
     <p><strong>Пока пусто.</strong> Добавьте блюда из меню 🙂</p>
     <a class="btn btn--primary btn--wide" href="/menu.html" data-close="drawer">Перейти в меню</a>
    </div>
    <div class="cartTotals" id="cartTotals" hidden>
     <div class="totRow"><span>Сумма</span><strong id="sumTotal">0 ₽</strong></div>
     <div class="totRow"><span>Скидка/доставка</span><strong id="sumAdjust">0 ₽</strong></div>
     <div class="totRow totRow--final"><span>Итого</span><strong id="sumGrand">0 ₽</strong></div>
     <button class="btn btn--primary btn--wide" id="checkoutBtn" type="button">Оформить заказ</button>
     <button class="btn btn--ghost btn--wide" id="clearCartBtn" type="button">Очистить корзину</button>
     <p class="muted small"></p>
    </div>
   </div>
  </div>
 </div>

 <div class="modal" id="dishModal" role="dialog" aria-modal="true" aria-label="Информация о блюде" aria-hidden="true">
  <div class="modal__overlay" data-close="modal" tabindex="-1"></div>
  <div class="modal__panel" role="document">
   <div class="modal__head"><h3 id="dishTitle">Блюдо</h3><button class="iconBtn" type="button" data-close="modal" aria-label="Закрыть">✕</button></div>
   <div class="modal__body">
    <div class="dishImgWrap" id="dishImgWrap" hidden><img id="dishImg" alt="" loading="lazy"/></div>
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

 <div class="modal" id="checkoutModal" role="dialog" aria-modal="true" aria-label="Оформление заказа" aria-hidden="true">
  <div class="modal__overlay" data-close="checkout" tabindex="-1"></div>
  <div class="modal__panel" role="document">
   <div class="modal__head"><h3>Оформление</h3><button class="iconBtn" type="button" data-close="checkout" aria-label="Закрыть">✕</button></div>
   <div class="modal__body">
    <form class="form" id="checkoutForm" novalidate>
     <div class="form__row">
      <label>Имя<input name="name" autocomplete="name" required minlength="2" placeholder="Ваше имя"/></label>
      <label>Телефон<input name="phone" inputmode="tel" autocomplete="tel" required placeholder="+7 (___) ___-__-__"/></label>
     </div>
     <div class="form__row" id="addressRow">
      <label class="grow">Адрес доставки<input name="address" autocomplete="street-address" placeholder="Улица, дом, квартира"/></label>
     </div>
     <div class="form__row">
      <label>Способ оплаты<select name="payment"><option value="card">Карта</option><option value="cash">Наличные</option></select></label>
      <label>Комментарий<input name="note" placeholder="Например: без лука, домофон 12…"/></label>
     </div>
     <div class="divider"></div>
     <div class="totRow totRow--final"><span>К оплате</span><strong id="checkoutTotal">0 ₽</strong></div>
     <button class="btn btn--primary btn--wide" type="submit">Подтвердить заказ</button>
     <p class="muted small"></p>
    </form>
   </div>
  </div>
 </div>

 <div class="toast" id="toast" role="status" aria-live="polite" aria-atomic="true" hidden></div>
</body>
</html>

