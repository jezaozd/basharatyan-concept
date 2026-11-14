(() => {
 'use strict';
 const reduce = matchMedia('(prefers-reduced-motion: reduce)');
 const plates = [...document.querySelectorAll('.score-voice img')];
 const rhythms = {
  colour: {main:'lookbook.webp',left:'jackets.webp',detail:'chiffon.webp',alt:'Розовое платье и летящий тренч BASHARATYAN V',caption:'Цвет, который остаётся в памяти.'},
  line: {main:'dress.webp',left:'shirts.webp',detail:'brocade.jpg',alt:'Платье с поясом и тонкой клеткой в Париже',caption:'Точные линии. Ваш собственный почерк.'},
  ease: {main:'jackets.webp',left:'lookbook.webp',detail:'lavender.webp',alt:'Свободный тренч BASHARATYAN V на морском берегу',caption:'Свобода — в каждом движении.'}
 };
 const rhythmButtons = [...document.querySelectorAll('[data-rhythm]')];
 let revision = 0;
 rhythmButtons.forEach(button => button.addEventListener('click', async () => {
  const key = button.dataset.rhythm;
  if (button.getAttribute('aria-pressed') === 'true') return;
  const ownRevision = ++revision;
  const data = rhythms[key];
  const files = [data.left, data.main, data.detail];
  // Decode before switching so the wipe never exposes an empty image.
  const prepared = await Promise.all(files.map(file => {
   const image = new Image(); image.src = 'assets/' + file;
   return image.decode().then(() => image).catch(() => null);
  }));
  if (ownRevision !== revision || prepared.some(image => !image)) return;
  rhythmButtons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  plates.forEach((plate, index) => {
   plate.src = prepared[index].src;
   if(index === 1) plate.alt = data.alt;
   else if(index === 0) plate.alt = 'Образ BASHARATYAN V: ' + (key === 'line' ? 'рубашка' : key === 'ease' ? 'платье и тренч' : 'свободный тренч');
   else plate.alt = 'Фактура ткани BASHARATYAN V';
   if (!reduce.matches && plate.animate) plate.animate([
    {clipPath:'inset(0 0 92% 0)',transform:'translateY(15px)'},
    {clipPath:'inset(0 0 0% 0)',transform:'translateY(0)'}
   ],{duration:950,delay:index*90,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});
  });
  document.querySelector('#score-caption').textContent = data.caption;
 }));
 const fabrics = {
  chiffon: ['chiffon.webp','Светлый шифон крупным планом'],
  lavender: ['lavender.webp','Лавандовая ткань из палитры BASHARATYAN V'],
  brocade: ['brocade.jpg','Золотистая парча из палитры BASHARATYAN V']
 };
 let fabricRevision = 0;
 document.querySelectorAll('[data-fabric]').forEach(button => button.addEventListener('click', async () => {
  const [src,alt] = fabrics[button.dataset.fabric];
  const ownRevision = ++fabricRevision;
  const image = new Image(); image.src = 'assets/' + src;
  try { await image.decode(); } catch { return; }
  if (ownRevision !== fabricRevision) return;
  document.querySelectorAll('[data-fabric]').forEach(b => b.setAttribute('aria-pressed',String(b === button)));
  const plate = document.querySelector('#fabric-image'); plate.src = image.src; plate.alt = alt;
  if(!reduce.matches && plate.animate) plate.animate([{clipPath:'inset(0 85% 0 0)'},{clipPath:'inset(0 0 0 0)'}],{duration:750,easing:'cubic-bezier(.16,1,.3,1)'});
 }));
 const interest = document.querySelector('#interest');
 const city = document.querySelector('#city');
 const link = document.querySelector('#appointment-link');
 function prepareMessage() {
  const text = 'Здравствуйте! Хочу познакомиться с BASHARATYAN V.\nИнтересует: ' + interest.value + '.\nУдобный формат: ' + city.value + '.\nПодскажите, пожалуйста, как договориться о встрече или консультации.';
  link.href = 'https://wa.me/971585115830?text=' + encodeURIComponent(text);
 }
 [interest,city].forEach(field => field.addEventListener('change',prepareMessage));
 document.querySelectorAll('[data-intent]').forEach(a => a.addEventListener('click',() => {interest.value = a.dataset.intent; prepareMessage();}));
 document.querySelector('.header-appointment').addEventListener('click',() => {interest.value='Личная примерка';prepareMessage();});
 document.querySelector('#appointment-form').addEventListener('submit',event => event.preventDefault());
 prepareMessage();
})();
