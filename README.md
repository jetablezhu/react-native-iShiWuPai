## iShiWuPai
升级react-native到0.59版本，对应的navigation和flatlist等替换组件。
支持全面屏、异形屏（safareaview），组件重构。

## 运行截图
![食物百科](https://github.com/ljunb/react-native-iShiWuPai/blob/alpha/screenshot/food.png)
![逛吃](https://github.com/ljunb/react-native-iShiWuPai/blob/alpha/screenshot/feed.png)
![资讯详情](https://github.com/ljunb/react-native-iShiWuPai/blob/alpha/screenshot/info_detail.png)
![食物分类](https://github.com/ljunb/react-native-iShiWuPai/blob/alpha/screenshot/foods.png)
![我的](https://github.com/ljunb/react-native-iShiWuPai/blob/alpha/screenshot/profile.png)

## 现有功能点
1. 食物百科、食物列表、二维码扫描、逛吃、逛吃详情、我的和登录等界面的UI搭建
2. 基于MobX实现状态栏颜色和数据管理
3. 二维码扫描成功添加等待提示
4. 网络状态检测高阶组件NetInfoDecorator的初级使用
5. 逛吃顶部Tab标题切换时，添加scale和color动画

## 运行

```
$ git clone https://github.com/ljunb/react-native-iShiWuPai.git
$ cd react-native-iShiWuPai 
$ npm install
$ react-native run-ios/run-android
```
