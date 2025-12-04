export function isClass(func) {
  return (
    typeof func === "function" &&
    /^class\s/.test(Function.prototype.toString.call(func))
  );
}

export function isFunction(func) {
  return typeof func === "function" && !isClass(func);
}
