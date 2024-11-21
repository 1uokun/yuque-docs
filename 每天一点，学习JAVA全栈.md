> https://www.bilibili.com/video/BV1sk4y1M7ru/ 《7天学JAVA》

# 如何设计一个短信验证码登录功能？

> 考察的是网络安全

- **【手机号非注册用户怎么处理？】**

  不能提示有没有注册，提示一定要模糊，防止嗅探
  
- **【验证码存哪里？】**

  存【redis】（有自动过期时间）{key 手机号： value 验证码}一次性数据一般都用 redis 存
  
- **【次数限制】**：只限制手机号够了吗？

  还要限制 ip
  
- **【极验】是不是一定安全？**

  单靠极验不安全，因为有黑产服务
  
- **【先保存验证码还是先发短息？】**

  一定要先存验证码，因为短信是【异步回调】的，也不知道发送到用户上是失败还是成功，
  要默认全部发送成功，如果用户回填了正确的验证码那就一定是收到了；如果失败了用户会再请求的。

- ✍️ **课外题：如何准确限制【次数】？(考察【异步】和【并发】)**

  首先【计数器】要用 redis 的自增工具库：

  1. 先取（异步）次数再判断的话，会出现取的过程中用户又发送了一次（并发），这时第二次取的次数就没更新对齐
  2. 所以要先 ➕1 ，是可以直接得到 ➕1 后的返回值，再来判断是否有超
  3. 不使用【加锁】，过度设计

# 相关术语

## 防止嗅探

将问题演变成《设计一个用户通过验证码绑定手机号的功能？》

1. 【手机号已绑定了怎么处理？】 不管有没有已绑定，只有等到{ k:手机号+userId, v:验证码} 全通过了才告诉用户是否已绑定
2. 【验证码存哪里？】 redis 的 k 不能再是单一的 **手机号**，因为其他用户也能输入相同手机号，造成混乱。k 要改为 **{ 手机号+userId }**

## 极验

图形验证码之类的综合服务

## 等保

以上所有安全操作都是等保（网络安全等级）规定必须要做到的



# XML

可拓展标记语言。是不作为的，仅用来结构化、存储以及传输信息的纯文本。
换言之，同`.json`文件作用。

```xml
<?xml version="1.0" encoding="utf-8"?>
```

## XML 解析

用 `org.dom4j.io.SAXReader`来解析 https://dom4j.github.io/

# JDBC

## Java数据库连接规范

Java DataBase Connectivity - Java数据库连接 规范，Java程序 和 数据库 连接中间的桥梁

1. 加载 Drivder 驱动

   > mysql-connector-java-8.0.11.jar  https://mvnrepository.com/artifact/mysql/mysql-connector-java

2. 获取 数据库 连接（Connection）

3. 创建会话 - SQL命令发送器（Statement）

4. 通过Statement发送SQL命令得到结果

5. 处理结果

6. 关闭数据库资源（ResultSet、Statement、Connection）

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class Main {
    public static void main(String[] args) throws SQLException, ClassNotFoundException {
        // 加载驱动
        Class.forName("com.mysql.cj.jdbc.Driver");

        // 获取连接
        String url = "jdbc:mysql://127.0.0.1:3306/msb?useSSL=false&useUnicode=true&characterEncoding=UTF-8";
        String username = "root";
        String password = "123456";
        Connection conn = DriverManager.getConnection(url,username,password);

        // 创建会话
        Statement statement = conn.createStatement();
        // 发送SQL
        int i = statement.executeUpdate("insert  into t_book (id) values (3)");
        // 处理结果
        if(i > 0){
            // ...
        }

        // 关闭资源
        statement.close();
        conn.close();
    }
}
```

# Maven

> 类似 npm 第三方包集中管理工具

Maven是使用Java语言编写的基于**项目对象模型**（**POM**）项目管理工具软件。
开发者可以通过一小段描述信息来管理项目构建、报告和文档。

1. 中央仓库： https://mvnrepository.com/
2. 本地仓库
3. 镜像仓库

## 坐标

坐标（在前端中叫包）命名规范：

 `<groupId>`（公司域名的逆向写法） + `<artifactId>`（jar包名）+ `<version>` + `<packaging>`（打包方式，默认jar）

网上jar包一般都提供maven配置信息，比如`mysql-connector-java`的坐标 ⬇️

```xml
<!-- https://mvnrepository.com/artifact/mysql/mysql-connector-java -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.23</version>
  	<packaging>jar</packaging>
</dependency>
```

## pom.xml

> Apache组织在维护maven工具： https://maven.apache.org/download.cgi
> 一般 IDEA 编辑器已经内置捆绑了。

maven项目下会有一个文件叫 `pom.xml` 配置文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.example</groupId>
    <artifactId>TestMaven</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>22</maven.compiler.source>
        <maven.compiler.target>22</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

</project>
```

# 框架

## 框架的意义

- 重复/基础代码封装，同时添加额外功能
- 释放程序员写代码精力，更关注业务层面
- 框架是半成品

# MyBatis 框架

> https://wiki.dxy.net/pages/viewpage.action?pageId=125832004

## MyBatis 是持久层框架

将**访问数据源**的代码和**业务逻辑**代码分离

在`properties`文件中完成数据库连接和mybaits配置：

```bash
# 数据库
spring.datasource.url=${MYSQL_DB_HOST:jdbc:mysql://192.168.202.206}:${MYSQL_DB_PORT:3306}/${MYSQL_DB_NAME:spider_system}?characterEncoding=utf8&useSSL=true
spring.datasource.username=${MYSQL_DB_USERNAME:XXXXX}
spring.datasource.password=${MYSQL_DB_PASSWORD:XXXXXX}
spring.datasource.driverClassName=com.mysql.jdbc.Driver
# mybatis_config
mybatis.mapperLocations=classpath:com/dxy/data/spider/admin/mapper/*.xml
mybatis.typeAliasesPackage=com.dxy.data.spider.admin.entity
```

入口文件使用注解完成包扫描和组件扫描：

```java
@MapperScan(basePackages = "com.dxy.data.spider.admin.mapper")
@ComponentScan("com.dxy.data.spider")
```



## MyBatis 是ORM框架

将**数据库查询到的数据**自动和程序里的**对象**做一个**映射**

常用注解： 

- **`@TableName`**： 映射数据表名 
- **`@TableId(value = "id", type = IdType.AUTO)`**：自增主键 
- **`@TableField(value = "create_time")`**：一般字段（当字段和属性名一致时默认匹配） 
- 常用的set/get方法

mapper映射：

```java
public interface SiteRuleMapper extends BaseMapper<SiteRule> {}
```

# Spring 框架

> https://spring.io/

Core Container

- Beans
- Core
- Context
- SpEL

## 控制反转（IoC/DI）

> 控制反转 IoC(Inversion of Control)，也被称为 DI(dependency injection)。
> **将创建对象的权利交给spring容器来控制，就是控制反转**

### 属性注入(基础类型)

以前 - setter方式

```java
Book b = new Book();
b.setId(1);
b.setName("xxx");
```

属性注入 - 设值注入

```xml
<bean id="s" class="com.example.Student">
  <property name="id" value="1"></property>
  <property name="name" value="李华"></property>
</bean>
```

以前 - 构造器方式

```java
Book b = new Book(1, "xxx");
```

属性注入 - 构造注入

```xml
<bean id="s" class="com.example.Student">
  <constructor-arg name="id" value="1"></constructor-arg>
  <constructor-arg name="name" value="李华"></constructor-arg>
</bean>
```

> 🌟 **设值注入 **优先级高于 **构造注入** 🌟

### 属性注入(引用类型)

属性为引用类型 🚩 - 以前

```java
Teacher t = new Teacher(1, "sir");
Student s = new Student(1, "李华", t);
```

属性注入 - ref

```xml
<bean id="teacher" class="org.example.Teacher">
    <constructor-arg name="id" value="1"></constructor-arg>
    <constructor-arg name="name" value="sir"></constructor-arg>
</bean>
<bean id="s2" class="org.example.Student">
    <constructor-arg name="id" value="1"></constructor-arg>
    <constructor-arg name="name" value="李华"></constructor-arg>
  	<!-- ref 寻找 id=ref 值的 bean -->
    <constructor-arg name="teacher" ref="teacher"></constructor-arg>
</bean>
```



### 注解

> 🚩**注解的目的是使我们的配置文件（xml）更简单**🚩

- **@Component** 
  实例化Bean，默认名称为类名 首字母变小写，无需指定setter方法
- **@Repository**
  作用和@Component一样，用在持久层。**语义化而已**
- **@Service**
  作用和@Component一样，用在业务层
- **@Controller**
  作用和@Component一样，用在控制器层
- **@Configuration**
  作用和@Component一样，用在配置类上
- **@Autowired**
  把容器中的**对象**自动注入，并且不需要依赖set方法。默认byType，如果多个同类型bean，使用byName
- **@Value**
  给普通数据类型（**八种基本类型 + String**）属性赋值，并且不需要依赖set方法

```java
@Component
public class Teacher {
  @Value("1")
  private int id;
  
  @Value("陈")
  private String name; 
  
  @Autowired
  private Student student;
  
  // 不需要依赖set方法了
  // public void setId(int id){
  //  this.id = id;
  // }
}
```



## AOP切面编程

**1.传统面向对象** ⬇️

前端  <=>                   java程序                            <=>  数据库
前端 <=> 控制层 <=> 业务层 <=> 数据库连接层 <=> 数据库

- 控制层 **BookController** ：获取前端数据，进行页面的跳转，调用new Service()
- 业务层 **BookService**：处理业务，调用new Mapper()
- 数据库连接层 **BookMapper** ：数据库交互（增删改查）

**2.面向接口实现类编程** ⬇️

Impl 接口实现类（面向接口）
前端  <=> BookController | new BookControllerImpl()  <=>  BookService | BookServiceImpl  <=>  BookMapper | BookMapperImpl  <=>  数据库

**3.Spring不再创建对象 ⬇️**

applicationcontext.xml 配置文件
通过bean，Spring就会帮我构建一个 Student s = new Student( ) 的反射

```xml
<bean id="s" class="student"></bean>
<bean id="t" class="teacher"></bean>
```

Spring容器 - 放各种对象 student、t、...

java程序从Spring容器中取对象



## 框架的框架（整合）

- **不再重复造轮子**

- SSM
  spring、spring mvc、mybatis

  

# Tomcat 服务器（web项目）

项目结构

1. Maven构建项目类型：

   - Java项目 --> **jar** 项目
   - Web项目 --> **war** 项目

2. 创建Maven-war项目步骤：

   1. 创建Maven项目，添加webapp模版
      先勾选**create from archetype**前面的复选框
      然后选择org.apache.maven.archetypes:maven-archetype-webapp
   2. 注意 pom.xml中是war项目
   3. 观察目录结构与jar项目不同之处
   4. 设置java目录为资源目录
   5. 添加tomcat
   6. 将项目添加到tomcat中

   

# Spring MVC（前后端数据交互）

## Controller 控制层（api）

接受前端的请求

- @Controller 配置类
- @RequestMapping("/apiname") 接口名，获取普通参数
- 课外题：获取非String类型参数，如Date、ArrayList之类的❓

```java
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class TestController { // 控制器类
    @RequestMapping("/test1")
    public String test1(){
        // 响应给浏览器index.jsp页面
        return "index.jsp";
    }


    @RequestMapping("/list")
    public String list(String pageSize){
        System.out.println("pageSize="+pageSize);
        return "index.jsp";
    }
}

// tomact应用
// http://localhost:8886/testwebapp/test1
// http://localhost:8886/testwebapp/list?pageSize=10
```

# SSM (SpringMVC + Spring + MyBatis)

Java速成班课件
链接：https://pan.baidu.com/s/1ElaXjXwC9FU-ikODiel1Wg?pwd=k24y 
提取码：k24y

> 前端 <=> 控制层 <=>  业务层 <=> 数据库连接层 <=> 数据库

| 前端 <=  |                   => 控制层<=                    |                         => 业务层 <=                         |           => 数据库连接层 <=<br />也称 **持久层**            | => 数据库 |
| :------: | :----------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: | :-------: |
|          | 获取前端数据<br />进行页面的跳转<br />调用业务层 |                处理业务<br />调用数据库连接层                |                跟数据库进行交互<br />增删改查                |           |
|  *代码*  |                  BookController                  |                         BookService                          |                          BookMapper                          |           |
|  *结构*  |       BookService2 b = new BoolService2()        |                   BookServiceImpl接口拓展                    |                                                              |           |
| 配置文件 |                                                  | `springmvc.xml`<br />（让`Controller`文件夹和`@RequestMapping`注解生效） | `myBatis.xml`（登陆数据库）<br />`BookMapper.xml` (写数据库语言) |           |

- 实体类 pojo(Plain Old Java Object)

  ```java
  // com.msb.pojo
  public class Book {
      private int id;
      private String name;
  
      public int getId() {
          return id;
      }
  
      public void setId(int id) {
          this.id = id;
      }
  
      public String getName() {
          return name;
      }
  
      public void setName(String name) {
          this.name = name;
      }
  }
  ```

- 控制层 Controller

  ```java
  // com.msb.controller
  @Controller
  public class BookController {
    @Autowired
    private BookService bookService;
    
    @RequestMapping("/api/findAll")
  + @ResponseBody
    public String findAll(){
      List list = bookService.findAll();
      return "index.jsp";
    }
  }
  ```

  > @Autowired 把业务层的容器对象注入进来，方便调用。
  > @RequestMapping 定义接口名，供前端调用
  > @ResponseBody 返回值设置到http响应流中

- 业务层 Service
  ```java
  // com.msb.service
  public interface BookService {
    public abstract List findAll();
  }
  ```

  Service Impl 接口实现类（面向接口）
  ```java
  // com.msb.service.impl
  @Service
  public class BookServiceImpl implements BookService {
      @Autowired
      private BookMapper bookMapper;
  
      public List findAll() {
          return bookMapper.selectAll();
      }
  }
  ```

- 数据库连接层（持久层） Mapper
  ```java
  // com.msb.mapper
  @Repository
  public interface BookMapper {
      public abstract List selectAll();
  }
  ```

# SpringBoot

> 核心思想：约定大于配置。
> SSM需要做大量的配置，SpringBoot可以做到零配置。（控制类 + **启动类**）

- 控制类

  同SSM

- **启动类**

  ```java
  @SpringBootApplication
  // 扫描mapper文件(如果用mybatis的话)
  @MapperScan("com.msb.mapper")
  // 命名规则：包名+Application
  public class TestSpringBootApplication {
    // 基于main方法启动
    public static void main(String[] args) {
      // 只会扫描它的路径之下的子包; 所以controller要和它平级效率为最高。
      SpringApplication.run(TestSpringBootApplication.class,args);
    }
  }
  ```

- 配置文件 `source/application.yml`

  ```properties
  server:
    port: 9999
    servlet:
      context-path: /spring02
  spring:
    datasource:
      url: jdbc:mysql://localhost:3306/msb
      driver-class-name: com.mysql.cj.jdbc.Driver
      username: root
      password: 12345678
      
  #mybatis配置 (resource/mybatis/BookMapper.xml)
  mybatis:
    type-aliases-package: com.msb.pojo
    mapper-locations: classpath: mybatis/*.xml
  ```

- 持久层
  同SSM
