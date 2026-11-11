/* Vela Maison storefront logic. In Shopify: products -> {{ collection.products }}, cart -> /cart/add.js & /cart.js */
const FREE_SHIP = 1499;
const PRODUCTS = [
  {id:'fresh', name:'Fresh', family:'Air', price:899, img:'assets/fresh.jpg', desc:'A breath of clarity. Light, refreshing and effortlessly elegant, created for moments when you want to feel renewed.'},
  {id:'coffee', name:'Coffee', family:'Earth', price:899, img:'assets/coffee.jpg', desc:'A feeling of warmth. Rich, comforting and familiar, bringing depth and grounding to your surroundings.'},
  {id:'sweet', name:'Sweet', family:'Water', price:899, img:'assets/sweet.jpg', desc:'A moment of softness. Delicate, smooth and indulgent, created for slower moments and quiet pleasures.'},
  {id:'spice', name:'Spice', family:'Fire', price:899, img:'assets/spice.jpg', desc:'A spark of intensity. Warm, expressive and captivating, designed to awaken the senses and transform the atmosphere.'}
];
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const money=n=>'₹'+n.toLocaleString('en-IN');
let cart=[]; try{cart=JSON.parse(localStorage.getItem('vm-cart')||'[]')}catch(e){}
const save=()=>{try{localStorage.setItem('vm-cart',JSON.stringify(cart))}catch(e){}};

function renderGrid(){
  $('#productGrid').innerHTML=PRODUCTS.map(p=>`
  <article class="card">
    <div class="card__img" data-view="${p.id}" tabindex="0" role="button" aria-label="View ${p.name}"><img src="${p.img}" alt="${p.name} candle by Vela Maison" loading="lazy"><button class="card__add" data-add="${p.id}">Add to cart</button></div>
    <div class="card__meta"><div><h3>${p.name}</h3><small>${p.family}</small></div><span class="card__price">${money(p.price)}</span></div>
  </article>`).join('');
}
function renderCart(){
  const items=cart.map(c=>({...c,p:PRODUCTS.find(p=>p.id===c.id)}));
  const total=items.reduce((s,i)=>s+i.p.price*i.q,0), count=items.reduce((s,i)=>s+i.q,0);
  $('[data-cart-count]').textContent=count; $('#cartTotal').textContent=money(total);
  $('#cartItems').innerHTML=items.length?items.map(i=>`<div class="line"><img src="${i.p.img}" alt="">
    <div><h4>${i.p.name}</h4><small>${money(i.p.price)}</small>
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
  <dl><dt>Family</dt><dd>${p.family}</dd><dt>Vessel</dt><dd>Amber glass, walnut lid</dd></dl>
  <button class="btn" data-add="${p.id}" data-close-modal>Add to cart</button></div>`;
  $('#modal').classList.add('on');$('#modal').setAttribute('aria-hidden','false');}
const closeModal=()=>{$('#modal').classList.remove('on');$('#modal').setAttribute('aria-hidden','true');};

document.addEventListener('click',e=>{
  const t=e.target.closest('button,a,[data-view],.modal');if(t&&t.dataset.view&&t.tagName==='A')e.preventDefault();if(!t)return;
  const d=t.dataset;
  if(d.add){e.stopPropagation();add(d.add)} else if(d.view)view(d.view);
  if(d.inc){cart.find(x=>x.id===d.inc).q++;renderCart()}
  if(d.dec){const c=cart.find(x=>x.id===d.dec);c.q--;if(c.q<1)cart=cart.filter(x=>x!==c);renderCart()}
  if(d.rm){cart=cart.filter(x=>x.id!==d.rm);renderCart()}
  if('cartOpen' in d)drawer(true); if('close' in d)drawer(false);
  if('closeModal' in d||t.id==='modal')closeModal();
  if('menuToggle' in d)$('#nav').classList.toggle('on');
  if(t.closest('#nav'))$('#nav').classList.remove('on');
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
