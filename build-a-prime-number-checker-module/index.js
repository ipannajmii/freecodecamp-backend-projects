function isPrime(number) {
  if (
    typeof number !== "number" ||
    !Number.isInteger(number) ||
    number <= 1
  ) {
    return false;
  }

  if (number === 2) {
    return true;
  }

  if (number % 2 === 0) {
    return false;
  }

  for (let divisor = 3; divisor <= Math.sqrt(number); divisor += 2) {
    if (number % divisor === 0) {
      return false;
    }
  }

  return true;
}

module.exports = { isPrime };