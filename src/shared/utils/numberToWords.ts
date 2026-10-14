/**
 * Converts a number to words in the Indian numbering format (Lakhs, Crores)
 * e.g., 82000 -> "Eighty-Two Thousand Rupees Only"
 */
export function numberToIndianWords(amount: number): string {
  if (!amount || isNaN(amount) || amount === 0) return "Zero Rupees Only";

  const single = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function convertTwoDigits(n: number): string {
    if (n < 20) return single[n];
    const t = Math.floor(n / 10);
    const s = n % 10;
    return s > 0 ? `${tens[t]}-${single[s]}` : tens[t];
  }

  function convertThreeDigits(n: number): string {
    const h = Math.floor(n / 100);
    const rem = n % 100;
    let res = "";
    if (h > 0) {
      res += `${single[h]} Hundred`;
      if (rem > 0) res += " ";
    }
    if (rem > 0) {
      res += convertTwoDigits(rem);
    }
    return res;
  }

  const integerPart = Math.floor(Math.abs(amount));
  let n = integerPart;

  const crore = Math.floor(n / 10000000);
  n %= 10000000;

  const lakh = Math.floor(n / 100000);
  n %= 100000;

  const thousand = Math.floor(n / 1000);
  n %= 1000;

  const remainder = n;

  let words = "";

  if (crore > 0) {
    words += `${convertThreeDigits(crore)} Crore `;
  }
  if (lakh > 0) {
    words += `${convertTwoDigits(lakh)} Lakh `;
  }
  if (thousand > 0) {
    words += `${convertTwoDigits(thousand)} Thousand `;
  }
  if (remainder > 0) {
    words += convertThreeDigits(remainder);
  }

  words = words.trim();
  return words ? `${words} Rupees Only` : "Zero Rupees Only";
}
