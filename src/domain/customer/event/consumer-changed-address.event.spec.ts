import EventDispatcher from "../../@shared/event/event-dispatcher";
import ConsumerChangedAddressEvent from "./consumer-changed-address.event";
import EnviaConsoleLogAddressHandler from "./handler/envia-console-log-address.handler";

describe("Domain events tests", () => {
  it("should notify when consumer changed address", () => {

    const eventDispatcher = new EventDispatcher();

    const eventHandler = new EnviaConsoleLogAddressHandler();

    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ConsumerChangedAddressEvent", eventHandler);

    const consumerEvent = new ConsumerChangedAddressEvent({
        id: "123",
        name: "name 1",
        street: "street 1",
        number: 1,
        zip: "zip 1",
        city: "city 1",
    });

    eventDispatcher.notify(consumerEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });

});
