
# zip化
zip -r bookmarker-web.zip css/* js/* icon_48.png icon_128.png index.html manifest.json
rm -rf bookmarker-web/
unzip -o bookmarker-web.zip -d bookmarker-web
