const PRODUCTS=[
{id:'air-fresh',name:'Air Fresh',element:'Air',mood:'Clarity & Renewal',price:1199,desc:'A fragrance inspired by fresh beginnings, openness, and the feeling of taking a deep breath.',story:'Air is the element of freedom. Air Fresh is made for the first window opened in the morning, a cleared desk, a room that finally feels light.'},
{id:'earth-coffee',name:'Earth Coffee',element:'Earth',mood:'Warmth & Grounding',price:1199,desc:'A warm coffee-inspired experience for slow mornings, comforting spaces, and familiar moments.',story:'Earth is the element of grounding. Earth Coffee belongs to the unhurried start of a day, a favourite chair, and the comfort of the familiar.'},
{id:'water-sweet',name:'Water Sweet',element:'Water',mood:'Calm & Serenity',price:1199,desc:'A soft, soothing fragrance inspired by fluidity, quiet evenings, and peaceful moments.',story:'Water is the element of peace. Water Sweet is for the end of the day, when the house goes quiet and your shoulders finally drop.'},
{id:'fire-spice',name:'Fire Spice',element:'Fire',mood:'Passion & Energy',price:1299,desc:'A bold, captivating fragrance that brings warmth, character, and energy into your surroundings.',story:'Fire is the element of passion. Fire Spice is for gatherings, long conversations, and rooms that should feel alive.'}];
const fmt=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
const byId=id=>PRODUCTS.find(p=>p.id===id);
let cart=[];try{cart=JSON.parse(localStorage.getItem('vela-cart'))||[]}catch(e){}
function saveCart(){try{localStorage.setItem('vela-cart',JSON.stringify(cart))}catch(e){}renderCart()}
function addToCart(id,q=1){const l=cart.find(i=>i.id===id);l?l.q+=q:cart.push({id,q});saveCart();openDrawer('cart')}
function setQty(id,d){const l=cart.find(i=>i.id===id);if(!l)return;l.q+=d;if(l.q<1)cart=cart.filter(i=>i.id!==id);saveCart()}
function removeItem(id){cart=cart.filter(i=>i.id!==id);saveCart()}
const total=()=>cart.reduce((s,i)=>s+byId(i.id).price*i.q,0);
function renderCart(){
 const n=cart.reduce((s,i)=>s+i.q,0);document.querySelectorAll('.count').forEach(c=>{c.textContent=n;c.hidden=!n});
 const b=document.getElementById('cartBody');if(!b)return;
 b.innerHTML=cart.length?cart.map(i=>{const p=byId(i.id);return `<div class="line"><div class="ph" data-src="${p.id}.jpg"></div><div><h4>${p.name}</h4><div class="qty"><button aria-label="Decrease quantity" data-dec="${p.id}">−</button><span>${i.q}</span><button aria-label="Increase quantity" data-inc="${p.id}">+</button></div><button class="rm" data-rm="${p.id}">Remove</button></div><div>${fmt(p.price*i.q)}</div></div>`}).join(''):'<p>Your bag is empty. <a href="shop.html" style="text-decoration:underline">Browse the collection</a>.</p>';
 document.getElementById('cartTotal').textContent=fmt(total());document.getElementById('checkoutBtn').disabled=!cart.length;
 loadPh(b)}
