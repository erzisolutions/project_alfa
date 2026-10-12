(()=>{'use strict';
const read = id=>document.getElementById(id);
const items=JSON.parse(read('menu-data').textContent);
const menu=new Map(items.map(x=>[Number(x.id),x]));
const cards=[...document.querySelectorAll('.food-card')];
const basket=read('cart-dialog');
const phone='+38762073733';
let category='Sve',query='',pageSize=15,showLimit=15,onlyFav=false;
const state={cart:new Map(),favorites:new Set()};
const storageKey='la-linea-erzi-v3-cart',favKey='la-linea-erzi-v3-favorites';
const normalize=s=>String(s||'').toLocaleLowerCase('bs').replace(/đ/g,'dj').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
const fmt=cents=>(cents/100).toFixed(2).replace('.',',')+' KM';
const cash=p=>Math.round(Number(p)*100);
function stored(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}}
function persist(){try{localStorage.setItem(storageKey,JSON.stringify([...state.cart.entries()]));localStorage.setItem(favKey,JSON.stringify([...state.favorites]))}catch{}}
const rawCart=stored(storageKey);
if(Array.isArray(rawCart))for(const entry of rawCart){if(!Array.isArray(entry)||entry.length!==2)continue;const id=Number(entry[0]),qty=Number(entry[1]);const x=menu.get(id);if(x&&x.pricing==='fixed'&&Number.isInteger(qty)&&qty>0&&qty<=99)state.cart.set(id,qty)}
const rawFav=stored(favKey);if(Array.isArray(rawFav))for(const id of rawFav){if(menu.has(Number(id)))state.favorites.add(Number(id))}
function notice(message){const el=read('notice');el.textContent=message;el.hidden=false;clearTimeout(notice._timer);notice._timer=setTimeout(()=>el.hidden=true,4200)}
function total(){return [...state.cart].reduce((s,[id,qty])=>s+cash(menu.get(id).price)*qty,0)}
function count(){return [...state.cart.values()].reduce((s,q)=>s+q,0)}
function saveCart(){persist();updateBadge();if(basket.open)renderCart()}
function updateBadge(){const n=count();read('cart-count').textContent=n;read('mobile-cart-count').textContent=n;read('mobile-cart').hidden=n===0;read('mobile-cart-total').textContent=fmt(total());read('cart-trigger').setAttribute('aria-label',`Korpa, ${n} proizvoda`)}
function updateFavorites(){document.querySelectorAll('.fav-btn').forEach(b=>{const saved=state.favorites.has(Number(b.dataset.id));b.dataset.saved=String(saved);b.setAttribute('aria-pressed',String(saved));b.setAttribute('aria-label',saved?'Ukloni iz sačuvanih':'Sačuvaj jelo')})}
function updateChips(){document.querySelectorAll('.chip').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===category&&(b.dataset.fav==='true')===onlyFav)))}
function filterMenu(){
 const matches=cards.filter(c=>{const item=menu.get(Number(c.dataset.id));return (category==='Sve'||category===item.category)&&(!onlyFav||state.favorites.has(item.id))&&normalize(`${item.name} ${item.category} ${item.description}`).includes(query)});
 cards.forEach(c=>c.hidden=true);
 matches.slice(0,showLimit).forEach(c=>c.hidden=false);
 read('menu-count').textContent=`${matches.length} jela`;
 read('result-text').textContent=query?`${matches.length} rezultata za „${read('search').value.trim()}”`:onlyFav?`${matches.length} sačuvanih jela`:category==='Sve'?`Pregled ${matches.length} jela iz jelovnika`:`${category.toLocaleLowerCase('bs')} · ${matches.length} jela`;
 read('show-more').hidden=matches.length<=showLimit;
 read('no-results').hidden=matches.length!==0;
 updateChips();
}
function setCategory(value,favorites=false){category=value;onlyFav=favorites;showLimit=15;filterMenu();read('jelovnik').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});}
function setQty(id,qty){const item=menu.get(id);if(!item||item.pricing!=='fixed')return;qty=Math.min(99,Math.max(0,Number(qty)||0));if(qty===0)state.cart.delete(id);else state.cart.set(id,qty);saveCart()}
function add(id){const x=menu.get(id);if(!x)return;if(x.pricing!=='fixed'){notice('Ovo jelo ima cijenu „od”. Za tačnu veličinu i cijenu nazovi restoran.');return}setQty(id,(state.cart.get(id)||0)+1);notice(`${x.name} je dodano u korpu.`)}
document.addEventListener('click',e=>{
 const addButton=e.target.closest('[data-action="add"]');if(addButton){add(Number(addButton.dataset.id));return}
 const favorite=e.target.closest('.fav-btn');if(favorite){const id=Number(favorite.dataset.id);if(state.favorites.has(id))state.favorites.delete(id);else state.favorites.add(id);persist();updateFavorites();if(onlyFav)filterMenu();return}
 const cat=e.target.closest('.chip');if(cat){setCategory(cat.dataset.category||'Sve',cat.dataset.fav==='true');return}
 const anchor=e.target.closest('[data-category-link]');if(anchor){e.preventDefault();setCategory(anchor.dataset.categoryLink);return}
 const qty=e.target.closest('[data-qty]');if(qty){const id=Number(qty.dataset.id);setQty(id,(state.cart.get(id)||0)+Number(qty.dataset.qty));return}
});
read('search').addEventListener('input',e=>{query=normalize(e.target.value);showLimit=15;filterMenu()});
read('search-clear').addEventListener('click',()=>{read('search').value='';query='';showLimit=15;filterMenu();read('search').focus()});
read('show-more').addEventListener('click',()=>{showLimit+=18;filterMenu()});
read('no-results-reset').addEventListener('click',()=>{read('search').value='';query='';category='Sve';onlyFav=false;showLimit=15;filterMenu()});
function renderCart(){
 const wrap=read('cart-items');wrap.replaceChildren();
 const empty=state.cart.size===0;
 read('cart-fields').hidden=empty;
 read('cart-actions').hidden=empty;
 read('empty-cart').hidden=!empty;
 if(empty){read('cart-subtotal').textContent='0,00 KM';read('cart-item-count').textContent='0';return}
 const frag=document.createDocumentFragment();
 for(const [id,qty] of state.cart){const item=menu.get(id);const row=document.createElement('div');row.className='cart-row';const left=document.createElement('div');left.className='cart-item-main';const title=document.createElement('b');title.textContent=item.name;const subtitle=document.createElement('small');subtitle.textContent=`${fmt(cash(item.price))} po komadu`;const bar=document.createElement('div');bar.className='qty';const minus=document.createElement('button');minus.type='button';minus.dataset.qty='-1';minus.dataset.id=id;minus.setAttribute('aria-label',`Smanji količinu za ${item.name}`);minus.textContent='−';const amt=document.createElement('span');amt.textContent=String(qty);const plus=document.createElement('button');plus.type='button';plus.dataset.qty='1';plus.dataset.id=id;plus.setAttribute('aria-label',`Povećaj količinu za ${item.name}`);plus.textContent='+';bar.append(minus,amt,plus);left.append(title,subtitle,bar);const price=document.createElement('strong');price.className='cart-item-price';price.textContent=fmt(cash(item.price)*qty);row.append(left,price);frag.append(row)}
 wrap.append(frag);
 read('cart-subtotal').textContent=fmt(total());read('cart-item-count').textContent=count();
}
function openCart(){renderCart();basket.showModal();document.body.style.overflow='hidden'}
function closeCart(){basket.close()}
read('cart-trigger').addEventListener('click',openCart);
read('mobile-cart').addEventListener('click',openCart);
read('close-cart').addEventListener('click',closeCart);
basket.addEventListener('close',()=>document.body.style.overflow='');
basket.addEventListener('click',e=>{const rect=basket.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)closeCart()});
read('delivery-address-wrap').hidden=true;
document.querySelectorAll('input[name="delivery-type"]').forEach(x=>x.addEventListener('change',()=>{read('delivery-address-wrap').hidden=read('pickup').checked;read('delivery-address').required=read('delivery').checked}));
function getMessage(){
 if(state.cart.size===0)return null;
 const delivery=read('delivery').checked;
 const address=read('delivery-address').value.trim();
 if(delivery&&!address){read('delivery-address').focus();notice('Unesi adresu za dostavu prije pripreme narudžbe.');return null}
 const lines=[`LA LINEA TUZLA • UPIT ZA NARUDŽBU`,``,`Način: ${delivery?'Dostava':'Preuzimanje u restoranu'}`,``,`Jela:`];
 for(const [id,qty] of state.cart){const it=menu.get(id);lines.push(`• ${qty} × ${it.name} = ${fmt(cash(it.price)*qty)}`)}
 lines.push(``,`Zbir jela: ${fmt(total())}`);
 if(delivery){lines.push(`Adresa: ${address}`,'Dostava: naknadu i dostupnost potvrđuje restoran.')}
 const note=read('order-note').value.trim();if(note)lines.push(`Napomena: ${note}`);
 lines.push('','Ovo nije potvrđena narudžba. Molim potvrdu dostupnosti, ukupne cijene i vremena pripreme na telefon +387 62 073 733.');
 return lines.join('\n');
}
async function copyMessage(message){try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(message);return true}}catch{}
 const t=document.createElement('textarea');t.value=message;t.style.position='fixed';t.style.opacity='0';document.body.append(t);t.select();let ok=false;try{ok=document.execCommand('copy')}catch{}t.remove();return ok}
read('prepare-order').addEventListener('click',async()=>{
 const message=getMessage();if(!message)return;
 if(await copyMessage(message)){read('cart-state').textContent='Sažetak je kopiran. Nazovi restoran i potvrdi narudžbu.';notice('Narudžba kopirana. Potvrdi je pozivom restoranu.')}else{const manual=read('manual-copy');read('manual-label').style.display='block';manual.hidden=false;manual.value=message;manual.focus();manual.select();read('cart-state').textContent='Sažetak je ispod. Označi ga i kopiraj ručno.'}
});
read('share-order').addEventListener('click',async()=>{
 const message=getMessage();if(!message)return;
 if(navigator.share){try{await navigator.share({title:'La Linea Tuzla • upit za narudžbu',text:message});read('cart-state').textContent='Sažetak je podijeljen. Restoran tek treba potvrditi narudžbu.'}catch(e){if(e.name!=='AbortError')notice('Dijeljenje nije uspjelo. Koristi kopiranje narudžbe.')}}else if(await copyMessage(message)){notice('Sažetak kopiran. Podijeli ga putem aplikacije po izboru.')}else notice('Preglednik ne podržava dijeljenje. Koristi kopiranje.');
});
// Tastaturna prečica za pretragu je pogodnost, ne uslov za upotrebu.
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();if(basket.open)closeCart();read('search').focus();read('jelovnik').scrollIntoView()}});
updateBadge();updateFavorites();filterMenu();
})();
