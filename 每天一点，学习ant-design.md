# 如何覆盖样式

```javascript
import classNames from 'classnames'
import styles from './style.less'

// render
<Form className={classNames(styles.wrapper)>
</Form>

// style.less (支持CSS Module语法）
.wrapper {
  :global {
    .ant-form-item-label {
       // 全局覆盖form label的样式
    }
  }
}
```

# Form

-  Tip: 提交数据结构可以为多层**对象**`getFieldDecorator('a.b.c')` 
-  Tip: 提交数据结构可以为多层**数组+对象**`getFieldDecorator('a[0].b')` 
-  Tip: `getFieldDecorator`内**顶层必须是表单元素才会被赋值** 
可以写到`{getFieldDecorator}`外面  
```diff
{getFieldDecorator('unit')(
-  <>
-   <Input />     /* doest work */
-  </>
+  <Input />      /* work */
)}
```
```html
 <Form.Item>
  <div>
   {getFieldDecorator('unit')(<Input />)}
   <b>input info</b>
  </div>
 </Form.Item>
```

-  Q: **什么时候要用到**`**initialValue**` 
-  A: `setFieldsValue()`之后`<Form.Item>`才被选择展示时
⚠️改initialValue后需要刷新页面，热更新不会起作用 
**🚩Tip:**`**setFieldsValue()**`**之前一定要保证**`**<Form.Item>**`**被展示** 
否则要靠额外的`state`来赋值  
```html
const [show, setShow] = useState(false)

{show && <Form.Item>
  {getFieldDecorator('unit', {
    initialValue: defaultData.unit,
  })(
    <Input />
  )}
</Form.Item>}
```
```diff
- setFieldsValue({unit:"KG"});
- setShow(true);

+ setShow(true);
+ setFieldsValue({unit:"KG"});
```
```
const [defaultData, setDefaultData] = useState({});

setFieldsValue({unit:"KG"});
setShow(true);
setDefaultData({...defaultData, unit:"KG"});
```

-  `**setFieldsValue()**`**遇到**`**<InputNumber max={}/>**`**时**
🚩setFieldsValue设置的值超过max范围时，不会自动变更到范围内，
这将导致set后input值在max返回内，但提交时依然是超出的那个值 
-  **Tip:动态表单必须结合**`**state**`**来实现**
🚩不能单纯通过使用`form.setFieldsValue`和`form.getFieldValue`来实现增删操作
参考链接：[https://stackoverflow.com/questions/58762136/get-result-as-array-in-antd-form/67902792#67902792](https://stackoverflow.com/questions/58762136/get-result-as-array-in-antd-form/67902792#67902792) 
-  重写3.x Form动态增减表单项
<del>代码链接：[https://github.com/1uokun/ant-design/blob/722f6d2411dad7ba0977be71beafe5e9512311cc/components/form/demo/dynamic-form-item.md](https://github.com/1uokun/ant-design/blob/722f6d2411dad7ba0977be71beafe5e9512311cc/components/form/demo/dynamic-form-item.md) </del>
-  https://3x.ant.design/components/form-cn/#components-form-demo-dynamic-form-item
  🚩**动态表单**-核心是`names[${key}].xx`，而不是<del>`name[${index}].index`</del>
  需要一个`_keys`,一个`_names`，提交的时候用`keys.map(key => names[key])`
## getFieldDecorator

-  基本操作
```javascript
{getFieldDecorator(`list[${index}].name`),{
  initialValue: '',
  rules:[
    {
      require: bool,
      message: string | React.ReactNode | function,
    },
    {
      pattern: RegExp,
      message: string //rules支持存在多个message校验提示,校验顺序同rules索引
    },
    {
      validator: (rule, value, callback, source, options)=>{
          // 1. 用callback执行校验结果⚠🚩必须执行callback
          callback("message"); 
          
          // 2. 用返回errors执行校验结果
          const errors = [];
          if(value < 0){
             errors.push(new Error("请输入正数"))
          };
          if(value > 10){
             errors.push(new Error("请输入个位数"))
          }
          return errors;
      },
      message: string
    }
  ]
}}
```

## valuePropName 

**万物受控组件皆可被Form**

`valuePropName`+`getValueFromEvent`替换FormItem默认的value+onChange组合

```jsx
<Switch checked={false}> // Swicth的受控值字段是checked而不是value

<Form.Item label="抵现开启状态">
  {getFieldDecorator('dataStatus', {
    initialValue: true,
    
    valuePropName: 'checked', // 指定子节点的值的属性
    getValueProps: (value: any) => any // 同上，⚠️仅4.2.0以上支持
    
    // ⚠️form对包裹组件的onChange是固定写法（这个没办法）
    // 但可以把 onChange 的参数（如 event）转化为控件的值
    getValueFromEvent: this.handleCustomChange
    
    
  })(<Switch />)}
</Form.Item>
  
  handleCustomChange=({fileList})=>{
    return fileList.map(a=>({...a,status:"done"}))
  }

```
> 参考：Upload组件如何配合Fom使用：[https://segmentfault.com/a/1190000016469852](https://segmentfault.com/a/1190000016469852)

## validateFields
form表单定位到第一个校验失败的地方
> 1. 最新版本的实现方式：[https://blog.csdn.net/qq_39083004/article/details/126751244](https://blog.csdn.net/qq_39083004/article/details/126751244)
> 2. 3x版本⬇️

```javascript
form.validateFields((error, params)=>{
  if(error){
    const table = document.getElementById('custom-table');
    setTimeout(()=>{ // has-error是异步生成的

      const firstErrorField = table.getElementsByClassName('has-error')[0];
      if (firstErrorField) {
        const parent = firstErrorField.closest('.ant-table-row');
        const offsetTop = parent?.offsetTop || 0;
        
        if (table.getElementsByClassName('ant-table-body')[0]) {
          table.getElementsByClassName('ant-table-body')[0].scrollTop = offsetTop;
        }
      }

    },0)
  }
})
```
## From.create()组件的ref

经过Form.create()(Component) 输出后的组件，如何获取ref

```jsx
<FormAfter
  wrappedComponentRef={(ref)=>{
  	this.ref = ref
  }}
 />
```



# Modal

- `<Modal>`在`3.x`版本`state`会被缓存，即使`destroyOnClose={true}`

# Table

- `rowKey`很重要，同key一样重要‼️
如`expandedRowRender`的对应展开在Table的数据增删下依然能对应上

# Pagination

- `<Table>`内使用`pagination`  
```jsx
 <Table 
  pagination={{
    current: pageBean.pageNo,
    pageSize: pageBean.pageSize,
    total: pageBean.totalCount,
    onChange: (page) => {
      pageBean.pageNo = index;
      this.setState({ pageBean }, () => {
        this.fetch();
      });
    },
  }}
 />
```
```javascript
 const state={
   pageBean:{
     pageNo: 1,
     totalCount: 0,
     pageSize: 10
   }
 }
 
 const fetch = () => {
   const params = {
     ...this.state.pageBean,
   }
   
   // 接口请求成功后更新page
   
   pageBen.pageNo += 1;
   pageBen.totalCount = res.total;
 }
```

# Select

-  [**远程搜索用户**](https://3x.ant.design/components/select-cn/#components-select-demo-select-users)**类初始值**`**initialValue**`**/**`**defaultValue**`**如何设置？** 
   - 如果是中文，可以直接赋值
   - 如果是id，SearchSelect无法通过id显示对应的title。所以要多一步**“通过id搜索拿到对应的title再赋值”**
-  **方案2: 2个inpnt+相同的decorator+一个hidden**
相同的`getFieldDecorator`，以最后一个为准。
所以可以利用这一特性，第一个展示的是中文，但其实有一个隐藏的id才是submit提交的最终值  
```
<Select initialValue={{item.name}} getFieldDecorator="id"/>

<Input initialValue={{item.id}} getFieldDecorator="id" hidden/>
```

-  **方案3: SearchFilter**
`autoFetch`  
```html
 <SearchSelect
   autoFetch
   fetch={fetchAdminUsersI}
   isClear={false}
   style={{ width: 180 }}
   valueKey="userId"
   titleKey="realname"
   placeholder="真实姓名、手机号、用户id、昵称"
 />
```

## 回显列表中不存在的值
把这个列表中不存在的值手动合并到列表中即可
```jsx
<Select defaultValue={outer.id}>
  {
    (list.include(item=>item.id===outer.id)?
    list:[...list,outer]
   ).map(item=>(
				<Option value={item.id}>{item.name}</Option>
  	))
  }
</Select>
```
# Tabs
```javascript
import React from "react";
import { Tabs } from "antd";
import styles from "./index.less";

/**
 * PC模式实现拖动滚动
 */
export default class TabsMousemove extends React.PureComponent {
  constructor(props) {
    super(props);
    this.gameShowEle = undefined;
    this.left = 0;
    this.oldLeft = 0;
  }

  componentDidMount() {
    this.gameShowEle = document.querySelector(".ant-tabs-nav-scroll");
    if (!this.gameShowEle) return;
    this.setDragScrollEvent();
  }

  componentWillUnmount() {
    if (!this.gameShowEle) return;
    this.gameShowEle.removeEventListener("mousedown", this.mousedown);
    document.removeEventListener("mouseup", this.mouseup);
  }

  mousemove = event => {
    let x = this.left + (this.oldLeft - event.clientX);
    if (x < 0) x = 0;
    this.gameShowEle.scrollTo(x, 0);
  };

  mousedown = event => {
    this.gameShowEle.style.cursor = "grabbing";
    this.gameShowEle.style.userSelect = "none";
    this.oldLeft = event.clientX;
    this.left = this.gameShowEle.scrollLeft;
    document.addEventListener("mousemove", this.mousemove);
  };

  mouseup = () => {
    this.gameShowEle.style.cursor = "pointer";
    document.removeEventListener("mousemove", this.mousemove);
  };

  setDragScrollEvent() {
    this.gameShowEle.addEventListener("mousedown", this.mousedown);
    document.addEventListener("mouseup", this.mouseup);
  }

  render() {
    return <Tabs {...this.props} className={styles.tabs} />;
  }
}

```
