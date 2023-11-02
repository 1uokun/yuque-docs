// es_module get
const get = function () {
  console.log("get");
};

// 闭包、副作用
const iife = function () {
  console.log("IIFE");
  // // es_module has
  return function () {
    console.log("has");
  };
};

const has = /*#__PURE__*/ iife()();

// export default { get, has };
export { get, has };
