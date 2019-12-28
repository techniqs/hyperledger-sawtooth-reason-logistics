export const throwExceptionAndClose = (subscriber, exceptionMessage) => {
    console.log(exceptionMessage);
    subscriber.close();
    process.exit(0);
}