import { serverHttp } from "./http";
import "./websocket";

serverHttp.listen(5000, () => {
    console.log(`Servidor rodando na porta: 5000`);
});