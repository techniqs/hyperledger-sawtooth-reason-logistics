let api = "http://localhost:4000/graphiql";

let ssr: bool = [%raw "typeof window === 'undefined'"];
