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
    const sequelize = OrderModel.sequelize;
    await sequelize.transaction(async (t) => {
        // Excluir os relacionados antigos ou excluir os que não são mais necessários
        await OrderItemModel.destroy({
            where: {
                order_id: entity.id,
            },
            transaction: t,
        });

        // Incluir os novos relacionados usando o bulkCreate
        await OrderItemModel.bulkCreate(
            entity.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity,
                order_id: entity.id,
            })),
            { transaction: t }
        );

        // Atualiza-se a order com os dados comuns
        await OrderModel.update(
          { total: entity.total() },
          { where: { id: entity.id }, transaction: t }
        );
    });
  }

  async find(id: string): Promise<Order>{
    let orderModel;

    try{
      orderModel = await OrderModel.findOne({
        where: {
          id,
        },
        rejectOnEmpty: true,
        include : [
          {
            model: OrderItemModel,
          }
        ]
      });
    } catch (error) {
      throw new Error("Order not found");
    }

    const items: OrderItem[] = orderModel.items.map((item) => {
      return new OrderItem(
          item.id,
          item.name,
          item.price,
          item.product_id,
          item.quantity
      );
    })

    const order = new Order(
      orderModel.id,
      orderModel.customer_id,
      items
    )
    
    return order
  }

  async findAll(): Promise<Order[]>{
    const orderModel = await OrderModel.findAll({
      include : [
        {
          model: OrderItemModel,
        }
      ]
    });

    const orders = orderModel.map((orderModel) => {
      const items: OrderItem[] = orderModel.items.map((item) => {
        return new OrderItem(
            item.id,
            item.name,
            item.price,
            item.product_id,
            item.quantity
        );
      })
      let order = new Order(
        orderModel.id,
        orderModel.customer_id,
        items
      )
      return order
    })

    return orders
  }
}
