# 作成したブックマークレットの置き場

## 1. get-md-link
### 概要
- 開いているページのタイトルとURLを **\[タイトル](url)** の形式でクリップボードにコピーする
- 参考：[Chrome Dev Toolでブックマークレットを実行する - Qiita](https://qiita.com/kanaxx/items/0fe8e7e2deea482960b0)
### issue
- クリップボードに任意のStringをコピーすることができない
- これではダメ
```JavaScript
    var text = document.createElement("textarea");
    text.value = mdLink;
    text.select();
    document.execCommand("Copy");
    text.parentNode.removeChild(text);
```
### 参考
- [Chrome Dev Toolでブックマークレットを実行する - Qiita](https://qiita.com/kanaxx/items/0fe8e7e2deea482960b0)