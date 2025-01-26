const prayers = document.querySelectorAll(".salat > :first-child");
const select = document.querySelector("select");
const arrPrayer = [...prayers]
  .map((pray) => {
    return JSON.parse(
      JSON.stringify({ ar: pray.textContent, en: pray.getAttribute("pray") })
    );
  })
  .reverse();
const Citys = [
  { en: "Rabat", ar: "الرباط" },
  { en: "Agadir", ar: "أكادير" },
  { en: "Marrakech", ar: "مراكش" },
  { en: "Casablanca", ar: "الدار البيضاء" },
  { en: "Fes", ar: "فاس" },
  { en: "Meknes", ar: "مكناس" },
  { en: "Kenitra", ar: "القنيطرة" },
  { en: "Sale", ar: "سلا" },
];

Citys.forEach((city) => {
  select.innerHTML += `<option value="${city.en}">${city.ar}</option>`;
});

select.addEventListener("change", () => {
  const selectedCity = select.value;
  document.querySelector("h1.city").textContent = Citys.find(
    (city) => city.en === selectedCity
  ).ar;
  changeTime(selectedCity);
});

async function changeTime(city) {
  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${city || Citys[0].en}&country=MA`
    );
    const json = await response.json();

    const data = json.data;
    document.querySelector(".date").textContent = data.date.readable;
    document.querySelector(".day").textContent = data.date.hijri.weekday.ar;

    // Update prayer times
    let count = 0;
    [...Object.keys(data.timings)].reverse().forEach((pray) => {
      const index = arrPrayer.findIndex((pryName) => pryName.en === pray);
      if (count !== arrPrayer.length && index !== -1) {
        document.querySelectorAll(".salat > .time")[count++].textContent =
          data.timings[pray];
      }
    });
  } catch (error) {
    console.error("Error fetching prayer timings:", error);
  }
}

changeTime(Citys[0].en);