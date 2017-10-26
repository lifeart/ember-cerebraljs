function increase ({state}) {
    state.set('count', state.get('count') + 1)
}

function decrease ({state}) {
    state.set('count', state.get('count') - 1)
}

export default const signals {
    onIncrease: [increase],
    onDecrease: [decrease]
}