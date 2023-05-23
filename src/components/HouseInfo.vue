<template>
    <div class="content">
        <div class="content-title">
            <p style="padding:50px;padding-bottom: 20px;">江西农业大学东区</p>
        </div>
        <div class="content-main">
            <div class="content-main-left">
                <img src="@/assets/logo.png" alt="">
            </div>
            <div class="content-main-right"></div>
        </div>
        
    </div>
</template>

<script>
    export default ({
        name: 'HouseInfo',
    })

</script>

<style scoped>
.content-title{
    position: relative;
    background-color: rgb(197, 144, 144);
    width: 95%; 
    left: 50%;
    transform: translate(-50%,-50%);
}
.content-main{
    position: relative;
    background-color: #ad4949;
    margin-top: 22.1vh;
    height: 55vh;
    width: 95%; 
    left: 50%;
    transform: translate(-50%,-50%);
}
.content-main-left{
    position: absolute;
    background-color: #280000;
    width: 45%;
    height: 100%;
}
</style>