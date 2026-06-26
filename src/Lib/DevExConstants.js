export const AmountFormat = {
  type: "fixedPoint",
  style: "currency",
  currency: "USD",
  useGrouping: true,
  minimumSignificantDigits: 2,
  precision: 2,
};

export const PercentFormat = "#0.00'%'";
export const MoneyFormat = "'$'###,###,###,###,##0.00"; //For Negative ;('$'###,###,###,###,##0.00)
export const Rounded2DigitsFormat = "###,###,###,###,##0.00";

export const DateFormat = "yyyy-MM-dd";
export const DateTimeFormat = "yyyy-MM-dd HH:mm";
