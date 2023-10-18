function validateURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function getFavicon(str){
  if (validateURL(str)) {
    return `http://www.google.com/s2/favicons?domain=${str}`
  } else {
    return str
  }
}

function escapedString(str) {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}

function safeURL(str){
  // HTMLエスケープ
  const escaped = escapedString(str);
  if (!validateURL(escaped)) { return escaped }

  // URLエンコード
  return encodeURI(escaped);
}

