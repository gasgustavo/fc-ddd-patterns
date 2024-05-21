import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerChangedAdressEvent from "./customer-changed-adress.event";
import CustomerCreatedEvent from "./customer-created.event copy";
import EnviaConsoleLogHandler from "./handler/envia-console-log.handler";
import EnviaConsoleLog1Handler from "./handler/envia-console-log1.handler";
import EnviaConsoleLog2Handler from "./handler/envia-console-log2.handler";


describe("Domain Customer events tests", () => {
  it("should notify all event handlers when a customer is created", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new EnviaConsoleLog1Handler();
    const eventHandler2 = new EnviaConsoleLog2Handler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

    eventDispatcher.register("CustomerCreatedEvent", eventHandler);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(eventHandler2);

    const customerCreatedEvent = new CustomerCreatedEvent({
      name: "Customer 1",
    });
    eventDispatcher.notify(customerCreatedEvent);
    expect(spyEventHandler).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
  });
  it("should notify all event handlers when a customer changes his adress", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new EnviaConsoleLogHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("CustomerChangedAdressEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerChangedAdressEvent"][0]
    ).toMatchObject(eventHandler);

    const customerCreatedEvent = new CustomerCreatedEvent({
      name: "Customer 1",
    });

    const customerChangedAdressEvent = new CustomerChangedAdressEvent({
      name: "Customer 1",
      id: 15,
      endereco: "Avenida Brasil, 1500, Belo Horizonte, MG, Brasil"
    });

    eventDispatcher.notify(customerChangedAdressEvent);
    expect(spyEventHandler).toHaveBeenCalled();
    // expect(spyEventHandler2).toHaveBeenCalled();
  });
});
