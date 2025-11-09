javascript:(
  async function () {
    'use strict';
    // GitHubリポジトリのトップページかチェック
    if (window.location.pathname.match(/^\/[^\/]+\/[^\/]+$/)) {
      try {
        const rawUrl = window.location.href
          .replace('github.com', 'raw.githubusercontent.com')
          + '/main/README.md';

        const response = await fetch(rawUrl);
        if (!response.ok) throw new Error('README.mdが見つかりません');
        const content = await response.text();

        const markdown =
          `# ${document.title}\n\n`
          + `${content}\n\n`
          + `Source: ${window.location.href}`;

        try {
          await navigator.clipboard.writeText(markdown);
          alert('README.mdをクリップボードにコピーしました！');
        } catch (err) {
          // フォールバック: execCommand 方式
          const textArea = document.createElement('textarea');
          textArea.value = markdown;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          alert('README.mdをクリップボードにコピーしました！');
        }
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
// javascript:(async function(){'use strict';if(window.location.pathname.match(/^\/[^\/]+\/[^\/]+$/)){try{const rawUrl=window.location.href.replace('github.com','raw.githubusercontent.com')+'/main/README.md';const response=await fetch(rawUrl);if(!response.ok)throw new Error('README.mdが見つかりません');const content=await response.text();const markdown=`# ${document.title}\n\n${content}\n\nSource: ${window.location.href}`;try{await navigator.clipboard.writeText(markdown);}catch(err){const textArea=document.createElement('textarea');textArea.value=markdown;document.body.appendChild(textArea);textArea.select();document.execCommand('copy');document.body.removeChild(textArea);}alert('README.mdをクリップボードにコピーしました！');}catch(error){alert('エラー: '+error.message);}}else{alert('このページはGitHubリポジトリのトップページではありません。');}})();
