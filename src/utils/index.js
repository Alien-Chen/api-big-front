export const checkCodeEqual = (originCode, code) => {
  if (!originCode || !code) {
    return false
  }
  if (originCode.toLowerCase() === code.toLowerCase()) {
    return true
  } else {
    return false
  }
}