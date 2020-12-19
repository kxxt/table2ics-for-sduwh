# table2ics for sduwh

这是一个把Excel课表转换成日历格式的工具.

(也是我的第一个Typescript/Javascript项目)

代码可能比较烂 , 请dalao们谅解 :joy:

## 使用说明

### 环境配置

```bash
git clone https://github.com/kxxt/table2ics-for-sduwh.git
cd table2ics-for-sduwh
npm install
```

### 课表编辑

1. 从教务系统下载课表 , 另存为为data.xlsx到项目根目录下

2. 编辑`data.xlsx` , 修改一些自己想修改的信息

   > 注意 : 将只有四行信息的课补为5行

3. 编辑`src\config.ts`, 修改参数

4. 保存文件

### 生成ICS文件

```bash
npm run build
npm run exec
```

生成的ics文件为data.ics,位于项目根目录下

### 导入

双击data.ics即可将课表导入Outlook.

## 其他SDUWH相关项目

自动疫情打卡 : https://github.com/kxxt/pyautoclockin

如果这个项目对你有用, 别忘了给个Star:star:哦! :smile: