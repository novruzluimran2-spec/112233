<div class="section__head">
 <h2>Контакты</h2>
 <p class="muted">Ресторан «Antalya» — Волгоград. Звоните, пишите или приходите в гости.</p>
</div>

<div class="contactsGrid">
 <div class="card">
  <h3>Мы на связи</h3>
  <div class="contactRow">
   <span class="contactRow__k">Телефон</span>
   <a class="contactRow__v" href="tel:{{ config('restaurant.phone') }}">{{ config('restaurant.phone_display') }}</a>
  </div>
  <div class="contactRow">
   <span class="contactRow__k">Email</span>
   <a class="contactRow__v" href="mailto:{{ config('restaurant.email') }}">{{ config('restaurant.email') }}</a>
  </div>
  <div class="contactRow">
   <span class="contactRow__k">Адрес</span>
   <span class="contactRow__v">{{ config('restaurant.address') }}</span>
  </div>
 </div>

 <div class="card mapCard" aria-label="Карта ресторана">
  <iframe
   class="mapFrame"
   src="{{ config('restaurant.map_embed') }}"
   title="Antalya на карте — {{ config('restaurant.address') }}"
   loading="lazy"
   allowfullscreen
  ></iframe>
  <p class="muted small mapLink">
   <a href="{{ config('restaurant.map_url') }}" target="_blank" rel="noopener noreferrer">Открыть в Яндекс Картах</a>
  </p>
 </div>
</div>
