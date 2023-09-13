import _ from 'lodash'

function replaceValues(inputString, values) {
	return inputString.replace(/\[\[([\w?.[\]']+)]\]/g, (match, path) => {
		const pathSegments = path
			.split(/[\[.\]]/)
			.filter((segment) => segment.length > 0)

		let value = values
		for (const segment of pathSegments) {
			if (value === null || value === undefined) {
				return match
			}

			if (segment.includes('?')) {
				const chainSegments = segment.split('?.')
				for (const chainSegment of chainSegments) {
					if (value === null || value === undefined) {
						return match
					}
					value = value[chainSegment]
				}
			} else if (segment.match(/^\d+$/)) {
				const index = parseInt(segment)
				value = Array.isArray(value) ? value[index] : undefined
			} else {
				value = value[segment]
			}
		}

		return value !== undefined ? value : match
	})
}
//
const converData = (value, defualtAppZap) => {
	if (typeof value === 'object' && value !== null) {
		if (value.isJS) {
			if (value.isVar) {
				const _var = defualtAppZap?.item?.name
				return `${_var}`
			} else {
				return eval(value.__key)
			}
		} else if (value.isJSArray) {
			try {
				const _array = eval(value.__array)
				const _compi = _array.map((item) => {
					const _item = compileJson(value.__item)
					const _rep_item = replaceValues(_item, { item })
					const _deC_item = deCompileJson(_rep_item, defualtAppZap)
					return _deC_item
				})
				return _compi
			} catch (err) {
				alert(err.message)
				console.error(err.message)
				return []
			}
		} else {
			return value
		}
	} else {
		return value
	}
}

function compileJson(json) {
	const data = JSON.stringify(json, function (key, value) {
		return typeof value === 'function'
			? { isJS: true, __key: value.toString() }
			: value
	})
	return data
}

function deCompileJson(json, defualtAppZap) {
	const data = JSON.parse(json, function (_, value) {
		return converData(value, defualtAppZap)
	})
	return data
}

export default deCompileJson
