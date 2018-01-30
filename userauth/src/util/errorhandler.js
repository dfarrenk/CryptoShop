class ErrorHandler {

   getError(err) {
      if (err.response) {
         this.err = err.response.data.message;
         this.code = err.response.status; // this should be error code
      } else if (err.status) {
         this.err = err.data.message;
         this.code = err.status; // this should be error code
      } else {
         this.err = err.message;
         this.field = err.field;
      }
      return this;
   }

   errorHandling() {
      const { code, err, field } = this
      let errorType = {};

      if (code) {
         errorType = this.servErr(code, err);
      } else {
         errorType = this.valErr(field, err);
      }
      return Promise.resolve(errorType); // return object consist of set parts
   }

   valErr(field, errmsg) {
      console.log("validation error");

      if (errmsg.match("missing originalpass")) {
         return this.errMsg(field, "missing original password");
      }
      if (errmsg.match("missing passconfirm")) {
         return this.errMsg(field, "missing password confirmation");
      }
      return this.errMsg(field, errmsg);
   }

   servErr(code, err) {
      switch (code) {
         case 204:
            return this.errMsg("user cannot be found in the database", "Please make sure you put in all the correct information for our server.", code);
         case 304:
         	return this.errMsh(err, "", code);
         case 401:
            return this.errMsg(err, "Please make sure you enter the correct password.", code);
         case 403:
            return this.errMsg(err, "Please login or register an account before making any purchase.", code);
         case 404:
            return this.errMsg(err, "The page you are looking for doesn't exist", code);
         case 409:
            return this.errMsg(err, "An account with the same username or email has already been registered.", code, "database");
         case 410:
            return this.errMsg(err, "requested link expired.", code); // action?
         case 500:
            return this.errMsg(err, "internal server error, please note that our engineer has been notify.", code);
         default:
            console.log("seriously wrong");
      }
   }

   errMsg(err, msg, ...options) { 
      if (options.length === 0) {
         const message = msg;
         const field = err;
         return { field, message };
      }

      const len = options.length;
      let message, field;

      if (len < 2) {
         message = `Error Code: ${options[0]}, ${err}. ${msg}`;
         return { field, message };
      }

      message = `Error Code: ${options[0]}, ${err} in our ${options[1]}. ${msg}`;
      return { field, message };
   }
}

export default ErrorHandler;