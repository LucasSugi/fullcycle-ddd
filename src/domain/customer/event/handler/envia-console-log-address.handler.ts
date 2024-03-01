import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import ConsumerChangedAddressEvent from "../consumer-changed-address.event";

export default class EnviaConsoleLogAddressHandler
  implements EventHandlerInterface<ConsumerChangedAddressEvent>
{
  handle(event: ConsumerChangedAddressEvent): void {
    console.log(`Endereço do cliente: ${event.id}, ${event.name} alterado para: ${event.address}`);
  }
}
