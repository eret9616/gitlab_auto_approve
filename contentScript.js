chrome.storage.sync.get('status',(result=>{
  console.log('---getting status');
  
  let s = result.status
  if(s === undefined){
    // 第一次运行的时候，先设置开启
    chrome.storage.sync.set({status:true},function(){
      console.log('---status settled'); 
    })
  }else if (s === true){
    // 下面代码应该运行
  }else if (s === false){
    // 下面的代码都不运行
    return
  }


function sendNotification(customField,title,message){
  chrome.runtime.sendMessage({
    type: 'notification',
    options: {
      requireInteraction:true, // 时间好像和OS有关
      title,
      message,
      iconUrl:'assets/icon.png',
      type: 'basic',
      customField
    }
  });
}

const LASTING = 5

// 因为有骨架屏加载，所以放在这个里面了
setTimeout(()=>{

try{
    var btn = document.querySelector('button[data-qa-selector="approve_button"]')
    if(!btn) return
    const innerText = btn.querySelector('span').innerText
    if(innerText.trim() === 'Approve'){
      // 如果成功了，就发一个notification 
      //      notification显示3秒钟后关闭tab
      //      在notification中可以取消，取消之后就不关闭tab了
      btn?.click()
      sendNotification(
        {
          lasting:LASTING*1000,
          approve:true
        }
        ,'approved',`${LASTING}s to revert`)

    }else{
      // 发送一个消息，说并没有approve
      sendNotification({ lasting:LASTING*1000},'warning',`no approve btn`)
    }
}catch(e){
      sendNotification({ lasting:LASTING*1000},'err',`err in try catch ${e}`)
}

},800)


chrome.runtime.onMessage.addListener((data,sender,sendResponse) => {
  if(data === 'stopAppr'){
    // 取消approve
    var btn = document.querySelector('button[data-qa-selector="approve_button"]')
    btn?.click()
  }
})

}))