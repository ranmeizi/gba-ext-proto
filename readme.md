# gba-ext-proto

一个运行 [gbajs](https://github.com/endrift/gbajs) 的谷歌拓展

## 安装拓展

使用 chrome 浏览器 ,菜单中找到 更多工具 -> 拓展程序

开发者模式(安装未打包拓展)：  
打开开发者模式，点击 加载已压缩的拓展程序，选择仓库的根目录

打包 crx 给朋友玩：  
点击 打包拓展程序，选择仓库的根目录

## 游玩

### rom 管理

1. 先打开 popup 页面(一个很像react logo的按钮)，里面点击setting进入setting页
2. 上传你的 gba rom，并点击 选择rom 当作当前运行的rom
3. 再打开 popup 页面，游戏就开始运行了

### 游戏按键

|gba|keyboard|
|---|---|
|A|Z|
|B|X|
|L|A|
|R|S|
|Start|Enter|
|Select|\|

可以通过setting 页配置按键映射

### 存档

1. popup 页面关闭时，自动存档

## 特点

1. 这个拓展最实用的地方是，他是通过 background 运行 gbajs，并且通过 connect 传输到 popup 渲染，这意味着，你可以在紧急时刻关闭 popup 页，并且不丢失当前游戏进度! 这是一个很酷的特性。
2. 拓展有一个 setting 页，对 rom 和 memo 进行了管理。

## 更新日志

### 1.0.0 

chrome message 支持传递对象了，替换之前序列化数组传递画面，渲染和gba运行更快了

### 1.1.0

添加了键盘的按键映射