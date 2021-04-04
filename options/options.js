const app = Vue.createApp({
    template:`
        <div>
        <div>添加链接：(从左向右匹配)</div>
        <input type='text' v-model='inputModel'/>
        <button @click='handleAdd'>添加</button>
        <button @click='remove'>清除</button>
        <div>
            <ul>
                <li v-for='(item,index) in list' :key='index'>
                    {{item}}
                </li>
            </ul>
        </div>
        </div>`,
    data(){
        return {
            inputModel:undefined,
            list:[]
        }
    },
    methods:{
        handleAdd(){
            this.list.push(this.inputModel);
            // 添加到chrome中 sync
            chrome.storage.sync.set({'list':this.list},()=>{
                chrome.storage.sync.get('list',(result)=>{})
            })
            this.inputModel = ''
        },
        remove(){
            this.list=[];
            this.inputModel = ''
            chrome.storage.sync.set({'list':[]},()=>{})
        }
    },
    created(){
        // 获取当前的集合 添加到上面
        chrome.storage.sync.get('list',(result)=>{
            if(result?.list){
                if(Object.keys(result.list).length){
                    let list=[]
                    for(let i in result.list){
                        list.push(result.list[i])
                    }
                    this.list = list
                }
            }
        })
    }
})
app.mount('#app')