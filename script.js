// Loads quotes.json and shows a deterministic "quote of the day" based on day-of-year.
async function loadQuotes(){
  try{
    const res = await fetch('quotes.json');
    const quotes = await res.json();
    return quotes;
  }catch(e){
    // Fallback quotes if fetch fails
    return [
      {text:'Keep going — this is your fallback quote!', author:'Team'}
    ];
  }
}

function dayOfYear(d=new Date()){
  const start = new Date(d.getFullYear(),0,0);
  const diff = d - start + ((start.getTimezoneOffset() - d.getTimezoneOffset())*60*1000);
  return Math.floor(diff / (1000*60*60*24));
}

function pickQuoteOfDay(quotes){
  const idx = dayOfYear() % quotes.length;
  return quotes[idx];
}

function showQuote(q){
  document.getElementById('quote-text').textContent = `"${q.text}"`;
  document.getElementById('quote-author').textContent = q.author ? `— ${q.author}` : '';
}

async function main(){
  const quotes = await loadQuotes();
  let current = pickQuoteOfDay(quotes);
  showQuote(current);

  document.getElementById('new-quote').addEventListener('click', ()=>{
    const idx = Math.floor(Math.random()*quotes.length);
    current = quotes[idx];
    showQuote(current);
  });

  document.getElementById('copy-quote').addEventListener('click', async ()=>{
    const text = `${current.text} — ${current.author || ''}`;
    try{
      await navigator.clipboard.writeText(text);
      alert('Copied!');
    }catch(e){
      prompt('Copy this text:', text);
    }
  });
}

main();