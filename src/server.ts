import { serverHttp } from "./http";
import "./websocket";

serverHttp.listen(3333, () => console.log("🚀 Server is Running!"));
