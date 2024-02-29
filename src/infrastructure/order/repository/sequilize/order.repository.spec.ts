import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update an order", async () => {

    // Init repositories
    const customerRepository = new CustomerRepository();
    const productRepository = new ProductRepository();
    const orderRepository = new OrderRepository();

    // Create customer
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);

    // Create customer on DB
    await customerRepository.create(customer);

    // Create Product
    const product1 = new Product("p1", "Product 1", 10);

    // Create Product on DB
    await productRepository.create(product1);

    // Create orderItem
    const orderItem1 = new OrderItem(
      "o1",
      product1.name,
      product1.price,
      product1.id,
      2
    );

    // Create order
    const order = new Order("123", "123", [orderItem1]);

    // Create order on DB
    await orderRepository.create(order);

    /* UPDATE */

    // Create Product to Update
    const product2 = new Product("p2", "Product 2", 20);

    // Create Product to Update on DB
    await productRepository.create(product2);

    // Create orderItem to Update
    const orderItem2 = new OrderItem(
      "o2",
      product2.name,
      product2.price,
      product2.id,
      2
    );

    // Update the order
    order.addItem(orderItem2)

    // Update order on DB
    await orderRepository.update(order)

    // Get order updated from DB
    const orderUpdated = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    // Check
    expect(orderUpdated.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: order.items.map((orderItem) => ({
        id: orderItem.id,
        name: orderItem.name,
        price: orderItem.price,
        quantity: orderItem.quantity,
        order_id: order.id,
        product_id: orderItem.productId,
      })),
    });
  });

  it("should find an order", async () => {

    // Init repositories
    const customerRepository = new CustomerRepository();
    const productRepository = new ProductRepository();
    const orderRepository = new OrderRepository();

    // Create customer
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);

    // Create customer on DB
    await customerRepository.create(customer);

    // Create Product
    const product1 = new Product("p1", "Product 1", 10);

    // Create Product on DB
    await productRepository.create(product1);

    // Create orderItem
    const orderItem1 = new OrderItem(
      "o1",
      product1.name,
      product1.price,
      product1.id,
      2
    );

    // Create order
    const order = new Order("123", "123", [orderItem1]);

    // Create order on DB
    await orderRepository.create(order);

    // Get order from DB
    const orderResult = await orderRepository.find(order.id)

    // Check
    expect(order).toStrictEqual(orderResult);

  });

  it("should find all orders", async () => {

    // Init repositories
    const customerRepository = new CustomerRepository();
    const productRepository = new ProductRepository();
    const orderRepository = new OrderRepository();

    // Create customer
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);

    // Create customer on DB
    await customerRepository.create(customer);

    // Create Product
    const product = new Product("p1", "Product 1", 10);

    // Create Product on DB
    await productRepository.create(product);

    // Create orderItem
    const orderItem1 = new OrderItem(
      "o1",
      product.name,
      product.price,
      product.id,
      2
    );
    const orderItem2 = new OrderItem(
      "o2",
      product.name,
      product.price,
      product.id,
      2
    );
    const orderItem3 = new OrderItem(
      "o3",
      product.name,
      product.price,
      product.id,
      2
    );

    // Create order
    const order1 = new Order("o1", "123", [orderItem1]);
    const order2 = new Order("o2", "123", [orderItem2]);
    const order3 = new Order("o3", "123", [orderItem3]);

    // Create order on DB
    await orderRepository.create(order1);
    await orderRepository.create(order2);
    await orderRepository.create(order3);

    // Get from DB
    const orders = await orderRepository.findAll();

    // Check
    expect(orders).toHaveLength(3);
    expect(orders).toContainEqual(order1);
    expect(orders).toContainEqual(order2);
    expect(orders).toContainEqual(order3);

  });

});
