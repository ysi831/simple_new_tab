
# zip化
zip -r dist.zip css/* js/* icon_48.png icon_128.png index.html manifest.json
rm -rf dist/
unzip -o dist.zip -d dist
