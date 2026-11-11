const PRODUCTS=[
{id:'amber',name:'Amber',family:'Warm',notes:'amber · warm · rich',mood:'Warm & Rich',price:1199,desc:'Warm, rich and quietly golden. A candle for evenings that deserve to last a little longer.',story:'Amber is warmth you can feel from across the room. It belongs to slow evenings, soft lamplight and the moment the day finally lets go.',gal:['amber.jpg','hero.jpg']},
{id:'cherry-blossom',name:'Cherry Blossom',family:'Floral',notes:'floral · soft · delicate',mood:'Soft & Delicate',price:1199,desc:'Floral, soft and delicate. A gentle fragrance for open windows, fresh flowers and unhurried mornings.',story:'Cherry Blossom is the lightest touch in the collection. It suits bright rooms, a vase of blooms and the quiet start to a good day.',gal:['cherry-blossom.jpg','life-1.jpg','story.jpg']},
{id:'royal-rose',name:'Royal Rose',family:'Floral',notes:'rose · floral · elegant',mood:'Floral & Elegant',price:1299,desc:'Rose, floral and elegant. A candle for dinners at home and rooms that feel dressed for an occasion.',story:'Royal Rose is made for gathering. Light it for long conversations, a laid table and evenings worth dressing the room for.',gal:['royal-rose.jpg']},
{id:'patchouli',name:'Patchouli',family:'Woody',notes:'earthy · woody · deep',mood:'Earthy & Deep',price:1199,desc:'Earthy, woody and deep. A grounding candle for quiet evenings and the small ritual of lighting the wick.',story:'Patchouli is for grounding. Pair it with a good book, a soft throw and the slow ritual of striking a match.',gal:['patchouli.jpg','intro.jpg']}];
const fmt=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
const byId=id=>PRODUCTS.find(p=>p.id===id);
let cart=[];try{cart=JSON.parse(localStorage.getItem('vela-cart'))||[]}catch(e){}
cart=cart.filter(i=>byId(i.id));
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
