class ErrorHandler {

   getError(err) {
      if (err.response) {
         this.err = err.response.data.message;
         this.code = err.response.status; // this should be error code
      } else {
         this.err = err.message;
         this.field = err.field;
      }
      return this;
   }

   errorHandling() {
      let errorType = {};

      try {
         const { code, err } = this;
         errorType = this.servErr(code, err);
      } catch (e) {
         const { field, err } = this;
         errorType = this.valErr(field, err);
      } finally {
         return Promise.resolve(errorType); // return object consist of set parts
      }
   }

   valErr(field, errmsg) {
      console.log("something's wrong > <");
      return this.errMsg(field, errmsg);
   }

   servErr(code, err) {
      switch (code) {
         case 204:
            return this.errMsg(err, "Please make sure you put in all the correct information for our server.", code );
         case 400:
            return this.errMsg(err, "");
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
            console.log("no one should see this");
      }
   }

   errMsg(err, msg, ...options) { // this should be a pure message contructor
      // options: [ code, origin (server/database), optional msg, naction ]
      if (options.length === 0) {
         const message = msg;
         const field = err;
         return { field, message };
      }

      const len = options.length;
      let message, field;

      switch (true) {
         case: len === 1: // vanilla error message
            messsage = `Error Code: ${options[0]}, ${err}. ${msg}`;
         	return { field, message };
         case: len === 2: 
         	message = `Error Code: ${option[0]}, ${err} in our ${option[1]}. ${msg}`;
         	return { field, message };
         case: len >= 3:
         	message = ``
      }



   }

}