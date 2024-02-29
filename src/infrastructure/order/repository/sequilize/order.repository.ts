import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {

    // Get all items of order from DB
    const orderItemsDB = await OrderItemModel.findAll({ where: { order_id: entity.id } });

    // Create items that not exist on DB
		for (const item of entity.items) {
			const itemExistDB = orderItemsDB.find((itemDB) => itemDB.id === item.id);

			if (!itemExistDB) {
        await OrderItemModel.create(
          {
            id: item.id,
            name: item.name,
            price: item.price,
            product_id: item.productId,
            quantity: item.quantity,
            order_id: entity.id
          },
        );
			}
		}

    // Update the total order
    await OrderModel.update(
      {
        total: entity.total(),
      },
      {
        where: {
          id: entity.id,
        },
      }
    );

  }

  async find(id: string): Promise<Order> {
    let orderModel;
    try {
      orderModel = await OrderModel.findOne({
        where: {
          id,
        },
				include: [{ model: OrderItemModel }],
        rejectOnEmpty: true,
      });
    } catch (error) {
      throw new Error("order not found");
    }

    const items = orderModel.items.map((item) => {
      return new OrderItem(
        item.id,
        item.name,
        item.price,
        item.product_id,
        item.quantity
      );
    });

    const order = new Order(orderModel.id, orderModel.customer_id, items);
    return order;
  }

  async findAll(): Promise<Order[]> {
		const orderModel = await OrderModel.findAll({ include: [{ model: OrderItemModel }] });

    const orders = orderModel.map((order) => {
      const items = order.items.map((item) => {
        return new OrderItem(
          item.id,
          item.name,
          item.price,
          item.product_id,
          item.quantity
        );
      });

      return new Order(order.id, order.customer_id, items);
    });

    return orders;
  }
}
