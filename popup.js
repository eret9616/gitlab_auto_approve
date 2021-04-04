const app = Vue.createApp({
    template:`
    <span @click='handleToggle'>
    <button v-if='isEnable'>关闭</button>
    <button v-else>开启</button>
    </span>
    `,
    data(){
        return {
            isEnable:true
        }
    },
    created(){
        // 在这里找isEnable
        chrome.storage.sync.get('status',(result)=>{
            this.isEnable = !!result.status
        })
    },
    methods:{
        handleToggle(){
            chrome.storage.sync.set({status:!this.isEnable},()=>{
                this.isEnable = !this.isEnable
            })
        }
    }
})
app.mount('#app')

