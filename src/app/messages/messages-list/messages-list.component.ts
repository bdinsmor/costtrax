import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MasterDetailCommands } from '@app/core/master-detail-commands';
import { Message } from '@app/core/in-memory-data.service';

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesListComponent {
  @Input() messages: Message[];
  @Input() selectedMessage: Message;
  @Input() commands: MasterDetailCommands<Message>;

  byId(message: Message) {
    return message.id;
  }

  onSelect(message: Message) {
    this.commands.select(message);
  }

  deleteVillain(message: Message) {
    this.commands.delete(message);
  }
}
