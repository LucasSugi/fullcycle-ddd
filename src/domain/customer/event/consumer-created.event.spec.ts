import EventDispatcher from "../../@shared/event/event-dispatcher";
import ConsumerCreatedEvent from "./consumer-created.event";
import EnviaConsoleLog1Handler from "./handler/envia-console-log1.handler";
import EnviaConsoleLog2Handler from "./handler/envia-console-log2.handler";

describe("Domain events tests", () => {
  it("should notify all event handlers when consumer is created", () => {

    const eventDispatcher = new EventDispatcher();

    const eventHandler1 = new EnviaConsoleLog1Handler();
    const eventHandler2 = new EnviaConsoleLog2Handler();

    const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

    eventDispatcher.register("ConsumerCreatedEvent", eventHandler1);
    eventDispatcher.register("ConsumerCreatedEvent", eventHandler2);


    const consumerEvent = new ConsumerCreatedEvent({id: "123", name: "Name 1"});
    eventDispatcher.notify(consumerEvent);

    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
  });

});
