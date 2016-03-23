<style lang="less">
    @import './index.less';
    
    body {
        background-color: @tneme-body-color;
    }

    .anti-spider-header {
        height: 65px;
        background-color: @theme-header-color;
        color: @theme-header-font-color;
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
    }
    .anti-spider-main {
        .anti-spider-nav {
        }
        .anti-spider-content {

        }
    }

    .anti-spider-footer {
        .vertical-align(40px);
        text-align: center;
        color: #979797;
    }
</style>

<template>
    <header class="anti-spider-header">
        <button class="btn" @click="test">request</button>
    </header>

    <article class="anti-spider-main">
        <router-view></router-view>
    </article>

    <footer class="anti-spider-footer">&copy; 2015</footer>
</template>

<script>
    module.exports = {
        data: function () {
        },
        methods: {
            test: function () {
                fetch('mock/test?ab=hello')
                    .then(function (data) {
                        console.log(data);
                    })
            }
        },
        components: {
        }
    };
</script>
