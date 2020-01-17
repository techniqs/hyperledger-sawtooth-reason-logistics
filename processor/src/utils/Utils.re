
//binding to JS exceptions
module Exceptions = {
  exception StateError(string);


[@bs.module "../js/JsUtils"]
 external newInvalidTransactionException: string => unit = "newInvalidTransactionException";

 [@bs.module "../js/JsUtils"]
 external newInternalErrorException: string => unit = "newInternalErrorException";

}
