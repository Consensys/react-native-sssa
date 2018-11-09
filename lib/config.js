const config = {
  bits: 8, // default number of bits
  radix: 16, // work with hex by default
  minbits: 3,
  maxbits: 20, // this permits 1,048,575 shares, though going this high is not recommended in js!
  bytesperchar: 2,
  maxbytesperchar: 6, // math.pow(256,7) > math.pow(2,53)

  // primitive polynomials (in decimal form) for galois fields gf(2^n), for 2 <= n <= 30
  // the index of each term in the array corresponds to the n for that polynomial
  // i.e. to get the polynomial for n=16, use primitivepolynomials[16]
  primitivepolynomials: [
    null,
    null,
    1,
    3,
    3,
    5,
    3,
    3,
    29,
    17,
    9,
    5,
    83,
    27,
    43,
    3,
    45,
    9,
    39,
    39,
    9,
    5,
    3,
    33,
    27,
    9,
    71,
    39,
    9,
    5,
    83
  ]
};
export default config;
