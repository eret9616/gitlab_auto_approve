const app = Vue.createApp({
    template:`
    <span @click='handleToggle'>
    <button v-if='isEnable'>Disable</button>
    <button v-else>Enable</button>
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

