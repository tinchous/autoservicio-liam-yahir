// js/init-app.js
import { CONFIG } from "./config.js";

window.WEBHOOK_SECRET = window.WEBHOOK_SECRET || CONFIG.WEBHOOK_SECRET || "";

window.postPedidoToWebhook = async function(pedido){
  const webhook = CONFIG.PEDIDOS_WEBHOOK || window.PEDIDOS_WEBHOOK;
  if (!webhook) return { ok:false, error: "No webhook configured" };
  const body = { action: "save_pedido", pedido };
  if (window.WEBHOOK_SECRET) body.secret = window.WEBHOOK_SECRET;
  try {
    const res = await fetch(webhook, { method:"POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(body) });
    const json = await res.json().catch(()=>null);
    return json || { ok:false, error:"No JSON" };
  } catch(e){ console.error(e); return { ok:false, error: String(e) }; }
};

// helper to post register user
window.postRegisterToWebhook = async function(user){
  const webhook = CONFIG.PEDIDOS_WEBHOOK || window.PEDIDOS_WEBHOOK;
  if (!webhook) return { ok:false, error: "No webhook configured" };
  const body = { action: "register_user", user };
  if (window.WEBHOOK_SECRET) body.secret = window.WEBHOOK_SECRET;
  try {
    const res = await fetch(webhook, { method:"POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(body) });
    const json = await res.json().catch(()=>null);
    return json || { ok:false, error:"No JSON" };
  } catch(e){ console.error(e); return { ok:false, error: String(e) }; }
};

// UI small enhancements
document.addEventListener("DOMContentLoaded", ()=>{
  // mouse light
  const ml = document.getElementById('mouse-light');
  if (ml) {
    document.addEventListener('mousemove', e => {
      ml.style.left = e.clientX + 'px';
      ml.style.top  = e.clientY + 'px';
      ml.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  }
});
