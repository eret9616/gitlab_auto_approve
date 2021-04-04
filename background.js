let map = new Map()

function badge(){
    const size = map.size
    const text = size === 0 ? '':size.toString()
    chrome.browserAction.setBadgeText({text});
}

// notification只能通过message交互
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
        // badge()

        notif.timer = setTimeout(function(){    

            // 关闭 notification
            chrome.notifications.clear(notificationId);
            // 关闭 tab
            chrome.tabs.remove(sender.tab.id)
            map.delete(notificationId)
            // badge()


        }, customField.lasting);
        


      });


    }
});



//  Clicked in a non-button area of the notification.
chrome.notifications.onClicked.addListener((notificationId)=>{
    let data = map.get(notificationId)
    // 点击后，1 取消notification，2 页面不关闭了
    // 如果是给appr了，就取消appr
    clearTimeout(data.timer)
    chrome.notifications.clear(notificationId);
    chrome.tabs.update(data.tabId, {active: true})

    if(data.isApprove){
        // 取消approve的逻辑 revert
        chrome.tabs.sendMessage(data.tabId,"stopAppr"); 
    }

    map.delete(notificationId)
    // badge()
})


