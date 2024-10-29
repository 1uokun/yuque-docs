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

包命名规范： `<groupId>`（公司域名的逆向写法） + `<artifactId>`（jar包名）+ `<version>` + `<packaging>`（打包方式，默认jar）

网上jar包一般都提供maven配置信息，比如`mysql-connector-java`

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