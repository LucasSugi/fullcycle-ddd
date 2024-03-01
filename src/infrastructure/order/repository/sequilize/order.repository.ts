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

    // Convert array of objects to one object
    const orderItemsDBObj = orderItemsDB.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {});
    const orderItemsObj = entity.items.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {});

    // Get all available IDs
    const orderItemsIdsDB = new Set(Object.keys(orderItemsDBObj));
    const orderItemsIds = new Set(Object.keys(orderItemsObj));

    // Set difference - Items that dont exist on DB
    const orderItemsNotExistOnDB = new Set([...orderItemsIds].filter(x => !orderItemsIdsDB.has(x)));

    // Create items that not exist on DB
		for (const itemId of orderItemsNotExistOnDB) {

      const item = orderItemsObj[itemId as keyof typeof orderItemsObj]

      await OrderItemModel.create(
        {
          id: item["id"],
          name: item["name"],
          price: item["price"],
          product_id: item["productId"],
          quantity: item["quantity"],
          order_id: entity.id
        },
      );
		}

    // Set difference - Items that should be deleted from DB
    const orderItemsDeleteDB = new Set([...orderItemsIdsDB].filter(x => !orderItemsIds.has(x)));

    // Delete items that not exist on entity
		for (const itemId of orderItemsDeleteDB) {
      await OrderItemModel.destroy({ where: { id: itemId } });
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
