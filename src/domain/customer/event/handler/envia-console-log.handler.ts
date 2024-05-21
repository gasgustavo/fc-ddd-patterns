import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerChangedAdressEvent from "../customer-changed-adress.event";

export default class EnviaConsoleLogHandler
  implements EventHandlerInterface<CustomerChangedAdressEvent>
{
  handle(event: CustomerChangedAdressEvent): void {
    const { id, name, endereco } = event.eventData;
    console.log(`Endereço do cliente: ${id}, ${name} alterado para: ${endereco}`);
  }
}
