class Validator {
	set Setprops(args) {
		for (let elem in args) {
			this[elem] = args[elem];
		}
	}

	get Allprops() {
		return Object.entries(this);
	}

	validate() {
		const props = this.Allprops;
		const invalid = props.reduce((obj, elem) => {
			obj[elem[0]] =
				this.isBlank(elem[1], elem[0]) || this.isInvalidFormat(elem[1], elem[0])
					? 0
					: 1;
			return obj;
		}, {});

		for (let elem in invalid) {
			if (!invalid[elem]) {
				return elem;
			}
		}
	}

	isBlank(prop, name) {
		return prop ? null : `missing ${name}`;
	}

	isInvalidFormat(prop, name) { // this can be more flexible
		switch (name) {
			case "email":
				return !!prop.match(/(.*?@[a-z]+\.[a-z]+)+$/g) ? null : "invalid email";
				break;
			case "password": // only matching length now
				return !!prop.match(/.{8,}/) ? null : "invalid password";
				break;
			case "passconfirm":
				return this.password === prop ? null : "password must matched";
			default:
				return null;
		}
	}
}

export default Validator;