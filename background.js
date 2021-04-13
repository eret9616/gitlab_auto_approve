let map = new Map()

chrome.runtime.onMessage.addListener((data,sender,sendResponse) => {

    if (data.type === 'notification') {
      const opt = JSON.parse(JSON.stringify(data.options))
      const customField = opt.customField
      delete opt.customField

        chrome.notifications.create(opt,(notificationId)=>{

        let notif = {
            tabId:sender.tab.id,
            notificationId,
            isApprove:!!customField.approve,
            timer:undefined,
        }

        map.set(notificationId,notif)

        notif.timer = setTimeout(function(){    

            chrome.notifications.clear(notificationId);
            chrome.tabs.remove(sender.tab.id)
            map.delete(notificationId)

        }, customField.lasting);
        


      });


    }
});



chrome.notifications.onClicked.addListener((notificationId)=>{
    let data = map.get(notificationId)
    clearTimeout(data.timer)
    chrome.notifications.clear(notificationId);
    chrome.tabs.update(data.tabId, {active: true})

    if(data.isApprove){
        chrome.tabs.sendMessage(data.tabId,"stopAppr"); 
    }

    map.delete(notificationId)
})


