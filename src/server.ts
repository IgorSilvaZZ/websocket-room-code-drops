import { serverHttp } from "./http";
import "./websockets/user";

serverHttp.listen(3333, () => console.log("🚀 Server is Running!"));
