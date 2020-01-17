let api = "http://172.17.0.1:4000/graphiql";
// for localhost
// let api = "http://localhost:4000/graphiql";

let ssr: bool = [%raw "typeof window === 'undefined'"];
