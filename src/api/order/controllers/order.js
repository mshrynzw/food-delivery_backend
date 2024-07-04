"use strict"

/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const { address, amount, dishes, token } = JSON.parse(ctx.request.body)
    const charge = await stripe.charges.create({
      amount: amount,
      currency: "jpy",
      source: token,
      description: `Order ${new Date()} by ${ctx.state.user._id}`
    })

    return strapi.entityService.create("api::order.order", {
      data: {
        user: ctx.state.user._id,
        charge_id: charge.id,
        amount: amount,
        address,
        dishes
      }
    })
  }
}))
