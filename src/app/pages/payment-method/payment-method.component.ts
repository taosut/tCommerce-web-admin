import { Component, OnInit } from '@angular/core';
import { PaymentMethodDto } from '../../shared/dtos/payment-method.dto';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PaymentMethodService } from '../../shared/services/payment-method.service';
import { NotyService } from '../../noty/noty.service';
import { Router } from '@angular/router';

@Component({
  selector: 'payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss']
})
export class PaymentMethodComponent implements OnInit {

  paymentMethods: PaymentMethodDto[] = [];
  activeMethod: PaymentMethodDto;
  form: FormGroup;

  constructor(private paymentMethodService: PaymentMethodService,
              private notyService: NotyService,
              private router: Router,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.init()
  }

  private init() {
    this.activeMethod = null;
    this.paymentMethodService.fetchAllMethods().subscribe(
      response => {
        this.paymentMethods = response.data;

        if (this.paymentMethods[0]) {
          this.selectMethod(this.paymentMethods[0]);
        }
      }
    );
  }

  selectMethod(paymentMethod: PaymentMethodDto) {
    this.activeMethod = paymentMethod;

    this.form = this.formBuilder.group({
      isEnabled: paymentMethod.isEnabled,
      name: [paymentMethod.name, Validators.required],
      price: paymentMethod.price,
      sortOrder: paymentMethod.sortOrder
    });
  }

  addNewMethod() {
    const newMethod = new PaymentMethodDto();
    this.paymentMethods.push(newMethod);
    this.selectMethod(newMethod);
  }

  saveMethod() {
    if (this.form.invalid) {
      this.validateControls();
      return;
    }

    const dto: PaymentMethodDto = {
      ...this.activeMethod,
      ...this.form.value
    };

    if (dto.id) {
      this.paymentMethodService.updatePaymentMethod(dto.id, dto)
        .pipe(this.notyService.attachNoty({ successText: `Способ оплаты успешно обновлён` }))
        .subscribe(response => this.init());
    } else {

      this.paymentMethodService.createPaymentMethod(dto)
        .pipe(this.notyService.attachNoty({ successText: `Способ оплаты успешно создан` }))
        .subscribe(response => this.init());
    }
  }

  deleteMethod() {
    if (!this.activeMethod.id || !confirm(`Вы уверены, что хотите удалить '${this.activeMethod.name}'?`)) {
      return;
    }

    this.paymentMethodService.deletePaymentMethod(this.activeMethod.id)
      .pipe(this.notyService.attachNoty({ successText: `Способ оплаты успешно удалён` }))
      .subscribe(response => this.init());
  }

  private validateControls(form: FormGroup | FormArray = this.form) {
    Object.keys(form.controls).forEach(controlName => {
      const control = form.get(controlName);

      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.validateControls(control);
      }
    });
  }

  isControlInvalid(control: AbstractControl) {
    return !control.valid && control.touched;
  }

}
