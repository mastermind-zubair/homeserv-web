export function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function pascalCaseToTitle(text) {
  const result = text.replace(/([A-Z])/g, " $1");

  const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
  return finalResult;
}

export function snakeCaseToTitle(text) {
  let title = text.replace(/(\$)/g, "/").split("_");
  for (let i = 0; i < title.length; i++) {
    title[i] = title[i][0].toUpperCase() + title[i].slice(1);
  }

  return title.join(" ");
}

export async function getBase64(file) {
  let reader = new FileReader();
  await reader.readAsDataURL(file);
  reader.onload = await function () {
    return reader.result;
  };
  reader.onerror = await function (error) {
    console.log("Error: ", error);
    return null;
  };
}

export function getRank(number) {
  switch (number) {
    case 1:
      return "1st";
    case 2:
      return "2nd";
    case 3:
      return "3rd";
    case 4:
      return "4th";
    case 5:
      return "5th";
    case 6:
      return "6th";
    case 7:
      return "7th";
    case 8:
      return "8th";
    case 9:
      return "9th";
    case 10:
      return "10th";
    case 11:
      return "11th";
    case 12:
      return "12th";
    case 13:
      return "13th";
    case 14:
      return "14th";
    case 15:
      return "15th";
    case 16:
      return "16th";
    case 17:
      return "17th";
    case 18:
      return "18th";
    case 19:
      return "19th";
    case 20:
      return "20th";
  }
}


export function formatCurrency(amount) {
 return amount && amount.toLocaleString('en-AU', { style: "currency", currency: "AUD" }) || "0".toLocaleString('en-AU', { style: "currency", currency: "AUD" })
}
