export function formatPriceUSDToINR(amountUSD) {
  // Static conversion rate (USD -> INR). Update as needed.
  const RATE = 82.5;
  const inr = Number(amountUSD) * RATE;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(inr);
}

export default formatPriceUSDToINR;
