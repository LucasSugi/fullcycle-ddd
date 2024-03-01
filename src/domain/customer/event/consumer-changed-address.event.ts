import EventInterface from "../../@shared/event/event.interface";

interface ConsumerChangedAddressEventData {
    id: string;
    name: string;
    street: string,
    number: number,
    zip: string,
    city: string,
}

export default class ConsumerChangedAddressEvent implements EventInterface {
  dataTimeOccurred: Date;
  eventData: any;

  constructor(eventData: ConsumerChangedAddressEventData) {
    this.dataTimeOccurred = new Date();
    this.eventData = eventData;
  }

  get id() {
    return this.eventData.id
  }

  get name() {
    return this.eventData.name
  }

  get address() {
    return `${this.eventData.street}, ${this.eventData.number}, ${this.eventData.zip}, ${this.eventData.city}`
  }

}
