
async function convertCurrency(amount, from, to) {
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    throw new Error("Amount must be a positive number");
  }

  if (
    typeof from !== "string" ||
    typeof to !== "string" ||
    !/^[A-Z]{3}$/.test(from) ||
    !/^[A-Z]{3}$/.test(to)
  ) {
    throw new Error("Currencies must be three-letter codes");
  }

  if (from === to) {
    return {
      amount,
      from,
      to,
      rate: 1,
      convertedAmount: amount,
      note: "Source and target currencies are identical.",
    };
  }

  const url =
    `https://api.frankfurter.app/latest?from=${encodeURIComponent(from)}` +
    `&to=${encodeURIComponent(to)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Exchange-rate API returned HTTP ${response.status}`);
  }

  const data = await response.json();
  const rate = data.rates?.[to];

  if (typeof rate !== "number") {
    throw new Error("Exchange rate unavailable for this currency pair");
  }

  return {
    amount,
    from,
    to,
    rate,
    convertedAmount: Number((amount * rate).toFixed(4)),
    rateDate: data.date,
    source: "Frankfurter",
    fetchedAt: new Date().toISOString(),
  };
}

module.exports = { convertCurrency };
