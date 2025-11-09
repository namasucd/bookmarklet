## 挙動
- 開いているページのタイトルとURLを **\[タイトル](url)** の形式でクリップボードにコピーする
- URLは`<link rel="canonical">`が存在する場合はそのhrefを使用し、存在しない場合は現在のページURLを使用する

## ポイント
- `navigator.clipboard.writeText()`を使用（モダンな方法）
- フォールバックとして`document.execCommand('copy')`方式も実装
- `document.querySelector('link[rel="canonical"]')`でcanonical URLを取得
- `document.createElement("textarea")`でエレメントを作成（フォールバック時）
- エレメントにStringを代入するときは`textContent`を使用
- 作ったエレメントを`document.body.appendChild()`でDOMに入れる
- エレメントを`select()`し、`document.execCommand('copy')`でクリップボードにコピー（フォールバック時）
- `append`したら`remove`をセットで

## 拡張予定
- ブックマークレットからchrome拡張機能へ変更
  - メニューバーに置いて利便性向上
  - ショートカットキーの割り当て
- クリップボードにコピーした旨のポップアップ表示

## ワンライナー(ブックマークレット用)
```javascript
javascript:(async function copyToClipBoard(){let title=document.title;let mdlinkText='['+title+']('+getCanonical()+')';function getCanonical(){const canonical=document.querySelector('link[rel="canonical"]');return canonical?canonical.href:document.location.href;}try{await navigator.clipboard.writeText(mdlinkText);}catch(err){let textBox=document.createElement("textarea");textBox.textContent=mdlinkText;textBox.style.position='fixed';textBox.style.opacity='0';document.body.appendChild(textBox);textBox.select();document.execCommand('copy');document.body.removeChild(textBox);}})()
```

