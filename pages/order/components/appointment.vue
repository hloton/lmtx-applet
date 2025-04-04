<template>
	<view class="apoint-box box">
		<view class="unpaid-txt">
			预约信息
		</view>
		<view class="list-box">
			<view class="list-row" v-for="item in appointData">
				<view class="exp">
					{{item.title}}
				</view>
				<view class="row-right">
					{{item.value}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import orderData from'./orderType.js'
	export default {
		name:'orderAppointment',
		props:{
			orderData:{
				type:Object,
				default:()=>{
					return{}
				}
			}
		},
		data(){
			return{
				appointData:[]
			}
		},
		watch:{
			orderData(newValue,oldVlaue){
				this.dealWithOrder()
			}
		},
		created(){
			
		},
		methods:{
			dealWithOrder() {
				this.appointData = [];
				let originData = orderData[this.orderData.project_type]
				originData.forEach(item => {
					let obj = {
						title:item.title,
						key:item.key,
						value:''
					}
					if(this.orderData[item.key] != undefined){
						if(item.key == 'hospital_one') {   //医院拼接数据
							obj.value = this.orderData['hospital_one'] + ' ' + this.orderData['hospital_two'] 
							this.appointData.push(obj)
						}else if(item.key == 'patients_name'){   //就诊人
							obj.value = this.orderData['patients_name'] + ' '+ this.orderData['ext2'] + ' '+ this.orderData['ext3'] +'岁'
							this.appointData.push(obj)
							
							//加上额外字段
							let dataArr = [
								{
									title:'就诊关系',
									value:this.orderData['patients_relation']
								},
								{
									title:'就诊人电话',
									value:this.orderData['patients_phone']
								}
							]
							//合并两个数组为一个新的数组
							this.appointData = [...this.appointData,...dataArr]
						//如果是辅助问诊,添加联系人信息
							if(this.orderData.project_type == 3){
								this.appointData.push({
									title:'联系人信息',
									value:this.orderData['patients_name'] + ' '+ this.orderData['patients_phone']
								})
							}
						}else {
							
							obj.value = this.orderData[item.key] || '无'
							this.appointData.push(obj)
						}
					}
				})
				
				//是否有科室字段，有 - 则移动到置顶 的位置
				let ksIndex = this.appointData.findIndex(ele => {
					return ele.key == 'hospital_one'
				})
				if(ksIndex > -1) {
					this.appointData.unshift(this.appointData.splice(ksIndex , 1)[0]);
				}
				this.appointData.unshift({
					title:'就诊医院',
					key:'hospital_name',
					value:this.orderData.hospital_name
				})
				// 是否有期望就诊时间 - 有，这移动置顶位置
				let timeIndex = this.appointData.findIndex(ele => {
					return ele.key == 'hope_time'
				})
				if(timeIndex > -1) {
					this.appointData.unshift(this.appointData.splice(timeIndex , 1)[0]);
				}
				
				
				this.appointData.push({
					title:'行动是否方便',
					value:this.orderData['patients_is_walk'] == 1 ? '是' : '否'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
</style>