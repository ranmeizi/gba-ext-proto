function loadRom(url, callback) {
	fetch(url, {responseType:'arraybuffer'})
		.then(res => {
			return res.arrayBuffer()
		})
		.then(res => callback(res))
}
