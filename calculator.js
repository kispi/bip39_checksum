const hexToBinaryString = {
  '0': '0000', '1': '0001', '2': '0010', '3': '0011',
  '4': '0100', '5': '0101', '6': '0110', '7': '0111',
  '8': '1000', '9': '1001', 'a': '1010', 'b': '1011',
  'c': '1100', 'd': '1101', 'e': '1110', 'f': '1111',
}

/*
  Calculate the SHA-256 hash of a binary value, given as a form of binary string.
  Note that this takes binaryString as a binary value, not as a string.
  For example, this is same with what you do in a linux shell like following:

  echo 11111111 | shasum -a 256 -0
  a8100ae6aa1940d0b663bb31cd466142ebbdbd5187131b92d93818987832eb89

  sha256('11111111') also returns 'a8100ae6aa1940d0b663bb31cd466142ebbdbd5187131b92d93818987832eb89' too.
*/
const sha256 = async binaryString => {
  // Convert binary string to bytes
  const byteArray = new Uint8Array(binaryString.length / 8)
  for (let i = 0; i < binaryString.length; i += 8) {
    const byte = binaryString.substring(i, i + 8)
    byteArray[i / 8] = parseInt(byte, 2)
  }

  // Calculate SHA-256 hash
  const hashBuffer = await crypto.subtle.digest('SHA-256', byteArray)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(byte => ('00' + byte.toString(16)).slice(-2)).join('')
  return hashHex
}

const asDecimal = validWords => {
  const indices = []
  validWords.forEach(validWord => {
    const found = bipWords.indexOf(validWord)
    if (found >= 0) indices.push(found)
  })
  return indices
}

const asBinary = validWords => asDecimal(validWords).map(d => {
  let b = (d).toString(2)
  while (b.length < 11) b = `0${b}`
  return b
})

const calculateCandidates = async validWords => {
  const candidates = []
  for (let i = 0; i < 128; i++) {
    let entropy = asBinary(validWords).join('')
    let b = (i).toString(2)
    while (b.length < 7) b = `0${b}`
    entropy += b
    const checksum = await sha256(entropy)
    bipWords.forEach((bipWord, idx) => {
      if ((idx).toString(2) === (b + hexToBinaryString[checksum[0]])) candidates.push(bipWord)
    })
  }
  return candidates
}

const run = async elevenWords => {
  if ((elevenWords || []).length === 0) return []

  const validWords = []
  const wrongWords = []
  elevenWords.forEach(word => {
    if (bipWords.includes(word)) validWords.push(word)
    else wrongWords.push(word)
  })
  if (wrongWords.length > 0) {
    return Promise.reject(`${wrongWords.join(', ')} are not BIP-39 words. Make sure you only use valid BIP-39 words.`)
  }

  if ((validWords || []).length !== 11) {
    return Promise.reject(`Input 11 words. You have input ${validWords.length} valid words.`)
  }

  return (await calculateCandidates(validWords))
}