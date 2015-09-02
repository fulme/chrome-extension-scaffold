import foo from "./modules/foo";
import bar from "./modules/bar";

let init = function () {
  console.log('From module foo >>> ', foo);
  console.log('From module bar >>> ', bar);
}

export default init;
