## 挙動
- 開いているページのタイトルとURLを **\[タイトル](url)** の形式でalertする
- 同クリップボードにコピーする

## ポイント
- `document.createElement("textarea")` でエレメントを作る
- エレメントにStringを代入するときは`textContent` `value` ではない
- 作ったエレメントを`document.body.appendChild()` でDOMに入れる
- エレメントを`select()` し、 document.execCommand('copy') でクリップボードにコピー
- `append` したら `remove` をセットで。

## 試行錯誤
### クリップボードに任意のStringをコピーすることができない
- これではダメ
```JavaScript
    var text = document.createElement("textarea");
    text.value = mdLink;
    text.select();
    document.execCommand("Copy");
    text.parentNode.removeChild(text);
```

## 拡張予定
- ブックマークレットからchrome拡張機能へ変更
  - メニューバーに置いて利便性向上
  - ショートカットキーの割り当て
- クリップボードにコピーした旨のポップアップ表示

## ワンライナー(ブックマークレット用)
```javaScript
    javascript:(function copyToClipBoard(){let title=document.title;let href=document.location.href;let mdlinkText='['+title+']'+'('+getCanonical()+')';let textBox=document.createElement("textarea");textBox.setAttribute("id","target");textBox.setAttribute("type","hidden");textBox.textContent=mdlinkText;document.body.appendChild(textBox);textBox.select();document.execCommand('copy');document.body.removeChild(textBox);function getCanonical(){try{return document.querySelector('link[rel="canonical"]').href}catch{return document.location.href;}}})()
```