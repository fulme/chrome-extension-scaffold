### chrome扩展开发脚手架
对于网站开发，现成的框架、工具一抓一大把，但对于chrome扩展开发这种小众的领域却极少存在类似的框架或者工具之类的东西。每次开发都是重复地创建项目结构，东拼西凑压缩、混淆、打包工具或者就是直接复制其他项目，删除实现部分留下框架结构。这样做其实也花不了多少时间，但是却难以通用、很不优雅。

之所以没有现成的框架或者工具，除了需求小众以外，大概还有以下几个方面的原因：
**扩展需求通常简单**
扩展开发需求一般都比较简单，代码量通常比较少。为此搞一套周全的框架结构，总觉得有点小题大做。
**扩展运行机制复杂**
扩展的运行机制跟网站还不一样，有多个运行环境（popup、option、background、content script（下称：CS）、injection等），需要处理的情况很多。
**CS代码加载机制与页面不同**
页面可以通过创建`script`标签动态加载代码（requirejs、sea.js等框架就是这么做的），但`CS`是在一个隔离的环境不能通过创建`script`标签加载，所以amd、cmd、umd之类的框架一下就全部阵亡了。这里通过重写requirejs的load方法勉强支持了`amd`方式加载CS代码。
之所以说勉强是因为这样做事有损且不优雅的，这样做有两个问题：
1. 都是通过`eval`方式注入了代码，不方便调试了，在开发者工具中看到不动态加载的js代码了
2. 需要在manifest.json文件的`web_accessible_resources`字段挨个逻辑需要加载的脚本

### 支持的功能
- 自动将sass编译成css
- 自动将es6编译成es5
- 统一通过amd方式组织popup、background、CS等运行环境的js代码
- 分别压缩、混淆popup、background、CS等运行环境的代码
- js、css、html压缩
- crx打包

### 代码组织结构
除了manifest.json、img目录以外其他都是非必须，根据具体情况添加或者删除即可（注意相应地修改manifest.json文件中相应的字段）。
```html
.
├── _locales  用于支持国际化的字符串变量
├── css       css资源，包括styles目录编译后的css文件
├── es6       es6源代码目录，此目录下得代码会自动编译成es5代码并拷贝到js目录
├── img       图片资源
├── js        js源码，包括es6目录代码编译后的代码
├── lib       公共库文件，包括js、css、img等资源
├── styles    sass源码，会自动编译并拷贝到css目录
├─
├─
├── bg.html    background页面
├── pop.html   popup页面
├── bg.js      background页面入口代码
├── pop.js     popup页面入口代码
├── content.js content script 入口代码
├── manifest.json
```

### 使用方法
#### 下载代码
```bash
git clone git@github.com:fulme/chrome-extension-scaffold.git demo
cd demo
npm install // 安装依赖
```
#### 生成pem文件
通过chrome浏览器扩展管理页面（chrome://extensions/）打包src目录（会生成src.pem）。
假设你的扩展名为demo，将package.json中的name字段改为demo，src.pem改成demo.pem。

#### coding & 编译
进入命令行`cd`到demo目录，运行`grunt`命令，然后就是coding了，当sass、es6代码发生变化时，会自动编译并拷贝到相应的目录。
通过扩展管理页面载入demo/src就可以查看效果了

#### 打包
开发完成后，运行`grunt build`命令就会自动编译、压缩、打包成crx文件了。

*PS：此工具主要是方便个人开发使用，也会不断地完善、改进，如果正好也能帮上你，纯属巧合。*



