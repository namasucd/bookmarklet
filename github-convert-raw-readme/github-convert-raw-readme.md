## 挙動
- GitHubリポジトリのトップページ（`/owner/repo`形式）で実行すると、そのリポジトリのREADME.mdを取得してクリップボードにコピーする
- コピーされる内容は以下の形式：
  - ページタイトル（`# タイトル`）
  - README.mdの内容
  - ソースURL（`Source: https://github.com/owner/repo`）
- `raw.githubusercontent.com`を使用してREADME.mdの生の内容を取得

## ポイント
- `window.location.pathname.match(/^\/[^\/]+\/[^\/]+$/)`でGitHubリポジトリのトップページかチェック
- `window.location.href.replace('github.com', 'raw.githubusercontent.com')`でraw URLに変換
- `async/await`を使用して非同期処理を記述
- `fetch()`でREADME.mdの内容を非同期取得
- デフォルトブランチをメタデータから取得（`meta[name="octolytics-dimension-repository_default_branch"]`）
- フォールバックとして、ブランチ選択ボタンやファイルツリーリンクからも取得を試みる
- デフォルトブランチでREADME.mdが見つからない場合、`main`と`master`も順に試す
- `navigator.clipboard.writeText()`を使用（モダンな方法）
- フォールバックとして`document.execCommand('copy')`方式も実装
- `document.createElement("textarea")`でエレメントを作成（フォールバック時）
- エレメントにStringを代入するときは`value`を使用（`textarea`の場合）
- 作ったエレメントを`document.body.appendChild()`でDOMに入れる
- エレメントを`select()`し、`document.execCommand('copy')`でクリップボードにコピー（フォールバック時）
- `append`したら`remove`をセットで

## 注意点
- GitHubリポジトリのトップページでない場合はエラーメッセージを表示

## 試行錯誤

### async/awaitへの変更
**問題:**
- `.then()`/`.catch()`チェーンでコードが複雑
- `navigator.clipboard.writeText()`が非同期なのに`await`を使っていない

**解決:**
- 関数を`async function`に変更
- `.then()`/`.catch()`チェーンを`await`と`try-catch`に置き換え
- エラーハンドリングを統一

**結果:**
- コードが読みやすくなった
- エラーハンドリングが統一された

### ブランチ名の自動検出
**問題:**
- ブランチ名が`main`固定で、デフォルトブランチが`master`やその他の場合に動作しない

**試行1: GitHub APIを使用**
```javascript
const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
const apiResponse = await fetch(apiUrl);
```
- **結果:** CORSエラーで取得できない

**試行2: DOMから取得（ブランチ選択ボタン）**
```javascript
const branchSelect = document.querySelector('summary[data-view-component="true"] span[title]');
```
- **結果:** セレクターが不正確で取得できない

**試行3: DOMから取得（ファイルツリーリンク）**
```javascript
const fileTreeLink = document.querySelector('a[data-pjax="#repo-content-pjax-container"]');
```
- **結果:** トップページには`/tree/`のリンクがない場合がある

**解決: メタデータから取得**
```javascript
const metaBranch = document.querySelector('meta[name="octolytics-dimension-repository_default_branch"]');
```
- **結果:** 成功！GitHubが提供するメタタグから確実に取得できる
- フォールバックとして、ブランチ選択ボタンやファイルツリーリンクからも取得を試みる

**学んだこと:**
- メタデータはページ構造に依存しないため、最も確実な方法
- 複数の方法を試すことで、より堅牢なコードになる

## 修正予定
- `textArea`のスタイル設定（`position: fixed` + `opacity: 0`）
- `textArea.select()`の前に`focus()`を追加
- エラーハンドリングの改善（`alert`以外の方法を検討）
- URLの末尾スラッシュ処理
- `document.title`のMarkdownエスケープ
- `removeChild`のエラーハンドリング

## ワンライナー(ブックマークレット用)
```javascript
javascript:(async function(){'use strict';if(window.location.pathname.match(/^\/[^\/]+\/[^\/]+$/)){try{let defaultBranch='main';const metaBranch=document.querySelector('meta[name="octolytics-dimension-repository_default_branch"]');if(metaBranch){const branchContent=metaBranch.getAttribute('content');if(branchContent){defaultBranch=branchContent;}}if(defaultBranch==='main'){const branchButton=document.querySelector('button[data-hotkey="w"]')||document.querySelector('summary[data-view-component="true"]')||document.querySelector('[data-testid="branch-selector"]');if(branchButton){const branchText=branchButton.textContent?.trim()||branchButton.querySelector('span')?.textContent?.trim()||branchButton.getAttribute('title');if(branchText&&branchText!=='Switch branches or tags'&&branchText.length<50){defaultBranch=branchText;}}}if(defaultBranch==='main'){const fileTreeLinks=document.querySelectorAll('a[href*="/tree/"]');for(const link of fileTreeLinks){const href=link.getAttribute('href');if(href){const branchMatch=href.match(/\/tree\/([^\/]+)/);if(branchMatch&&branchMatch[1]!=='main'&&branchMatch[1]!=='master'){defaultBranch=branchMatch[1];break;}}}}let response=null;const branchesToTry=[defaultBranch];if(defaultBranch!=='main'){branchesToTry.push('main');}if(defaultBranch!=='master'){branchesToTry.push('master');}for(const branch of branchesToTry){const rawUrl=window.location.href.replace('github.com','raw.githubusercontent.com')+`/${branch}/README.md`;response=await fetch(rawUrl);if(response.ok)break;}if(!response||!response.ok)throw new Error('README.mdが見つかりません');const content=await response.text();const markdown=`# ${document.title}\n\n${content}\n\nSource: ${window.location.href}`;try{await navigator.clipboard.writeText(markdown);}catch(err){const textArea=document.createElement('textarea');textArea.value=markdown;document.body.appendChild(textArea);textArea.select();document.execCommand('copy');document.body.removeChild(textArea);}alert('README.mdをクリップボードにコピーしました！');}catch(error){alert('エラー: '+error.message);}}else{alert('このページはGitHubリポジトリのトップページではありません。');}})();
```

