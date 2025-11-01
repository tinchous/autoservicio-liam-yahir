import { CONFIG } from "./config.js";

export async function login(email, pass) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}/values/${CONFIG.RANGE_USUARIOS}?key=${CONFIG.API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  const [headers, ...rows] = data.values;
  const user = rows.find(r => r[1] === email && r[2] === pass);
  return user ? { nombre: r[0], email: r[1] } : null;
}
