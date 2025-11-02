// js/config.js
export const CONFIG = {
  SHEET_ID: "1MjCExw6iwjcr0ubYgUdklIsWL_3IXn14hSE5qIXpGI4",
  API_KEY: "AIzaSyAu5Ka6OzvRRd9UUkBFCS6NUsxCDBNOjsQ",
  RANGE_PRODUCTOS: "Productos!A:J",
  RANGE_PEDIDOS: "Pedidos!A:Z",
  RANGE_USUARIOS: "Usuarios!A:Z",
  FREE_DELIVERY_THRESHOLD: 1500,
  DELIVERY_FEE: 50,
  WHATSAPP: "59892308828",
  PEDIDOS_WEBHOOK: "https://script.google.com/macros/s/AKfycbwdskcAcddUdMt65o2MrQ-7v1F8e6n2N5wkSKUsKOPxBdsgYrQFO3lXyWGgeGo58P28/exec",
  WEBHOOK_SECRET: "s3cr3t-TINUX-2025!" // si tenés secret lo pones aquí; si lo dejas vacío el post usará window.WEBHOOK_SECRET si está definido
};
window.CONFIG = CONFIG; // también accesible globalmente
