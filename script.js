const cart = [];
const names = ["DESIGN 01","DESIGN 02","DESIGN 03","DESIGN 04","DESIGN 05"];
const prices = [58,58,58,58,58];
const imageUrls = [null,null,null,null,null];
let heroUrl = null;
const $ = (s,root=document)=>root.querySelector(s);
const $$ = (s,root=document)=>[...root.querySelectorAll(s)];
$("#year").textContent = new Date().getFullYear();

function showImage(index,file){
  if(!file || !file.type.startsWith("image/")) return;
  const url = URL.createObjectURL(file);
  imageUrls[index] = url;
  const btn = $(`[data-upload="${index}"]`);
  btn.classList.remove("empty-art");
  let img = $("img",btn);
  if(!img){img=document.createElement("img");img.alt=`Uploaded artwork for ${names[index]}`;btn.appendChild(img);}
  img.src=url;
}
$$("[data-upload]").forEach(btn=>btn.addEventListener("click",()=>{
  const i=Number(btn.dataset.upload);
  const input=$(`[data-file-for="${i}"]`);
  input.click();
}));
$$("[data-file-for]").forEach(input=>input.addEventListener("change",()=>showImage(Number(input.dataset.fileFor),input.files[0])));
$("#bulkUpload").addEventListener("change",e=>{
  [...e.target.files].slice(0,5).forEach((file,i)=>showImage(i,file));
  e.target.value="";
});
$("#heroPreview").addEventListener("click",()=>{
  const input=document.createElement("input");input.type="file";input.accept="image/*";
  input.onchange=()=>{const file=input.files[0];if(!file)return;if(heroUrl)URL.revokeObjectURL(heroUrl);heroUrl=URL.createObjectURL(file);
    const box=$("#heroPreview");box.classList.add("has-image");box.innerHTML="";const img=document.createElement("img");img.src=heroUrl;img.alt="Uploaded hero artwork";box.appendChild(img);};
  input.click();
});
function updateCart(){
  $("#cartCount").textContent=cart.reduce((a,b)=>a+b.qty,0);
  $("#bagCount").textContent=`(${cart.reduce((a,b)=>a+b.qty,0)})`;
  $("#subtotal").textContent="$"+cart.reduce((a,b)=>a+b.qty*b.price,0).toFixed(2);
  const area=$("#cartItems");area.innerHTML="";
  if(!cart.length){area.innerHTML='<p class="empty-bag">Nothing in the archive yet.</p>';return;}
  cart.forEach(item=>{const row=document.createElement("div");row.className="cart-row";row.innerHTML=`<span>${item.name}<br><small style="color:#888">QTY ${item.qty}</small></span><span>$${(item.price*item.qty).toFixed(2)}</span><button aria-label="Remove ${item.name}">REMOVE</button>`;row.querySelector("button").onclick=()=>{cart.splice(cart.indexOf(item),1);updateCart();};area.appendChild(row);});
}
function openCart(){$("#cartOverlay").hidden=false;document.body.style.overflow="hidden";}
function closeCart(){$("#cartOverlay").hidden=true;document.body.style.overflow="";}
$("#cartOpen").onclick=openCart;$("#cartClose").onclick=closeCart;$("#cartX").onclick=closeCart;$(".overlay-dismiss").onclick=closeCart;
$$("[data-add]").forEach(btn=>btn.addEventListener("click",()=>{
  const i=Number(btn.dataset.add);
  const existing=cart.find(x=>x.index===i);
  if(existing)existing.qty++;else cart.push({index:i,name:names[i],price:prices[i],qty:1});
  updateCart();openCart();
}));
