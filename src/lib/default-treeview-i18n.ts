import {Injectable} from '@angular/core';
import {I18n} from '../app/i18n';
import {TreeviewI18n, TreeviewSelection} from 'ngx-treeview';

@Injectable()
export class DefaultTreeviewI18n extends TreeviewI18n {
  constructor(
    protected i18n: I18n
  ) {
    super();
  }

  getText(selection: TreeviewSelection): string {
    if (selection.uncheckedItems.length === 0) {
      return this.i18n.language === 'en' ? 'All' : 'Todos';
    }

    switch (selection.checkedItems.length) {
      case 0:
        return this.i18n.language === 'en' ? 'Select options' : 'Seleccione opciones';
      case 1:
        return selection.checkedItems[0].text;
      default:
        return this.i18n.language === 'en'
          ? `${selection.checkedItems.length} options selected`
          : `${selection.checkedItems.length} opciones seleccionadas`;
    }
  }

  getAllCheckboxText(): string {
    if (this.i18n.language === 'en') {
      return 'All';
    } else {
      return 'Todos';
    }
  }

  getFilterPlaceholder(): string {
    if (this.i18n.language === 'en') {
      return 'Filter';
    } else {
      return 'Filtrar';
    }
  }

  getFilterNoItemsFoundText(): string {
    if (this.i18n.language === 'en') {
      return 'No items found';
    } else {
      return 'No se encontraron elementos';
    }
  }

  getTooltipCollapseExpandText(isCollapse: boolean): string {
    return isCollapse
      ? this.i18n.language === 'en' ? 'Expand' : 'Expandir'
      : this.i18n.language === 'en' ? 'Collapse' : 'Contraer';
  }
}
