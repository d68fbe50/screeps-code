global.co = function (orderId) {
    return Game.market.cancelOrder(orderId)
}

global.cop = function (orderId, newPrice) {
    const order = Game.market.getOrderById(orderId)
    if (order && order.resourceType === energy && newPrice > 20) return '太贵辣！'
    return Game.market.changeOrderPrice(orderId, newPrice)
}

global.eo = function (orderId, addAmount) {
    return Game.market.extendOrder(orderId, addAmount)
}

Room.prototype.buy = function (amount, resourceType = energy) {
    const result = releaseOrder(this.name, ORDER_BUY, resourceType, amount)
    this.log(result)
}

Room.prototype.sell = function (amount, resourceType = energy) {
    const result = releaseOrder(this.name, ORDER_SELL, resourceType, amount)
    this.log(result)
}

Room.prototype.cob = function (price, totalAmount, resourceType = energy) {
    if (resourceType === energy && price > 20) return '太贵辣！'
    return Game.market.createOrder({ type: ORDER_BUY, price, totalAmount, resourceType, roomName: this.name})
}

Room.prototype.cos = function (price, totalAmount, resourceType = energy) {
    return Game.market.createOrder({ type: ORDER_SELL, price, totalAmount, resourceType, roomName: this.name})
}

Room.prototype.deal = function (orderId, amount) {
    if (!amount) amount = Game.market.getOrderById(orderId).amount
    return Game.market.deal(orderId, amount, this.name)
}

Room.prototype.s2t = function (amount, resourceType = energy) {
    this.addCenterTask('storage', 'storage', 'terminal', resourceType, amount)
}

Room.prototype.t2s = function (amount, resourceType = energy) {
    this.addCenterTask('terminal', 'terminal', 'storage', resourceType, amount)
}

Room.prototype.send = function (roomName, amount, resourceType = energy) {
    return this.terminal && this.terminal.send(resourceType, amount, roomName, '鸡你太美')
}

function checkPrice(order, latestHistory) {
    if (order.amount <= 1000 || Game.rooms[order.roomName]) return false
    const avgPrice = latestHistory.avgPrice
    if (order.type === ORDER_BUY) return order.price <= avgPrice * 1.2
    else if (order.type === ORDER_SELL) return order.price >= avgPrice * 0.8
}

function getExpectPrice(type, resourceType) {
    const history = Game.market.getHistory(resourceType).pop()
    if (!history) return
    if (type === ORDER_BUY) {
        const orders = Game.market.getAllOrders({ type, resourceType })
        const sorted = _.sortBy(orders, i => i.price * -1)
        const highest = sorted.find(i => checkPrice(i, history))
        return highest && (highest.price + 0.1)
    } else if (type === ORDER_SELL) {
        const orders = Game.market.getAllOrders({ type, resourceType })
        const sorted = _.sortBy(orders, i => i.price)
        const lowest = sorted.find(i => checkPrice(i, history))
        return lowest && (lowest.price - 0.1)
    }
}

function releaseOrder(roomName, type, resourceType, totalAmount) {
    const order = _.find(Game.market.orders, { roomName, type, resourceType })
    const price = getExpectPrice(type, resourceType)
    if (order) {
        if (order.price !== price) {
            Game.market.changeOrderPrice(order.id, price)
            console.log(`[修改价格:${order.id}] $${order.price}->$${price}`)
        }
        if (order.remainingAmount > totalAmount / 2) return '订单余量足够不需扩充'
        Game.market.extendOrder(order.id, totalAmount - order.remainingAmount)
        return `[扩充订单:${order.id}] ${type} ${resourceType}*${totalAmount - order.remainingAmount} $${order.price}`
    } else {
        Game.market.createOrder({ type, price, totalAmount, resourceType, roomName})
        return `[创建订单] ${type} ${resourceType}*${totalAmount} $${price}`
    }
}
