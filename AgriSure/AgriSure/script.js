async function predict() {
  const loader = document.getElementById("loader");
  const resultDiv = document.getElementById("result");
  const btn = document.querySelector("button");

  // Show loader
  loader.classList.remove("hidden");
  resultDiv.innerHTML = "";
  btn.disabled = true;
  btn.innerText = "Predicting...";

const data = {
  cropname: document.getElementById("cropname").value,
  categoryname: document.getElementById("categoryname").value,
  insurancecompany_insurancecompanyname: document.getElementById("insurancecompany").value,
  sssyname_schemename: document.getElementById("scheme").value,
  sssyname_statename: document.getElementById("state").value,
  district: document.getElementById("district").value,
  season: document.getElementById("season").value,
  suminsured: document.getElementById("suminsured").value
};

  try {
    const res = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    resultDiv.innerHTML = `
      <h3>💰 Prediction: ${result.prediction}</h3>
      <p><b>Top Features:</b> ${JSON.stringify(result.top_features)}</p>
      <p>${result.explanation}</p>
    `;
  } catch (err) {
    resultDiv.innerHTML = `<p style="color:red;">⚠️ Error: Backend not responding</p>`;
    console.error(err);
  }

  // Hide loader
  loader.classList.add("hidden");
  btn.disabled = false;
  btn.innerText = "Predict";
}

document.getElementById("sampleBtn").addEventListener("click", () => {
  document.getElementById("cropname").value = "Pulses";
  document.getElementById("categoryname").value = "Pulses";
  document.getElementById("state").value = "Goa";
  document.getElementById("insurancecompany").value = "FUTURE GENERALI INDIA INSURANCE CO. LTD.";
  document.getElementById("scheme").value = "Pradhan Mantri Fasal Bima Yojana";
  document.getElementById("district").value = "North Goa";
  document.getElementById("season").value = "Kharif";
  document.getElementById("suminsured").value = "37500";
});