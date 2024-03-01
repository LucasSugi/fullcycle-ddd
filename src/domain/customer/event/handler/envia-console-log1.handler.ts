import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import ConsumerCreatedEvent from "../consumer-created.event";

export default class EnviaConsoleLog1Handler
  implements EventHandlerInterface<ConsumerCreatedEvent>
{
  handle(event: ConsumerCreatedEvent): void {
    console.log(`Esse é o primeiro console.log do evento: CustomerCreated`);
  }
}
