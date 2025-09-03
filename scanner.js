function startScanner(facing) {
  Quagga.init({
    inputStream: {
      type: "LiveStream",
      target: document.querySelector('#scanner-container'),
      constraints: { facingMode: facing } // "environment" eller "user"
    },
    decoder: {
      readers: ["ean_reader","ean_13_reader","upc_reader","code_128_reader"]
    }
  }, function(err) {
    if(err) {
      if(facing==="environment") startScanner("user"); // fallback til frontkamera
      else {
        console.error(err);
        document.getElementById("resultat").innerText = "Feil ved oppstart: " + err;
      }
      return;
    }
    Quagga.start();
  });
}

// Start med bak-kamera først
startScanner("environment");

// Når strekkode blir funnet
Quagga.onDetected(function(data){
  const barcode = data.codeResult.code;
  document.getElementById("resultat").innerText = "Fant strekkode: " + barcode;

  // Hent produktinfo fra OpenFoodFacts
  fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
    .then(res=>res.json())
    .then(data=>{
      if(data.status===1){
        const produkt = data.product;
        document.getElementById("resultat").innerText =
          `Navn: ${produkt.product_name || "Ukjent"}\n` +
          `Best før: ${produkt.expiration_date || "Ingen dato funnet"}\n` +
          `Merke: ${produkt.brands || "Ukjent"}`;
      } else {
        document.getElementById("resultat").innerText = "Fant ikke produktet i databasen.";
      }
    })
    .catch(err=>{
      document.getElementById("resultat").innerText = "Feil ved API-oppslag.";
      console.error(err);
    });
});
