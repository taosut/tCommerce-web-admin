import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from './directives/click-outside/click-outside.directive';
import { SelectComponent } from './components/select/select.component';
import { FieldsGroupComponent } from './components/fields-group/fields-group.component';
import { AttributeSelectComponent } from './components/attribute-select/attribute-select.component';
import { NgUnsubscribe } from './directives/ng-unsubscribe/ng-unsubscribe.directive';
import { TabsComponent } from './components/tabs/tabs.component';
import { ButtonComponent } from './components/button/button.component';
import { NumberInputDirective } from './directives/number-input/number-input.directive';
import { ToggleComponent } from './components/toggle/toggle.component';
import { ReadableCurrencyPipe } from './pipes/readable-currency.pipe';
import { NormalizedPhonePipe } from './pipes/normalized-phone.pipe';
import { PreloaderModule } from '../preloader/preloader.module';
import { AutofocusDirective } from './directives/autofocus/autofocus.directive';
import { DraggableItemDirective } from './directives/draggable-item/draggable-item.directive';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    ClickOutsideDirective,
    SelectComponent,
    FieldsGroupComponent,
    AttributeSelectComponent,
    NgUnsubscribe,
    TabsComponent,
    ButtonComponent,
    NumberInputDirective,
    ToggleComponent,
    ReadableCurrencyPipe,
    NormalizedPhonePipe,
    AutofocusDirective,
    DraggableItemDirective
  ],
  exports: [
    ClickOutsideDirective,
    SelectComponent,
    FieldsGroupComponent,
    AttributeSelectComponent,
    NgUnsubscribe,
    TabsComponent,
    ButtonComponent,
    NumberInputDirective,
    ToggleComponent,
    ReadableCurrencyPipe,
    NormalizedPhonePipe,
    AutofocusDirective,
    DraggableItemDirective
  ],
  imports: [
    CommonModule,
    PreloaderModule,
    RouterModule
  ]
})
export class SharedModule {
}
