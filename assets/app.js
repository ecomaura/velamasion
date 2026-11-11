/* Vela Maison storefront logic. In Shopify: products -> {{ collection.products }}, cart -> /cart/add.js & /cart.js */
const FREE_SHIP = 1499;
const PRODUCTS = [
  {id:'fresh', name:'Fresh', family:'Air', cat:'Fresh', price:899, img:'assets/fresh.jpg', notes:'Sea salt, white tea, green leaves', tag:'Bestseller',
   desc:'A breath of clarity. Light, refreshing and effortlessly elegant, made for moments when you want to feel renewed.', top:'Bergamot, sea salt', heart:'White tea, jasmine', base:'Soft musk, driftwood'},
  {id:'coffee', name:'Coffee', family:'Earth', cat:'Coffee', price:899, img:'assets/coffee.jpg', notes:'Roasted coffee, vanilla bean, cacao', tag:'Most loved',
   desc:'A feeling of warmth. Rich, comforting and familiar, bringing depth and grounding to your surroundings.', top:'Espresso, cardamom', heart:'Roasted coffee, cacao', base:'Vanilla bean, amber'},
  {id:'sweet', name:'Sweet', family:'Water', cat:'Sweet', price:899, img:'assets/sweet.jpg', notes:'Water lily, honey, soft vanilla', tag:'New',
   desc:'A moment of softness. Delicate, smooth and indulgent, created for slower moments and quiet pleasures.', top:'Pear, lily petals', heart:'Honey, peony', base:'Soft vanilla, sandalwood'},
  {id:'spice', name:'Spice', family:'Fire', cat:'Spice', price:899, img:'assets/spice.jpg', notes:'Cinnamon, star anise, clove', tag:'Winter favourite',
   desc:'A spark of intensity. Warm, expressive and captivating, designed to awaken the senses and transform the atmosphere.', top:'Orange peel, clove', heart:'Cinnamon, star anise', base:'Cedar, tonka bean'},
  {id:'set', name:'The Four Elements Set', family:'Gift set', cat:'Set', price:3299, img:'assets/lineup.jpg', notes:'All four candles in a gift box', tag:'Save ₹297',
   desc:'Air, Earth, Water and Fire together: Fresh, Coffee, Sweet and Spice, boxed with a handwritten note.', top:'Fresh · Coffee', heart:'Sweet · Spice', base:'Gift box with note'}
];
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const money=n=>'₹'+n.toLocaleString('en-IN');
let cart=[]; try{cart=JSON.parse(localStorage.getItem('vm-cart')||'[]')}catch(e){}
const save=()=>{try{localStorage.setItem('vm-cart',JSON.stringify(cart))}catch(e){}};

function renderGrid(f='All'){
  $('#productGrid').innerHTML=PRODUCTS.filter(p=>f==='All'||p.cat===f).map(p=>`
  <article class="card">
    <div class="card__img" data-view="${p.id}" tabindex="0" role="button" aria-label="View ${p.name}"><img src="${p.img}" alt="${p.name} candle by Vela Maison" loading="lazy"><span class="card__tag">${p.tag}</span></div>
    <div class="card__body"><h3>${p.name}</h3><p class="card__notes">${p.notes}</p>
    <div class="card__row"><span class="price">${money(p.price)}</span><button class="add" data-add="${p.id}">Add to cart</button></div></div>
  </article>`).join('');
}
function renderCart(){
  const items=cart.map(c=>({...c,p:PRODUCTS.find(p=>p.id===c.id)}));
  const total=items.reduce((s,i)=>s+i.p.price*i.q,0), count=items.reduce((s,i)=>s+i.q,0);
  $('[data-cart-count]').textContent=count; $('#cartTotal').textContent=money(total);
  $('#cartItems').innerHTML=items.length?items.map(i=>`<div class="line"><img src="${i.p.img}" alt="">
    <div><h4>${i.p.name}</h4><small>${i.p.family} · ${money(i.p.price)}</small>
    <div class="qty"><button data-dec="${i.id}" aria-label="Decrease">−</button><span>${i.q}</span><button data-inc="${i.id}" aria-label="Increase">+</button></div>
    <button class="rm" data-rm="${i.id}">Remove</button></div><strong>${money(i.p.price*i.q)}</strong></div>`).join('')
    :`<div class="empty"><p>Your cart is empty.</p><a class="btn" href="#collection" data-close>Shop candles</a></div>`;
  const left=FREE_SHIP-total;
  $('#shipNote').innerHTML=!items.length?'Free shipping on orders over '+money(FREE_SHIP):left>0?`Add ${money(left)} more for free shipping<i><b style="width:${total/FREE_SHIP*100}%"></b></i>`:`You've unlocked free shipping<i><b style="width:100%"></b></i>`;
  save();
}
function add(id){const c=cart.find(x=>x.id===id);c?c.q++:cart.push({id,q:1});renderCart();
  const b=$('[data-cart-count]');b.classList.add('bump');setTimeout(()=>b.classList.remove('bump'),250);
  toast(PRODUCTS.find(p=>p.id===id).name+' added to cart');}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),2200);}
function drawer(open){$('#cart').classList.toggle('on',open);$('.overlay').classList.toggle('on',open);$('#cart').setAttribute('aria-hidden',!open);}
function view(id){const p=PRODUCTS.find(x=>x.id===id);
  $('#modalBox').innerHTML=`<button class="modal__x" data-close-modal aria-label="Close">✕</button><img src="${p.img}" alt="${p.name} candle">
  <div class="modal__info"><h2>${p.name}</h2><span class="price">${money(p.price)}</span><p>${p.desc}</p>
  <dl><dt>Top</dt><dd>${p.top}</dd><dt>Heart</dt><dd>${p.heart}</dd><dt>Base</dt><dd>${p.base}</dd><dt>Size</dt><dd>${p.id==='set'?'4 × 200 g':'200 g · 45+ hours'}</dd></dl>
  <button class="btn" data-add="${p.id}" data-close-modal>Add to cart</button></div>`;
  $('#modal').classList.add('on');$('#modal').setAttribute('aria-hidden','false');}
const closeModal=()=>{$('#modal').classList.remove('on');$('#modal').setAttribute('aria-hidden','true');};

document.addEventListener('click',e=>{
  const t=e.target.closest('button,a,[data-view],.modal');if(!t)return;
  const d=t.dataset;
  if(d.add){add(d.add)} if(d.view)view(d.view);
  if(d.inc){cart.find(x=>x.id===d.inc).q++;renderCart()}
  if(d.dec){const c=cart.find(x=>x.id===d.dec);c.q--;if(c.q<1)cart=cart.filter(x=>x!==c);renderCart()}
  if(d.rm){cart=cart.filter(x=>x.id!==d.rm);renderCart()}
  if('cartOpen' in d)drawer(true); if('close' in d)drawer(false);
  if('closeModal' in d||t.id==='modal')closeModal();
  if('menuToggle' in d)$('#nav').classList.toggle('on');
  if(t.closest('#nav'))$('#nav').classList.remove('on');
  if(d.filter){const f=d.filter;renderGrid(f);$$('.chip').forEach(c=>c.classList.toggle('is-active',c.dataset.filter===f));}
  if(t.id==='checkoutBtn')toast(cart.length?'This is a demo store. Checkout connects once the theme is live on Shopify.':'Add a candle to your cart first.');
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){drawer(false);closeModal()}
  if((e.key==='Enter'||e.key===' ')&&e.target.dataset.view){e.preventDefault();view(e.target.dataset.view)}
});
$('#newsForm').addEventListener('submit',e=>{e.preventDefault();const v=$('#email').value.trim();
  $('#newsMsg').textContent=/^\S+@\S+\.\S+$/.test(v)?'Thank you. Your 10% code is on its way to '+v+'.':'Enter a valid email address, like name@example.com.';
  if(/^\S+@\S+\.\S+$/.test(v))e.target.reset();});
renderGrid();renderCart();
