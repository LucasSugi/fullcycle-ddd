import EventInterface from "../../@shared/event/event.interface";

interface CostumerEventData {
    id: string;
    name: string;
}

export default class CostumerCreatedEvent implements EventInterface {
  dataTimeOccurred: Date;
  eventData: any;

  constructor(eventData: CostumerEventData) {
    this.dataTimeOccurred = new Date();
    this.eventData = eventData;
  }
}
