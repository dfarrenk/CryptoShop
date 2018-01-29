class Validator {
	// the order of the object prop will reflected on the display
	// order of the errors
	setFields(args) {
		for (let elem in args) {
			this[elem] = args[elem];
		}
		return this;
	}

	get Allprops() {
		return Object.entries(this); 
	}

	validate() {
		const props = this.Allprops;
		const invalid = props.reduce((obj, elem) => {
			const isBlank = this.isBlank(elem[1], elem[0]);
			const isInvalid = this.isInvalidFormat(elem[1], elem[0]);

			obj[elem[0]] = isBlank || isInvalid ? isBlank || isInvalid : 0;

			return obj;
		}, {});

		console.log(invalid);
		for (let elem in invalid) {
			console.log(elem);
			if (invalid[elem]) {
				return { field: elem, message: invalid[elem] }; 
			}
		}
	}

	isBlank(prop, name) {
		return prop ? null : `missing ${name}`; 
	}

	isInvalidFormat(prop, name) { 
		
		if (!!prop.match(/[<>\\"')(`]/g)) { // prevent injection attack, will need similar validation on server 
			return "input must not contain the characters such as: '\"()`<>";
		}
		
		switch (name) {
			/*case "username":
				return !prop.match(/[<>\\"')(`]/g) ? null : "username must not contain following characters: '\"()`<>";*/
			case "email":
				return !!prop.match(/(.*?@[a-z]+\.[a-z]+)+$/g) ? null : "invalid email";
			case "password": // only matching length now
				return !!prop.match(/.{8,}/) ? null : "invalid password";
			case "passconfirm":
				return this.password === prop ? null : "mismatched password";
			case "originalpass":
				return !!prop.match(/.{8,}/) && this.password !== prop ? null : "new password should not be the same as the old one"; 
			default:
				return null;
		}
	}
}

export default Validator;

