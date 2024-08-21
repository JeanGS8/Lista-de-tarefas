import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InputAddItemComponent } from '../../components/input-add-item/input-add-item.component';
import { IListItem } from '../../interfaces/IListItem.interface';
import { CommonModule } from '@angular/common';
import { InputListItemComponent } from '../../components/input-list-item/input-list-item.component';
import { ELocalstorage } from '../../enum/ELocalstorage.enum';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    InputAddItemComponent,
    CommonModule,
    InputListItemComponent
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent {
  public addItem = signal(true);

  //armazena todos os valores do localstorage
  private _setListItems = signal<IListItem[]>(this._parseItems());

  //retorna todos os valores de _setListItems apenas para leitura
  public getListItems = this._setListItems.asReadonly();

  //retorna os valores do localstorage em json
  private _parseItems(){
    return JSON.parse(localStorage.getItem(ELocalstorage.MY_LIST) || '[]')
  }

  private _updateLocalStorage(){
    localStorage.setItem(ELocalstorage.MY_LIST, JSON.stringify(this._setListItems()));
  }

  //adicionar valores no localstorage
  public getInputAndAddItem(value: IListItem){

    //atualiza o localstorage passando os valores que já estavam nela (setListItem) e os novos valores (value)
    localStorage.setItem(ELocalstorage.MY_LIST, JSON.stringify([
      ...this._setListItems(),
      value
    ]));

    //atualiza o setListItems utilizando o _parseItems
    return this._setListItems.set(this._parseItems());
  }

  public listItemsStage(value: 'pending' | 'completed'){
    const arr = this.getListItems().filter((item: IListItem) => {
      return value === 'pending'? !item.checked : item.checked;
    })
  
    return arr;
  }

  public updateItemCheckbox(newValue: {id: string, checked: boolean}){

    this._setListItems.update((oldValue: IListItem[]) => {
      oldValue.filter((item: IListItem) => {
        //alterar o item.checked e retornar somente este item
        if(item.id === newValue.id){
          item.checked = newValue.checked;
          return item;
        }
        //retornar todos os outros itens
        return item;
      });
      //retornando toda essa alteração para _setListItems;
      return oldValue;
    });

    return this._updateLocalStorage();
  }

  public updateItemText(newValue: {id: string,  value: string}){
    this._setListItems.update((oldValue: IListItem[]) => {
      oldValue.filter((item: IListItem) => {
        if(item.id === newValue.id){
          item.value = newValue.value;
          return item;
        }
        return item;
      })

      return oldValue;
    })
    return this._updateLocalStorage();
  }

  public deleteItem(id: string){
    Swal.fire({
      title: "Tem certeza?",
      text: "Você não poderá reverter isso!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, delete o item!"
    }).then((result) => {
      if (result.isConfirmed) {
        this._setListItems.update((oldValue: IListItem[]) => {
          return oldValue.filter((item: IListItem) => item.id != id);
        })
        return this._updateLocalStorage();
      }
    });
  }

  public deleteAllItems(){
    Swal.fire({
      title: "Tem certeza?",
      text: "Você não poderá reverter isso!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, delete tudo!"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem(ELocalstorage.MY_LIST);
        return this._setListItems.set(this._parseItems());
      }
    });
  }
  
}
