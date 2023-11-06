// react 微前端应用
import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Routes, Link } from "react-router-dom";
import orderRoutes from "RemoteRoutes/routes";

const App = () => (
  <React.StrictMode>
    <HashRouter>
      <div>
        <Link style={{ display: "block", margin: "1rem 0" }} to={"/order"}>
          Goto Order List
        </Link>
        <Routes>
          {orderRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <React.Suspense fallback={<h1>router lazy loading...</h1>}>
                  <route.component />
                </React.Suspense>
              }
              exact={route.exact}
            />
          ))}
        </Routes>
      </div>
    </HashRouter>
  </React.StrictMode>
);

ReactDOM.render(<App />, document.getElementById("root"));
