function Encrypt(plaintext) {
  if (plaintext.length === 0) {
    alert("please enter some plaintext");
    return;
  }
  var key = plaintext.length > 1 ? Math.floor(plaintext.length / 2) : 1;
  if (key > Math.floor(2 * (plaintext.length - 1))) {
    alert("key is too large for the plaintext length.");
    return;
  }

  let ciphertext = "";
  let line;
  for (line = 0; line < key - 1; line++) {
    let skip = 2 * (key - line - 1);
    let j = 0;
    for (let i = line; i < plaintext.length;) {
      ciphertext += plaintext.charAt(i);
      if (line == 0 || j % 2 == 0) {
        i += skip;
      } else {
        i += 2 * (key - 1) - skip;
      }
      j++;
    }
  }
  for (let i = line; i < plaintext.length; i += 2 * (key - 1)) {
    ciphertext += plaintext.charAt(i);
  }
  console.log(ciphertext);
  return ciphertext;
}

function Decrypt(ciphertext) {
  if (ciphertext.length < 1) {
    alert("please enter some ciphertext (letters only)");
    return;
  }
  var key = ciphertext.length > 1 ? Math.floor(ciphertext.length / 2) : 1;
  if (key > Math.floor(2 * (ciphertext.length - 1))) {
    alert("please enter 1 - 22.");
    return;
  }
  let pt = new Array(ciphertext.length);
  let k = 0;
  let line;
  for (line = 0; line < key - 1; line++) {
    let skip = 2 * (key - line - 1);
    let j = 0;
    for (i = line; i < ciphertext.length;) {
      pt[i] = ciphertext.charAt(k++);
      if (line == 0 || j % 2 == 0) i += skip;
      else i += 2 * (key - 1) - skip;
      j++;
    }
  }

  let decryptedString = "";
  for (i = line; i < ciphertext.length; i += 2 * (key - 1))
    pt[i] = ciphertext.charAt(k++);

  for (let it = 0; it < ciphertext.length; it++) {
    decryptedString = decryptedString + pt[it];
  }
  return decryptedString;
}

module.exports = { Encrypt, Decrypt };
