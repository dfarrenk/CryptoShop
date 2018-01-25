class MemoryStore {
	constructor() {
		this.temp = {};
	}

	set setTemp(params) {
		const { temp } = this;
		const [ tempObj, refId ] = params;

		tempObj.timeout = function(memoryStore) {
			console.log("timeout set");
			
			setTimeout(() => {
				delete memoryStore.temp[refId];
			}, 30 * 60 * 1000); // 30 min timeout
		};

		this.temp[refId] = tempObj;
		this.temp[refId].timeout(this);
	}
}

module.exports = new MemoryStore();