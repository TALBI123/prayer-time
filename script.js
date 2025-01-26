const select = document.querySelector("select");
const prayers = document.querySelectorAll(".salat > :first-child");
const arrPrayer = [...prayers]
  .map((pray) =>
    JSON.parse(
      `{"arbic":"${pray.textContent}","eng":"${pray.getAttribute("pray")}"}`
    )
  )
  .reverse();
const Citys = [
  { en: "Rabat", ar: "الرباط" },
  { en: "Agadir", ar: "أكادير" },
  { en: "Marrakech", ar: "مراكش" },
  { en: "Casablanca", ar: "الدار البيضاء" },
  { en: "Fes", ar: "فاس" },
  { en: "Meknes", ar: "	مكناس" },
  { en: "Kenitra", ar: "القنيطرة" },
  { en: "Sale", ar: "سلا" },
];
Citys.forEach((city) => {
  select.innerHTML += `<option>${city.en}</option>`;
});
select.addEventListener("change", () => {
  changeTime(select.value);
  document.querySelector(".city").textContent =
    Citys[Citys.findIndex((city) => city.en === select.value)].ar;
});
function changeTime(value) {
  new Promise((reslove) => {
    let request = new XMLHttpRequest();
    request.open(
      "GET",
      `http://api.aladhan.com/v1/timingsByCity/{date}?city=${
        value || Citys[0].en
      }&country=MA`
    );
    request.responseType = "json";
    request.send();
    request.addEventListener("load", () => {
      if (request.status >= 200 && request.status < 300)
        reslove(request.response.data);
    });
  }).then((resp) => {
    const day = resp.date.hijri.weekday.ar;
    let index = 0;
    document.querySelector(".day").textContent = day;
    document.querySelector('.date').textContent = resp.date.readable;
    console.log(resp.date.readable)
    Object.keys(resp.timings).forEach((elm) => {
      const len = arrPrayer.length - 1 - index;
      if (index != arrPrayer.length && elm == arrPrayer[index].eng) {
        document.querySelectorAll(".time")[len].textContent = resp.timings[elm];
        index++;
      }
    });
  });
}
changeTime();