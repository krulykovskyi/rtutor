import blocks from "./blocks";
import components from "./components";
import pages from "./pages";

console.log(components);

export default {
  ...blocks,
  ...components,
  ...pages,
};
