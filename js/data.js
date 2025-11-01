async function getProducts(){
  const res = await fetch(SHEETS_URL);
  const text = await res.text();
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift().split(",").map(h=>h.replace(/"/g,"").toLowerCase());
  const products = lines.map(l=>{
    const cols = l.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(x=>x.replace(/"/g,"").trim());
    const obj = {};
    headers.forEach((h,i)=>obj[h]=cols[i]);
    obj.precio = parseFloat((obj.precio||"0").replace(".","").replace(",","."));
    return obj;
  }).filter(p=>p.nombre);
  return products;
}
