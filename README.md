# typora-heading-tag-advice
让typora在编写时可自动生成标题的序号。如1.1.1

# 使用方法
## 1、找到frame.js
在`typora/resources/app/app/window/`目录下找到`frame.js`，使用过格式化工具使其可编辑。
找到如下位置代码(大概在1200~1220行)

```js
  switch (this.get("type")) {
            case o.meta_block:
                var g = this.get("text") || "";
                return g.match(/^\n/g) && (g = g.replace(/^\n/g, "\n\n")),
                "<pre " + m(this) + " class='md-meta-block md-end-block' >" + a.escape(g, !1, !0) + "\n</pre>";
            case o.paragraph:
                return "<p " + m(this) + " class='md-end-block'>" + p(this) + "</p>";
            case o.raw_edit:
                return "<p class='rawedit' contenteditable ='true' " + m(this) + ">" + this.safeGetStrAttr("text", !0) + "</p>";
            case o.heading:
                return "<h" + this.get("depth") + m(this) +"onblur='onHeadingTagBlur(event)'"+ " class='md-end-block md-heading' >" + p(this) + "</h" + this.get("depth") + ">";
            case o.blockquote:
                return "<blockquote " + m(this) + " >" + p(this) + "</blockquote>";
```
找到`case o.heading`代码块，这里是生成`h1-h6`标签的地方。给标签添加一个`onblue事件`，使其失去焦点时可以调用我们一会在下面`window.html`中添加的方法。

## 2、找到window.html
在`/typora/resources/app/`目录下找到`window.html`文件，在文件最后的`script`标签中添加如下代码:

```js

/**
*主方法，失去焦点时被执行
*/
const onHeadingTagBlur=function(evt){
			let tag=evt.target;
      //找到所有的标题标签
			let headingNodes=document.querySelectorAll(".md-heading");
      
			for(let i=0;i<headingNodes.length;i++){
          //每个依次处理
					doEachHeadingTag(headingNodes[i],i,headingNodes);
			}
};
//找到兄弟标签
const findPreviousTag=function(tags,index){
			if(index===0)return null;
			let tag=tags[index];
			let findTag=null;
			for(let i=index;i-- >0;){
				findTag=tags[i];
				if(findTag.tagName<tag.tagName){
					return null;
				}
				if(findTag.tagName===tag.tagName){
					return findTag;
				}
			}
			return null;
};
				
				
const doEachHeadingTag=function(tag,index,tags){
			const tagName=tag.tagName;
			let tagChildSeq=1;
			let tagHeadingMark="";
			let tagParentHeading=null;
			let previousTag=findPreviousTag(tags,index);
			if(previousTag){
				tagParentHeading=previousTag.parentHeading;
				tagChildSeq=previousTag.childSeq+1;
			}else{
				tagParentHeading=tags[index-1];
				tagChildSeq=1;
			}
			if(tagParentHeading){
				tagHeadingMark=tagParentHeading.headingMark+"."+tagChildSeq;
			}else{
				tagHeadingMark=""+tagChildSeq;
			}
			tag.parentHeading=tagParentHeading;
			tag.headingMark=tagHeadingMark;
			tag.childSeq=tagChildSeq;
			
			const textSpan=tag.querySelector("span");
			let textSpanContent=textSpan.textContent;
			let markEndIndex=textSpanContent.indexOf("、");
			if(markEndIndex!=-1){
				textSpanContent=textSpanContent.substr(markEndIndex+1);
			}
			textSpan.textContent=tagHeadingMark+"、"+textSpanContent;			
};

```


