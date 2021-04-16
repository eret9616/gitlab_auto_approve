chrome.storage.sync.get('status',(result=>{
  let s = result.status
  if(s === undefined){
    chrome.storage.sync.set({status:true})
  }else if (s === true){
  }else if (s === false){
    return
  }


function sendNotification(customField,title,message){
  chrome.runtime.sendMessage({
    type: 'notification',
    options: {
      requireInteraction:true, 
      title,
      message,
      iconUrl:'assets/icon.png',
      type: 'basic',
      customField
    }
  });
}


function approve(){
  var btn = document.querySelector('button[data-qa-selector="approve_button"]')
  if(btn){
    const innerText = btn.querySelector('span').innerText
    if(innerText.trim() === 'Approve'){
      btn?.click()
      sendNotification(
        {
          lasting:LASTING*1000,
          approve:true
        }
        ,'approved',`${LASTING}s to revert`)
    }
  } else{
    sendNotification({ lasting:LASTING*1000},'warning',`no approve btn`)
  }
}


// notification lasting seconds
const LASTING = 5


// initialize
setTimeout(()=>{
try{
    var btn = document.querySelector('button[data-qa-selector="approve_button"]')
    if(!btn) {
      if(window.location.href.includes('/diffs')){
          const overview =document.querySelector('a[data-target="#notes"]')
          overview.click()
          setTimeout(()=>{
            approve()
          },2500)
      }
      return
    }
    approve()
}catch(e){
      sendNotification({ lasting:LASTING*1000},'err',`err in try catch ${e}`)
}
},800)


chrome.runtime.onMessage.addListener((data,sender,sendResponse) => {
  if(data === 'stopAppr'){
    var btn = document.querySelector('button[data-qa-selector="approve_button"]')
    btn?.click()
  }
})

}))