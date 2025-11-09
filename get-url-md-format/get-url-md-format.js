javascript:(
	async function copyToClipBoard() {
		let title = document.title;
		let mdlinkText = '[' + title + '](' + getCanonical() + ')';
		
		function getCanonical() {
			const canonical = document.querySelector('link[rel="canonical"]');
			return canonical ? canonical.href : document.location.href;
		}
		
		try {
			await navigator.clipboard.writeText(mdlinkText);
			// 成功時のフィードバック（オプション）
			console.log('コピーしました: ' + mdlinkText);
		} catch (err) {
			// フォールバック: 旧方式に戻す
			let textBox = document.createElement("textarea");
			textBox.textContent = mdlinkText;
			textBox.style.position = 'fixed';
			textBox.style.opacity = '0';
			document.body.appendChild(textBox);
			textBox.select();
			document.execCommand('copy');
			document.body.removeChild(textBox);
		}
	}
)()

// 旧方式ワンライナー
// javascript:(function copyToClipBoard(){let title=document.title;let href=document.location.href;let mdlinkText='['+title+']'+'('+getCanonical()+')';let textBox=document.createElement("textarea");textBox.setAttribute("id","target");textBox.setAttribute("type","hidden");textBox.textContent=mdlinkText;document.body.appendChild(textBox);textBox.select();document.execCommand('copy');document.body.removeChild(textBox);function getCanonical(){try{return document.querySelector('link[rel="canonical"]').href}catch{return document.location.href;}}})()

// 新版ワンライナー
// javascript:(async function copyToClipBoard(){let title=document.title;let mdlinkText='['+title+']('+getCanonical()+')';function getCanonical(){const canonical=document.querySelector('link[rel="canonical"]');return canonical?canonical.href:document.location.href;}try{await navigator.clipboard.writeText(mdlinkText);}catch(err){let textBox=document.createElement("textarea");textBox.textContent=mdlinkText;textBox.style.position='fixed';textBox.style.opacity='0';document.body.appendChild(textBox);textBox.select();document.execCommand('copy');document.body.removeChild(textBox);}})()
