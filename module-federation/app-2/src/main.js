(async () => {
  const { sayHello } = await import("RemoteUtil/utils");
  sayHello();
})();

// react动态路由必须import()引入
import("./reactSuspense");
