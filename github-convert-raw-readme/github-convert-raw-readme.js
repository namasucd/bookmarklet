javascript:(
  async function () {
    'use strict';
    // GitHubリポジトリのトップページかチェック
    if (window.location.pathname.match(/^\/[^\/]+\/[^\/]+$/)) {
      try {
        // デフォルトブランチをDOMから取得（複数の方法を試す）
        let defaultBranch = 'main';
        
        // 方法1: メタデータから取得（最も確実）
        const metaBranch = document.querySelector('meta[name="octolytics-dimension-repository_default_branch"]');
        if (metaBranch) {
          const branchContent = metaBranch.getAttribute('content');
          if (branchContent) {
            defaultBranch = branchContent;
          }
        }
        
        // 方法2: ブランチ選択のボタンから取得
        if (defaultBranch === 'main') {
          const branchButton = document.querySelector('button[data-hotkey="w"]') || 
                               document.querySelector('summary[data-view-component="true"]') ||
                               document.querySelector('[data-testid="branch-selector"]');
          if (branchButton) {
            const branchText = branchButton.textContent?.trim() || 
                               branchButton.querySelector('span')?.textContent?.trim() ||
                               branchButton.getAttribute('title');
            if (branchText && branchText !== 'Switch branches or tags' && branchText.length < 50) {
              defaultBranch = branchText;
            }
          }
        }
        
        // 方法3: ファイルツリーのリンクから取得
        if (defaultBranch === 'main') {
          const fileTreeLinks = document.querySelectorAll('a[href*="/tree/"]');
          for (const link of fileTreeLinks) {
            const href = link.getAttribute('href');
            if (href) {
              const branchMatch = href.match(/\/tree\/([^\/]+)/);
              if (branchMatch && branchMatch[1] !== 'main' && branchMatch[1] !== 'master') {
                defaultBranch = branchMatch[1];
                break;
              }
            }
          }
        }

        // README.mdを取得（デフォルトブランチから試す）
        let response = null;
        const branchesToTry = [defaultBranch];
        
        // デフォルトブランチがmainでない場合、mainとmasterも試す
        if (defaultBranch !== 'main') {
          branchesToTry.push('main');
        }
        if (defaultBranch !== 'master') {
          branchesToTry.push('master');
        }

        for (const branch of branchesToTry) {
          const rawUrl = window.location.href
            .replace('github.com', 'raw.githubusercontent.com')
            + `/${branch}/README.md`;
          response = await fetch(rawUrl);
          if (response.ok) break;
        }

        if (!response || !response.ok) throw new Error('README.mdが見つかりません');
        const content = await response.text();

        const markdown =
          `# ${document.title}\n\n`
          + `${content}\n\n`
          + `Source: ${window.location.href}`;

        // クリップボードにコピー
        // ブックマークレットからnavigator.clipboard.writeTextを直接呼ぶと
        // "Document is not focused"エラーになることがあるため、
        // フォールバック方式（execCommand）を優先して使用
        const textArea = document.createElement('textarea');
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        textArea.value = markdown;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        if (textArea.parentNode) {
          document.body.removeChild(textArea);
        }
        alert('README.mdをクリップボードにコピーしました！');
      } catch (error) {
        alert('エラー: ' + error.message);
      }
    } else {
      alert('このページはGitHubリポジトリのトップページではありません。');
    }
  }
)();

// 旧版ワンライナー
// javascript:(function(){'use strict';if(window.location.pathname.match(/^\/[^\/]+\/[^\/]+$/)){const rawUrl=window.location.href.replace('github.com','raw.githubusercontent.com')+'/main/README.md';fetch(rawUrl).then(response=>{if(!response.ok)throw new Error('README.mdが見つかりません');return response.text();}).then(content=>{const markdown=`# ${document.title}\n\n${content}\n\nSource: ${window.location.href}%60;navigator.clipboard.writeText(markdown).then(()=>alert('README.mdをクリップボードにコピーしました！')).catch(err=>{const textArea=document.createElement('textarea');textArea.value=markdown;document.body.appendChild(textArea);textArea.select();document.execCommand('copy');document.body.removeChild(textArea);alert('README.mdをクリップボードにコピーしました！');});}).catch(error=>alert('エラー: '+error.message));}else{alert('このページはGitHubリポジトリのトップページではありません。');}})();

// 新版ワンライナー
// javascript:(async function(){'use strict';if(window.location.pathname.match(/^\/[^\/]+\/[^\/]+$/)){try{let defaultBranch='main';const metaBranch=document.querySelector('meta[name="octolytics-dimension-repository_default_branch"]');if(metaBranch){const branchContent=metaBranch.getAttribute('content');if(branchContent){defaultBranch=branchContent;}}if(defaultBranch==='main'){const branchButton=document.querySelector('button[data-hotkey="w"]')||document.querySelector('summary[data-view-component="true"]')||document.querySelector('[data-testid="branch-selector"]');if(branchButton){const branchText=branchButton.textContent?.trim()||branchButton.querySelector('span')?.textContent?.trim()||branchButton.getAttribute('title');if(branchText&&branchText!=='Switch branches or tags'&&branchText.length<50){defaultBranch=branchText;}}}if(defaultBranch==='main'){const fileTreeLinks=document.querySelectorAll('a[href*="/tree/"]');for(const link of fileTreeLinks){const href=link.getAttribute('href');if(href){const branchMatch=href.match(/\/tree\/([^\/]+)/);if(branchMatch&&branchMatch[1]!=='main'&&branchMatch[1]!=='master'){defaultBranch=branchMatch[1];break;}}}}let response=null;const branchesToTry=[defaultBranch];if(defaultBranch!=='main'){branchesToTry.push('main');}if(defaultBranch!=='master'){branchesToTry.push('master');}for(const branch of branchesToTry){const rawUrl=window.location.href.replace('github.com','raw.githubusercontent.com')+`/${branch}/README.md`;response=await fetch(rawUrl);if(response.ok)break;}if(!response||!response.ok)throw new Error('README.mdが見つかりません');const content=await response.text();const markdown=`# ${document.title}\n\n${content}\n\nSource: ${window.location.href}`;const textArea=document.createElement('textarea');textArea.style.position='fixed';textArea.style.opacity='0';textArea.value=markdown;document.body.appendChild(textArea);textArea.focus();textArea.select();document.execCommand('copy');if(textArea.parentNode){document.body.removeChild(textArea);}alert('README.mdをクリップボードにコピーしました！');}catch(error){alert('エラー: '+error.message);}}else{alert('このページはGitHubリポジトリのトップページではありません。');}})();
