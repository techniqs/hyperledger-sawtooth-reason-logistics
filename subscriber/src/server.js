import './config/index.js';

import Subscriber from './components/subscriber';
import {throwExceptionAndClose} from "./components/exceptionHandler";


const sub = new Subscriber("tcp://localhost:4004")
sub.start().then(() => { }).catch(err => {
  throwExceptionAndClose(sub,err);
})

process.on('SIGINT', function () {
  console.log("Caught interrupt signal, closing connections before exiting");

  sub.close()
  process.exit(0);
});
