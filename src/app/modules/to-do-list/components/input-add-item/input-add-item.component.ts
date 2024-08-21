import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, inject, Input, Output, signal, ViewChild } from '@angular/core';
import { IListItem } from '../../interfaces/IListItem.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-add-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-add-item.component.html',
  styleUrl: './input-add-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputAddItemComponent {

  listItems = signal<IListItem[]>([]);
  @Input({required: true}) set inputListItems(itens: IListItem[]){
    this.listItems.set(itens);
  };

  @Output() public outputAddListItems = new EventEmitter<IListItem>();

  private _cdr = inject(ChangeDetectorRef);

  @ViewChild('inputText') public inputText!: ElementRef;


  public focusAndAddItem(value: string) {
    if(value){
      this._cdr.detectChanges();
      this.inputText.nativeElement.value = "";

      const currentDate = new Date();
      const id = `ID ${currentDate.getTime()}`;

      this.outputAddListItems.emit({
        id,
        checked: false,
        value
      })
      
      return this.inputText.nativeElement.focus();
    }
  }
}
