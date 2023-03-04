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
|A|	Z|
|B|X|
|L|A|
|R|S|
|Start|Enter|
|Select|\|

### 存档

1. 进入setting页,再当前运行的rom上，点击 保存记忆卡

## 特点

1. 这个拓展最实用的地方是，他是通过 background 运行 gbajs，并且通过 connect 传输到 popup 渲染，这意味着，你可以在紧急时刻关闭 popup 页，并且不丢失当前游戏进度! 这是一个很酷的特性。
2. 拓展有一个 setting 页，对 rom 和 memo 进行了管理。

## TODO

1. 按键管理
2. audio api 的迁移 目前直接关闭音频的功能(虽然音频在这个场景一般是关闭的- -)
3. 我还没想清楚是按用户管理memo 还是单纯当作文件管理memo
