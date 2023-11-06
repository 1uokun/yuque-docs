import React from "react";

// 懒加载的话，引用方需要使用Suspense包裹
const OrderListPage = React.lazy(() => import("./OrderList"));
const OrderDetailPage = React.lazy(() => import("./OrderDetail"));

// MF也可以同步引入路由，就不需要包裹Suspense了
// import OrderListPage from './OrderList'
// import OrderDetailPage from './OrderDetail'

const routes = [
  { path: "/order", component: OrderListPage },
  { path: "/order/:orderId", component: OrderDetailPage },
];

export default routes;
