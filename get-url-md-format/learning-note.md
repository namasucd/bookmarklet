# get-url-md-formatで覚えておくべきこと

## 1. `querySelector`の戻り値と判定

```javascript
const element = document.querySelector('selector');
// 戻り値: 見つかった場合はElement、見つからない場合はnull
// nullはfalsyなので、三項演算子や論理演算子で判定できる
element ? element.href : fallback  // 三項演算子
element?.href || fallback          // Optional chaining + 論理OR
```

**ポイント:**
- `querySelector`は`null`を返す（例外は投げない）
- `try-catch`は不要。戻り値の判定で十分
- `querySelectorAll`は空の`NodeList`を返す（`null`ではない）
- querySelectorは最初の1つだけを返す
    - 複数見つかっても、最初の1つだけ
- 全て欲しい場合はquerySelectorAllを使う

## 2. Clipboard APIの制約

```javascript
navigator.clipboard.writeText(text)
```

**制約:**
- HTTPS環境または`localhost`で動作
- 非同期API（`async/await`または`.then()`が必要）
- ユーザー操作（クリックなど）のコンテキスト内で実行する必要がある
- 権限エラーが発生する場合がある（フォールバックが必要）

**ブックマークレットでの注意:**
- `async`関数を即時実行する必要がある
- エラーハンドリングは必須

## 3. ブックマークレットの制約とパターン

**IIFE（即時実行関数式）:**
```javascript
javascript:(function() { /* code */ })()
javascript:(async function() { /* code */ })()
```

**注意点:**
- `javascript:`プロトコルで始める必要がある
- ワンライナー化する場合は改行・スペースを削除
- `async`関数を使う場合は`await`を正しく使う

## 4. textarea方式のフォールバックの注意点

```javascript
// 良い例
textBox.style.position = 'fixed';
textBox.style.left = '-9999px';  // または opacity: '0'
textBox.focus();  // select()の前にfocus()を呼ぶと確実
textBox.select();
```

**ポイント:**
- `select()`の前に`focus()`を呼ぶと確実
- `position: fixed` + `left: -9999px`で画面外に配置
- `opacity: 0`でも可視だが、`left: -9999px`の方が確実
- `textContent`ではなく`value`を使う（`textarea`の場合）

## 5. Optional Chaining（`?.`）の活用

```javascript
// 三項演算子
canonical ? canonical.href : fallback

// Optional Chaining（より簡潔）
canonical?.href || fallback

// ネストしたプロパティへの安全なアクセス
user?.address?.city  // 左から順に評価、途中でnull/undefinedならそこで止まってundefinedを返す
```

**動作の仕組み:**
- 左から右へ順に評価される
- 途中で`null`や`undefined`に当たったら、そこで評価を止めて`undefined`を返す（短絡評価）
- 全部通ったら最後の値を返す
- 親から順に「この要素はある?」と確認していき、全部ある場合のみ最終値を返す

**注意:**
- `canonical?.href`が`undefined`の場合、`||`でフォールバック
- `href`が空文字列の場合は`||`でフォールバックされる（意図しない場合あり）
- `??`（Nullish Coalescing）と組み合わせると、`null`/`undefined`の場合のみフォールバックできる

## 6. その他の関連API

**`document.location` vs `window.location`:**
- ほぼ同じだが、`document.location`は`Location`オブジェクトへの参照
- `window.location.href`の方が一般的

**Markdownリンクのエスケープ:**
```javascript
// タイトルに`[`や`]`が含まれる場合の考慮
title.replace(/[\[\]]/g, '\\$&')  // エスケープが必要な場合
```

## 7. エラーハンドリングのベストプラクティス

```javascript
// 段階的なフォールバック
if (navigator.clipboard?.writeText) {
  try {
    await navigator.clipboard.writeText(text);
    return;  // 成功したら終了
  } catch (err) {
    // フォールバックへ
  }
}
// 旧方式のフォールバック
```

**ポイント:**
- モダンな方法を先に試す
- 失敗したら段階的にフォールバック
- エラーをログに残すとデバッグしやすい

## まとめ

1. `querySelector`は`null`を返す → 三項演算子やOptional Chainingで判定
2. Clipboard APIは非同期で制約あり → フォールバック必須
3. ブックマークレットは`async`関数をIIFEで実行
4. textarea方式は`focus()`→`select()`の順序が重要
5. Optional Chainingでコードを簡潔にできる

特に`querySelector`の戻り値判定は、DOM操作でよく使うパターンなので覚えておくと便利。

