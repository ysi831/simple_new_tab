function validateURL(string) {
  try {
    const url = new URL(string);
    if (url.protocol === 'file:') {
      return false;
    }
    return true;
  } catch (_) {
    return false;
  }
}

function getFavicon(str){
  const escapedStr = escapedHTML(str);
  if (validateURL(escapedStr)) {
    return `http://www.google.com/s2/favicons?domain=${escapedStr}`
  } else {
    return ''
  }
}

function escapedHTML(str) {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}

function safeURL(str){
  // HTMLエスケープ
  const escaped = escapedHTML(str);
  if (!validateURL(escaped)) { return escaped }

  // URLエンコード
  return encodeURI(escaped);
}

