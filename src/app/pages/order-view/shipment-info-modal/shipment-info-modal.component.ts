import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ShipmentDto } from '../../../shared/dtos/shipment.dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShipmentSenderService } from '../../../shared/services/shipment-sender.service';
import { ISelectOption } from '../../../shared/components/select/select-option.interface';
import { ShipmentSenderDto } from '../../../shared/dtos/shipment-sender.dto';
import { ShipmentPayerEnum } from '../../../shared/enums/shipment-payer.enum';
import { NotyService } from '../../../noty/noty.service';

@Component({
  selector: 'shipment-info-modal',
  templateUrl: './shipment-info-modal.component.html',
  styleUrls: ['./shipment-info-modal.component.scss']
})
export class ShipmentInfoModalComponent implements OnInit {

  isModalVisible: boolean = false;
  form: FormGroup;
  sendersSelectOptions: ISelectOption[];
  payerTypeOptions: ISelectOption[] = [{ view: 'Получатель', data: ShipmentPayerEnum.RECIPIENT }, { view: 'Отправитель', data: ShipmentPayerEnum.SENDER }];
  private defaultSenderId: number;

  @Input() shipment: ShipmentDto;
  @Input() cost: number;
  @Input() setBackwardDeliveryAsCost: boolean = false;
  @Output('infoSubmit') submitEmitter = new EventEmitter<ShipmentDto>();

  constructor(private shipmentSenderService: ShipmentSenderService,
              private notyService: NotyService,
              private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.fetchSenders();
  }

  private fetchSenders() {
    this.shipmentSenderService.fetchAllSenders()
      .pipe()
      .subscribe(
        response => {
          this.setSelectOptions(response.data);
          this.buildForm();
        }
      );
  }

  private buildForm() {
    let backwardMoneyDelivery: any = this.shipment.backwardMoneyDelivery;
    if (this.setBackwardDeliveryAsCost && !backwardMoneyDelivery) {
      backwardMoneyDelivery = this.cost;
    }

    const controls: Partial<Record<keyof ShipmentDto, any>> = {
      senderId: [this.defaultSenderId || this.shipment.senderId, Validators.required],
      weight: [this.shipment.weight, Validators.required],
      width: [this.shipment.width, Validators.required],
      height: [this.shipment.height, Validators.required],
      length: [this.shipment.length, Validators.required],
      description: [this.shipment.description, Validators.required],
      payerType: [this.shipment.payerType, Validators.required],
      backwardMoneyDelivery: backwardMoneyDelivery,
      cost: this.cost
    };

    this.form = this.formBuilder.group(controls);
  }

  openModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }

  onFormSubmit() {
    if (this.form.invalid) {
      this.notyService.showErrorNoty(`Ошибка в форме`);
      return;
    }

    this.submitEmitter.emit(this.form.value);
    this.closeModal();
  }

  private setSelectOptions(senders: ShipmentSenderDto[]) {
    this.sendersSelectOptions = senders.map(sender => {
      if (sender.isDefault) {
        this.defaultSenderId = sender.id;
      }
      return {
        data: sender.id,
        view: `${sender.firstName} ${sender.lastName}, ${sender.phone}, ${sender.address}`
      };
    });
  }
}
