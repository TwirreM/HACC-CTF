const codes = [
  "12345678", "87654321", "10293847", "56473829", "90817263", "73645128", "29183746", "47583910", "68421097", "32918475", 
  "56983214", "81726354", "45678123", "23456789", "98765432", "74185296", "15926348", "75395184", "36925814", "84261357", 
  "23498761", "65748392", "19384756", "28475619", "91283746", "83746591", "46591273", "78459623", "64938257", "50382916", 
  "47183926", "68359472", "91384726", "57482931", "86239514", "31749285", "45268179", "62958431", "31894762", "95837461", 
  "82934765", "41583692", "74625183", "94826175", "73168452", "58647291", "93482716", "12948376", "25764831", "64829173", 
  "81246795", "54673829", "28374156", "64912758", "73521984", "41596273", "37284915", "27481953", "61539284", "89134627", 
  "56147298", "47382915", "39748512", "29384716", "78592341", "46382957", "15839472", "92467581", "83267415", "29183754", 
  "69418273", "17384926", "59283714", "34872940", "84623957", "21374895", "56194728", "39527186", "81937426", "23469185", 
  "64521973", "92751468", "84297513", "56139274", "17482953", "94821637", "71639485", "57218439", "81469257", "23198764", 
  "69751238", "51376249", "24895731", "92761583", "71584932", "43159827", "38275914", "69481237", "24736581", "51248396", 
  "97815234", "82479135", "15982734", "73158946", "62719385", "12378945"
];

function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
      if (n % i === 0) return false;
  }
  return true;
}

function isValid(code) {
  const digits = code.split('').map(Number);
    
  // Rule 1: Sum must be prime and greater than 25
  const sum = digits.reduce((a, b) => a + b, 0);
  if (!isPrime(sum)) return false;
  
  // Rule 2: First digit must be odd
  if (digits[0] % 2 === 0) return false;
  
  // Rule 3: Last digit must be even
  if (digits[7] % 2 !== 0) return false;
  
  // Rule 4: Difference between highest and lowest digit must be at least 4
  if (Math.max(...digits) - Math.min(...digits) < 4) return false;
  
  // Rule 5: No digit appears more than twice
  const freq = {};
  for (let d of digits) {
      freq[d] = (freq[d] || 0) + 1;
      if (freq[d] > 2) return false;
  }
  
  // Rule 6: First three digits form a number divisible by 3
  if (parseInt(code.substring(0, 3)) % 3 !== 0) return false;
  
  // Rule 7: Last three digits form a number divisible by 4
  if (parseInt(code.substring(5, 8)) % 4 !== 0) return false;
  
  // Rule 8: Fourth digit must be greater than the second digit
  if (digits[3] <= digits[1]) return false;
  
  // Rule 9: Middle two digits must sum to an odd number
  if ((digits[3] + digits[4]) % 2 === 0) return false;
  
  // Rule 10: The code must not be a palindrome
  if (code === code.split('').reverse().join('')) return false;
  
  return true;
}

const validCodes = codes.filter(isValid);

// for (let i = 1_0000_000; i < 1_0000_0000; i++) {
//   if (isValid(i.toString())) console.log(i)
// }

codes.map(c => console.log("ctf_" + c))

console.log("Valid Codes:", validCodes);
console.log("Total Valid Codes:", validCodes.length);
