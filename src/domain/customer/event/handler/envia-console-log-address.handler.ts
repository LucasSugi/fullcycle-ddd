import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CostumerChangedAddressEvent from "../costumer-changed-address.event";

export default class EnviaConsoleLogAddressHandler
  implements EventHandlerInterface<CostumerChangedAddressEvent>
{
  handle(event: CostumerChangedAddressEvent): void {
    console.log(`Endereço do cliente: ${event.id}, ${event.name} alterado para: ${event.address}`);
  }
}
