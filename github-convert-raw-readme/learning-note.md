# github-convert-raw-readmeで覚えておくべきこと

## まとめ

1. `fetch()`でHTTPリクエストを送る → `response.ok`と`response.text()`で処理
2. メタデータから情報を取得 → ページ構造に依存しない確実な方法
3. 複数の取得方法をフォールバック → より堅牢なコード
4. `querySelectorAll()`とループ → 複数の要素を処理
5. 正規表現でURL解析 → `match()`とキャプチャグループ
6. 配列操作と条件分岐 → 動的に配列を構築
7. ブックマークレットでは`execCommand`が確実 → `navigator.clipboard`は使えない場合がある
8. `removeChild`前に存在確認 → エラーを防ぐ
9. URLの文字列操作 → `replace()`とテンプレートリテラル
10. エラーハンドリング → 複数の方法を試して、全て失敗した場合を考慮

特に、メタデータからの情報取得と、複数の方法をフォールバックするパターンは、堅牢なコードを書く上で重要。


## 1. `fetch()` APIの使い方

```javascript
const response = await fetch(url);
if (!response.ok) throw new Error('エラー');
const content = await response.text();
```

**ポイント:**
- `fetch()`は非同期API（`async/await`または`.then()`が必要）
- `response.ok`でHTTPステータスコードをチェック（200-299の範囲で`true`）
- `response.text()`でレスポンスボディをテキストとして取得
- エラーハンドリングは必須（ネットワークエラー、404など）

**ブックマークレットでの注意:**
- CORS制約がある（同一オリジンまたはCORSが許可されている必要がある）
- `raw.githubusercontent.com`はCORSを許可しているため使用可能

## 2. メタデータからの情報取得

```javascript
const metaBranch = document.querySelector('meta[name="octolytics-dimension-repository_default_branch"]');
if (metaBranch) {
  const branchContent = metaBranch.getAttribute('content');
}
```

**ポイント:**
- `<meta>`タグから情報を取得できる
- ページ構造に依存しないため、最も確実な方法
- `getAttribute('content')`でメタタグの内容を取得
- 存在しない場合は`null`を返す（エラーにならない）

**活用例:**
- SEO情報、OGP情報、カスタムメタデータなど
- ページ構造が変わっても影響を受けにくい

## 3. 複数の取得方法のフォールバック

```javascript
let defaultBranch = 'main';

// 方法1: メタデータから取得（優先）
const metaBranch = document.querySelector('meta[name="..."]');
if (metaBranch) {
  defaultBranch = metaBranch.getAttribute('content');
}

// 方法2: DOMから取得（フォールバック）
if (defaultBranch === 'main') {
  const button = document.querySelector('...');
  if (button) {
    defaultBranch = button.textContent;
  }
}
```

**ポイント:**
- 複数の方法を順番に試すことで、より堅牢なコードになる
- 優先度の高い方法から試す
- 取得できなかった場合のみ次の方法を試す

## 4. `querySelectorAll()`とループ処理

```javascript
const links = document.querySelectorAll('a[href*="/tree/"]');
for (const link of links) {
  const href = link.getAttribute('href');
  if (href) {
    // 処理
    break;  // 見つかったらループを抜ける
  }
}
```

**ポイント:**
- `querySelectorAll()`は`NodeList`を返す（配列風オブジェクト）
- `for...of`ループで各要素にアクセス
- `break`でループを途中で抜けられる
- 最初の1つだけ欲しい場合でも、`querySelectorAll()`で全て取得してからループする場合がある

## 5. 正規表現でのURL解析

```javascript
const href = '/tree/main/src';
const branchMatch = href.match(/\/tree\/([^\/]+)/);
if (branchMatch) {
  const branch = branchMatch[1];  // 'main'
}
```

**ポイント:**
- `match()`は正規表現にマッチした結果を配列で返す
- キャプチャグループ`()`で部分文字列を取得できる
- `branchMatch[0]`は全体のマッチ、`branchMatch[1]`は最初のキャプチャグループ
- マッチしない場合は`null`を返す

**正規表現のパターン:**
- `/\/tree\/([^\/]+)/` → `/tree/`の後に`/`以外の文字列をキャプチャ
- `[^\/]+` → `/`以外の文字が1文字以上

## 6. 配列操作と条件分岐

```javascript
const branchesToTry = [defaultBranch];

if (defaultBranch !== 'main') {
  branchesToTry.push('main');
}
if (defaultBranch !== 'master') {
  branchesToTry.push('master');
}

for (const branch of branchesToTry) {
  // 処理
  if (response.ok) break;
}
```

**ポイント:**
- `push()`で配列に要素を追加
- 条件に応じて配列を動的に構築
- `for...of`で配列をループ
- 成功したら`break`でループを抜ける

## 7. ブックマークレットでの`navigator.clipboard.writeText`の制約

```javascript
// ❌ ブックマークレットから直接呼ぶと失敗する
await navigator.clipboard.writeText(text);
// エラー: NotAllowedError: Document is not focused

// ✅ execCommand方式を使用
const textArea = document.createElement('textarea');
textArea.value = text;
document.body.appendChild(textArea);
textArea.focus();
textArea.select();
document.execCommand('copy');
document.body.removeChild(textArea);
```

**ポイント:**
- `navigator.clipboard.writeText()`は「ユーザー操作のコンテキスト内」で実行する必要がある
- ブックマークレットの実行タイミングによっては、ページがフォーカスされていない
- ブックマークレットでは`execCommand('copy')`の方が確実に動作する
- モダンなAPIが常に最適とは限らない

## 8. `removeChild`のエラーハンドリング

```javascript
if (textArea.parentNode) {
  document.body.removeChild(textArea);
}
```

**ポイント:**
- 要素が既に削除されている場合、`removeChild`はエラーになる
- `parentNode`が`null`の場合は、既にDOMから削除されている
- 削除前に存在確認することで、エラーを防ぐ

## 9. URLの文字列操作

```javascript
const rawUrl = window.location.href
  .replace('github.com', 'raw.githubusercontent.com')
  + `/${branch}/README.md`;
```

**ポイント:**
- `replace()`で文字列を置換（最初の1つだけ）
- テンプレートリテラル（バッククォート）で文字列を結合
- URLの構築は文字列操作で行う

## 10. エラーハンドリングのパターン

```javascript
let response = null;
for (const branch of branchesToTry) {
  response = await fetch(url);
  if (response.ok) break;
}

if (!response || !response.ok) {
  throw new Error('見つかりません');
}
```

**ポイント:**
- 複数の方法を試して、成功したらループを抜ける
- 全て失敗した場合のエラーハンドリング
- `response`が`null`の場合も考慮する
