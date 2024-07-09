import Default from "../layout/Default";
import DetailBot from "../page/DetailBot";
import Home from "../page/Home";
import ManageBot from "../page/ManageBot";

const listRoute = [
  {
    path: "/",
    component: Home,
    layout: Default, 
  },
  { path: "/list-bot", component: ManageBot, layout: Default },
  { path: "/detail-bot/:id", component: DetailBot, layout: Default },
];

export default listRoute;