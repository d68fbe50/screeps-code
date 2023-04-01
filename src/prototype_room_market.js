global.co = function (orderId) {
    return Game.market.cancelOrder(orderId)
}

global.cop = function (orderId, newPrice) {
    return Game.market.changeOrderPrice(orderId, newPrice)
}

global.eo = function (orderId, addAmount) {
    return Game.market.extendOrder(orderId, addAmount)
}

Room.prototype.buy = function (amount, resourceType = RESOURCE_ENERGY) {
    return releaseOrder(this.name, ORDER_BUY, resourceType, amount)
}

Room.prototype.sell = function (amount, resourceType = RESOURCE_ENERGY) {
    return releaseOrder(this.name, ORDER_SELL, resourceType, amount)
}

Room.prototype.cob = function (price, totalAmount, resourceType = RESOURCE_ENERGY) {
    return Game.market.createOrder({ type: ORDER_BUY, price, totalAmount, resourceType, roomName: this.name})
}

Room.prototype.cos = function (price, totalAmount, resourceType = RESOURCE_ENERGY) {
    return Game.market.createOrder({ type: ORDER_SELL, price, totalAmount, resourceType, roomName: this.name})
}

Room.prototype.deal = function (orderId, amount) {
    if (!amount) amount = Game.market.getOrderById(orderId).amount
    return Game.market.deal(orderId, amount, this.name)
}

Room.prototype.s2t = function (amount, resourceType = RESOURCE_ENERGY) {
    this.addCenterTask('storage', 'storage', 'terminal', resourceType, amount)
}

Room.prototype.t2s = function (amount, resourceType = RESOURCE_ENERGY) {
    this.addCenterTask('terminal', 'terminal', 'storage', resourceType, amount)
}

function checkPrice(order, latestHistory) {
    if (order.amount <= 1000 || Game.rooms[order.roomName]) return false
    const avgPrice = latestHistory.avgPrice
    if (order.type === ORDER_BUY) return order.price <= avgPrice * 1.1
    else if (order.type === ORDER_SELL) return order.price >= avgPrice * 0.9
}

function getExpectPrice(type, resourceType) {
    const latestHistory = Game.market.getHistory(resourceType).pop()
    if (!latestHistory) return
    if (type === ORDER_BUY) {
        const orders = Game.market.getAllOrders({ type, resourceType })
        const sortedOrders = _.sortBy(orders, i => i.price * -1)
        const bestOrder = sortedOrders.find(i => checkPrice(i, latestHistory))
        return bestOrder && (bestOrder.price + 0.1)
    } else if (type === ORDER_SELL) {
        return latestHistory.avgPrice
    }
}

function releaseOrder(roomName, type, resourceType, totalAmount) {
    const order = _.find(Game.market.orders, { roomName, type, resourceType })
    if (order) {
        if (order.remainingAmount < totalAmount / 2) Game.market.extendOrder(order.id, totalAmount - order.remainingAmount)
    } else {
        const price = getExpectPrice(type, resourceType)
        Game.market.createOrder({ type, price, totalAmount, resourceType, roomName})
    }
}
