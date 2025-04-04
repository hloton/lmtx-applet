<template>
    <scroll-view
        class="scroll-view"
        :style="styles"
        refresher-default-style="none"
        :refresher-triggered="loading"
        @refresherrefresh="refresh"
        @refresherpulling="pulling"
        @refresherrestore="offsetTop = 0"
        @refresherabort="offsetTop = 0"
        @scroll="scrolling"
        scroll-y
        scroll-anchoring
        id="scrollView"
    >
        <view class="refresher" :style="refresherStyle">
            <slot class="refresher-inner" name="refresher" :state="refreshState">
                {{ refreshState }}
            </slot>
        </view>
        <slot class="content" name="content"></slot>
        <slot name="bottom">---这是底线---</slot>
    </scroll-view>
</template>
<script>
let timer;
export default {
    data() {
        return {
            loading: false,
            canPull: true,
            offsetTop: 0,
            scrollTop: 0
        };
    },
    props: {
        // 滚动视图的样式
        styles: {
            type: [String, Object, Array],
            require: true
        },
        // 下拉刷新高度 默认45
        refreshHeight: {
            type: Number,
            default: 45
        }
    },
    computed: {
        refresherStyle() {
            let top;
            if (this.offsetTop > this.refreshHeight) {
                top = this.refreshHeight;
            } else {
                top = this.offsetTop;
            }
            const height = this.offsetTop < this.refreshHeight ? 0 : this.offsetTop;

            return {
                top: 0 - this.refreshHeight + top + "px",
                "min-height": height + "px"
            };
        },
        refreshState() {
            if (this.loading) {
                return "正在刷新";
            } else if (this.offsetTop < this.refreshHeight) {
                return "下拉立即刷新";
            } else if (this.offsetTop >= this.refreshHeight) {
                return "释放立即刷新";
            } else {
                return "刷新成功";
            }
        }
    },
    methods: {
        scrolling(e) {
            this.$emit("scroll", e);
            this.canPull = e.target.scrollTop < 10;
            clearTimeout(timer);
            // this.scrollTop = e.target.scrollTop;
            timer = setTimeout(() => {
                this.scrollTop = e.target.scrollTop;
            }, 30);
        },
        pulling(e) {
            console.log(e.touches[0].pageY, e.touches[0].clientY, e.detail.deltaY - this.scrollTop, e);
            this.offsetTop = e.detail.deltaY - this.scrollTop;
        },
        refresh() {
            this.$emit("refresh", !this.loading);
            this.loading = true;
            this.offsetTop = this.refreshHeight;
        },
        loaded() {
            this.loading = false;
            this.offsetTop = 0;
        }
    }
};
</script>

<style>
.scroll-view {
    position: relative;
}

.refresher {
    width: 100%;
    text-align: center;
    display: flex;

    vertical-align: bottom;
    position: absolute;
    left: 0;
    top: -45px;
}

.refresher-inner {
    display: flex;
    align-items: center;
}
</style>
