javascript:(
    function copyToClipBoard() {
        let title = document.title;
        let href = document.location.href;
        let mdlinkText= '['+title+']'+'('+getCanonical()+')';
        let textBox = document.createElement("textarea");
        textBox.setAttribute("id", "target");
        textBox.setAttribute("type", "hidden");
        textBox.textContent = mdlinkText;
        document.body.appendChild(textBox);
    
        textBox.select();
        document.execCommand('copy');
        document.body.removeChild(textBox);
        
        function getCanonical(){
            try{
                return document.querySelector('link[rel="canonical"]').href
            }catch{
                return document.location.href;
            }
        }
})()
