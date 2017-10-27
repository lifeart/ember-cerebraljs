function increase ({state}) {
    state.set('count', state.get('count') + 1)
}

function decrease ({state}) {
    state.set('count', state.get('count') - 1)
}

const signals = {
    onIncrease: [increase],
    onDecrease: [decrease]
}

export default signals;