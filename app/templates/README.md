# 前端

## 开发

1. 项目准备：

    依赖项：
    * [nodejs](https://nodejs.org/)
    * [yarn](https://yarnpkg.com/en/docs/install#windows-tab)
    * bower
        ```sh
        npm install -g yarn --registry=https://registry.npm.taobao.org
        ```

    初始化：  
    分别打开两个 terminal 分别输入：  
     ```sh
     # 第一个终端里 ，安装 nodejs 模块用于 项目开发
     yarn install
     # 第二个终端里 ，安装 bower 依赖 提供前端第三方组件
     bower install
     ```

2. 开发调试：

* 开始开发：
    ```sh
    # 在终端中打开项目根目录，然后执行 gulp 命令即可
    # 这样终端会自动编译好相关的代码，并监视 src 目录的js css html 文件变化
    # 并会在出现变动的时候自动刷新浏览器。
    gulp
    ```
    **提示：** 如果提示 gulp 未安装，请使用 cnpm install -g gulp 命令进行安装

<!-- * 生成 controller 代码

  在 js 文件中 敲 ngctrl 按 tab 或者回车键即可。
* 生成 state 代码  

  在 js 文件中 敲 ngstate 按 tab 或者回车键即可。
* 生成 service 代码  

  在 js 文件中 敲 ngservice 按 tab 或者回车键即可。 -->

## 特性
* 自动监视目录文件变化
    - 监视 state 文件变化（增删改），自动合并到 app.other.state.js
    - 监视目录变化，自动刷新浏览器页面
* 对指定 css js 文件进行压缩
* 使用 sass 根据主题定制样式后生成 css 和 min 样式文件
* 对开发模式和生产模式区分
    - 开发模式下 加载未压缩 js css
    - 生产模式下 加载已压缩 js css
* 使用模板创建 controller router service 代码
