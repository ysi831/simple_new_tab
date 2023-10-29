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
    return `https://www.google.com/s2/favicons?domain=${escapedStr}`
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

function extractSiteName(url) {
  if (!validateURL(url)) { return ''; }

  const parser = new URL(url);
  let hostname = parser.hostname.split('.');


  // 'www.'を除去
  if (hostname[0] === 'www') {
    hostname.shift();
  }

  // ホスト名の最初の部分を大文字にして取得
  const siteName = hostname[0].charAt(0).toUpperCase() + hostname[0].slice(1);
  return siteName;
}
