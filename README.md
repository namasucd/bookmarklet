# 作成したブックマークレットの置き場

## get-markdown-link(廃止)
### 概要
- 開いているページのタイトルとURLを **\[タイトル](url)** の形式でクリップボードにコピーする

### 参考
- [任意の文字列をクリップボードにコピー - #ふがしメモ](https://ripplegashi.hatenablog.com/entry/2017/04/07/162651)
- [Chrome Dev Toolでブックマークレットを実行する - Qiita](https://qiita.com/kanaxx/items/0fe8e7e2deea482960b0)

## get-url-md-format
### 概要
- get-markdown-linkの拡張版
- 開いているページのタイトルとURLを **\[タイトル](url)** の形式でクリップボードにコピーする
- URLは`<link rel="canonical">`が存在する場合はそのhrefを優先的に使用
- `navigator.clipboard.writeText()`を使用（モダンな方法）し、フォールバック機能も実装
