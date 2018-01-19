class Validator {
	Setprops(args) {
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
			if (invalid[elem]) {
				return invalid[elem];
			}
		}
	}

	isBlank(prop, name) {
		return prop ? null : `missing ${name}`;
	}

	isInvalidFormat(prop, name) {
		// this can be more flexible
		switch (name) {
			case "email":
				return !!prop.match(/(.*?@[a-z]+\.[a-z]+)+$/g) ? null : "invalid email";
				break;
			case "password": // only matching length now
				return !!prop.match(/.{8,}/) ? null : "invalid password";
				break;
			case "passconfirm":
				return this.password === prop ? null : "mismatched password";
			default:
				return null;
		}
	}
}

export default Validator;