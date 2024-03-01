import EventInterface from "../../@shared/event/event.interface";

interface ConsumerEventData {
    id: string;
    name: string;
}

export default class ConsumerCreatedEvent implements EventInterface {
  dataTimeOccurred: Date;
  eventData: any;

  constructor(eventData: ConsumerEventData) {
    this.dataTimeOccurred = new Date();
    this.eventData = eventData;
  }
}
