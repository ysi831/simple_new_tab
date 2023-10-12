function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function getFavicon(str){
  if (isValidURL(str)) {
    return `http://www.google.com/s2/favicons?domain=${str}`
  } else {
    return str
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}

function safeURL(str){
  // HTMLエスケープ
  const htmlEscaped = escapeHtml(userInputText);
  if (!isValidURL(htmlEscaped)) { return htmlEscaped }

  // URLエンコード
  return encodeURI(htmlEscaped);
}

