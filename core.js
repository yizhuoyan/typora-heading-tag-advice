const onHeadingTagBlur=function(evt){
			let tag=evt.target;
			let headingNodes=document.querySelectorAll(".md-heading");
			for(let i=0;i<headingNodes.length;i++){
					doEachHeadingTag(headingNodes[i],i,headingNodes);
			}
		}
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
