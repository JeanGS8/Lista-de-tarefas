import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { IListItem } from '../../interfaces/IListItem.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-list-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-list-item.component.html',
  styleUrl: './input-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputListItemComponent {
  
  listItems = signal<IListItem[]>([]);
  @Input({required: true}) set inputListItems(itens: IListItem[]) {
    this.listItems.set(itens);
  };

  @Output()
  public outputUpdateItemCheckbox = new EventEmitter<{
    id: string,
    checked: boolean
  }>();
  
  public updateItemCheckbox(id: string, checked: boolean){
    return this.outputUpdateItemCheckbox.emit({id, checked});
  }
  
  @Output()
  public outputUpdateItemText = new EventEmitter<{
    id: string,
    value: string
  }>();
  
  public updateItemText(id: string, value: string){
    return this.outputUpdateItemText.emit({id, value});
  }

  @Output()
  public outputDeleteItem = new EventEmitter<string>();

  public deleteItem(id: string) {
    return this.outputDeleteItem.emit(id)
  }
  
}
