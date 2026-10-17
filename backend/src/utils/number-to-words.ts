/**
 * Converts numbers into Indian currency word representation.
 * E.g. 1 -> "One Rupee Only"
 *      17261 -> "Seventeen Thousand Two Hundred Sixty-One Rupees Only"
 */

const ONES: string[] = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen'
];

const TENS: string[] = [
  '',
  '',
  'Twenty',
  'Thirty',
  'Forty',
  'Fifty',
  'Sixty',
  'Seventy',
  'Eighty',
  'Ninety'
];

function convertLessThanThousand(n: number): string {
  let result = '';

  if (n >= 100) {
    result += ONES[Math.floor(n / 100)] + ' Hundred ';
    n %= 100;
  }

  if (n >= 20) {
    result += TENS[Math.floor(n / 10)];
    if (n % 10 > 0) {
      result += '-' + ONES[n % 10];
    }
  } else if (n > 0) {
    result += ONES[n];
  }

  return result.trim();
}

export function amountInWordsIndian(amount: number): string {
  if (isNaN(amount) || amount <= 0) {
    return 'Zero Rupees Only';
  }

  const integerPart = Math.floor(amount);
  const paisePart = Math.round((amount - integerPart) * 100);

  if (integerPart === 0 && paisePart > 0) {
    return `${convertLessThanThousand(paisePart)} Paise Only`;
  }

  let words = '';
  let remaining = integerPart;

  // Crores (10,000,000)
  const crores = Math.floor(remaining / 10000000);
  remaining %= 10000000;
  if (crores > 0) {
    words += convertLessThanThousand(crores) + ' Crore ';
  }

  // Lakhs (100,000)
  const lakhs = Math.floor(remaining / 100000);
  remaining %= 100000;
  if (lakhs > 0) {
    words += convertLessThanThousand(lakhs) + ' Lakh ';
  }

  // Thousands (1,000)
  const thousands = Math.floor(remaining / 1000);
  remaining %= 1000;
  if (thousands > 0) {
    words += convertLessThanThousand(thousands) + ' Thousand ';
  }

  // Hundreds, tens, units
  if (remaining > 0) {
    words += convertLessThanThousand(remaining) + ' ';
  }

  const rupeeLabel = integerPart === 1 ? 'Rupee' : 'Rupees';
  let finalResult = `${words.trim()} ${rupeeLabel}`;

  if (paisePart > 0) {
    finalResult += ` and ${convertLessThanThousand(paisePart)} Paise`;
  }

  return `${finalResult} Only`;
}
