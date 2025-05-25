<template>
	<view class="staff-box">
		<top-navigation bgColor="#ffffff"><template #left-slot></template></top-navigation>
		<image src="/static/images/home/bg.png" class="title-bg" ></image>
		<view class="content">
			<view class="staff-item">
				<image :src="$getHost() + profile" class="avatar" mode="scaleToFill"></image>
				<view class="right">
					<view class="staff-name">{{ name }}</view>
					<view class="right-text u-flex u-row-around u-flex-2">
						<view>年龄:{{ old }}岁</view>
						<u-line direction="col" length="17" color="#333333"></u-line>

						<view>{{ sex }}</view>
						<u-line direction="col" length="17" color="#333333"></u-line>
						<view>{{ lengthOld }}年工龄</view>
					</view>
					<view class="profile u-flex u-col-top">
						<view class="profile-left">个人简介：</view>
						<view class="profile-right u-line-2">{{ brief }}</view>
						<!-- <text class="u-line-1" style="width: 50%;">个人简介：</text>
						<text class="u-line-2">{{ brief }}</text> -->
					</view>
				</view>
			</view>

			<view class="list-box u-flex u-flex-wrap u-row-between">
				<view class="list-row" v-for="(item, index) in serviceList" :key="item.project_id" @click="toDetail(item)">
					<view class="list-image u-flex u-row-center u-col-center"><u--image :src="$getImgUrl() + item.cover" width="136" height="136" radius="13" mode="widthFix"></u--image></view>

					<view class="list-title">{{ item.project_name }}</view>
					<view class="list-info u-line-2">{{ item.project_recommend }}</view>
					<view class="price">
						<text class="price-text">{{ item.is_price ? (item.original_price || '--') : (item.price || '--') }}</text>
						元/次
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
let requestBol = false;
// 深克隆
function deepCopy(value) {
	if (value instanceof Function) return value;
	else if (value instanceof Array) {
		var newValue = [];
		for (let i = 0; i < value.length; ++i) newValue[i] = deepCopy(value[i]);
		return newValue;
	} else if (value instanceof Object) {
		var newValue = {};
		for (let i in value) newValue[i] = deepCopy(value[i]);
		return newValue;
	} else return value;
}
export default {
	data() {
		return {
			brief: '',
			old: '',
			lengthOld: '',
			name: '',
			profile: '',
			sex: '',
			staffId: '',
			serviceList: []
		};
	},

	computed: {
		...mapGetters(['curAddress'])
	},
	onLoad(option) {
		this.brief = option.brief;
		this.old = option.old;
		this.lengthOld = option.length_old;
		this.name = option.name;
		this.profile = option.profile;
		this.sex = option.sex;
		this.staffId = option.staff_id;
		this.getStaffDetail();
	},

	methods: {
		getStaffDetail() {
			this.$request('/applet/staff/queryServeStaffListDetails', {
				staff_id: this.staffId
			}).then(res => {
				console.log('详细服务', res);
				if (res.success) {
					this.serviceList = [...this.serviceList, ...res.data];
				}
			});
		},
		toDetail(item) {
			this.$navto('/pages/order/project-info?id=' + item.project_id + '&from=3' + '&staffId=' + this.staffId, true);
		}
	}
};
</script>

<style lang="scss" scoped>
.staff-box {
	background-color: #f6f7fb;
}
.title-bg {
	position: absolute;
	top: 0;
	width: 750rpx;
	height: 408rpx;
}

.content {
	position: relative;
	top: 70rpx;
	padding: 30rpx;
	box-sizing: border-box;
	padding-bottom: 130rpx;
}

.staff-item {
	width: 690rpx;
	height: 260rpx;
	background: #ffffff;
	box-shadow: 0rpx 2rpx 16rpx 0rpx rgba(0, 0, 0, 0.16);
	border-radius: 20rpx;
	margin-bottom: 30rpx;
	padding: 30rpx;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	.avatar {
		width: 200rpx;
		height: 200rpx;
		margin-right: 26rpx;
		border-radius: 20rpx;
	}

	.right {
		height: 100%;
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		width: 404rpx;

		.staff-name {
			max-width: 400rpx;
			font-size: 32rpx;
			color: #333333;
			margin-right: 30rpx;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;

			font-weight: 500;
		}

		.right-text {
			color: #333333;
			font-weight: 400;
			font-size: 26rpx;
			max-width: 300rpx;
		}

		.introduce {
			max-width: 400rpx;
			font-size: 24rpx;
			font-weight: 500;
			color: #808080;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		.profile {
			width: 407rpx;
			height: 52rpx;
			font-size: 24rpx;
			font-weight: 400;
			color: #666666;
			.profile-left {
				display: inline-block;
				white-space: nowrap;
			}
		}
	}
}

.list-box {
	padding: 10rpx;
	padding-top: 50rpx;
	.list-row {
		width: 332rpx;
		background: #ffffff;
		box-shadow: 0rpx 2rpx 18rpx 0rpx rgba(0, 0, 0, 0.06);
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 80rpx;
		.list-image {
			
			
			//margin-top: -60rpx;
			//margin-bottom: 60rpx;

		}

		.list-title {
			min-width: 118rpx;
			height: 29rpx;
			font-size: 30rpx;
			font-family: PingFang;
			font-weight: bold;
			color: #333333;
		}
		.list-info {
			width: 275rpx;
			font-size: 24rpx;
			font-family: PingFang;
			font-weight: 500;
			color: #666666;
			line-height: 36rpx;
			margin-top: 30rpx;
		}

		.price {
			font-weight: 500;
			color: #333333;
			margin-top: 30rpx;
			font-size: 24rpx;
			.price-text {
				font-size: 36rpx;
				font-weight: bold;
				color: #ff4d4d;
				margin-right: 12rpx;
			}
		}
	}
}
</style>
