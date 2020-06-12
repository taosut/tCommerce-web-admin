import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderService } from '../../shared/services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderDto } from '../../shared/dtos/order.dto';
import { CustomerDto } from '../../shared/dtos/customer.dto';
import { CustomerService } from '../../shared/services/customer.service';
import { NotyService } from '../../noty/noty.service';
import { AddressFormComponent } from '../../address-form/address-form.component';
import { saveFileFromUrl } from '../../shared/helpers/save-file.function';
import { API_HOST } from '../../shared/constants/constants';
import { FormControl } from '@angular/forms';
import { HeadService } from '../../shared/services/head.service';
import { OrderStatusEnum } from '../../shared/enums/order-status.enum';
import { ShipmentInfoModalComponent } from './shipment-info-modal/shipment-info-modal.component';
import { ShipmentDto } from '../../shared/dtos/shipment.dto';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.scss']
})
export class OrderViewComponent implements OnInit {

  uploadedHost = API_HOST;
  order: OrderDto;
  customer: CustomerDto;
  isAddressFormVisible: boolean = false;
  trackingIdControl: FormControl;
  isLoading: boolean = false;

  @ViewChild(AddressFormComponent) addressFormCmp: AddressFormComponent;
  @ViewChild(ShipmentInfoModalComponent) shipmentInfoModalCmp: ShipmentInfoModalComponent;

  constructor(private orderService: OrderService,
              private customerService: CustomerService,
              private notyService: NotyService,
              private headService: HeadService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.init();
  }

  private init() {
    const id  = this.route.snapshot.paramMap.get('id');
    this.isLoading = true;
    this.orderService.fetchOrder(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(
        response => {
          this.order = response.data;
          this.fetchCustomer(this.order.customerId);
          this.headService.setTitle(`Заказ №${this.order.id}`);
        }
      );
  }

  private fetchCustomer(customerId: number) {
    this.isLoading = true;
    this.customerService.fetchCustomer(customerId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(
        response => {
          this.customer = response.data;
        }
      );
  }

  goBack() {
    this.router.navigate(['admin', 'order']);
  }

  cancelOrder() {
    if (!confirm(`Вы уверены, что хотите отменить заказ?`)) {
      return;
    }

    this.isLoading = true;
    this.orderService.cancelOrder(this.order.id)
      .pipe(
        this.notyService.attachNoty({ successText: 'Заказ успешно отменён' }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(
        response => {
          this.order = response.data;
        },
        error => console.warn(error)
      );
  }

  reorder() {
    this.router.navigate(['admin', 'order', 'add', 'based-on', this.order.id]);
  }

  startOrder() {
    if (!confirm(`Вы уверены, что хотите начать заказ?`)) {
      return;
    }

    this.isLoading = true;
    this.orderService.startOrder(this.order.id)
      .pipe(
        this.notyService.attachNoty({ successText: `Заказ переведён в статус 'Начат'` }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(
        response => {
          this.order = response.data;
        },
        error => console.warn(error)
      );
  }

  // shipOrder() {
  //   if (!confirm(`Вы уверены, что хотите отправить заказ?`)) {
  //     return;
  //   }
  //
  //   this.orderService.shipOrder(this.order.id)
  //     .pipe(this.notyService.attachNoty({ successText: `Заказ переведён в статус 'Отправлен'` }))
  //     .subscribe(
  //       response => {
  //         this.order = response.data;
  //       },
  //       error => console.warn(error)
  //     );
  // }

  printOrder() {
    const url = this.orderService.getPrintOrderUrl(this.order.id);
    saveFileFromUrl(url);
  }

  editOrder() {
    if (!confirm(`Вы уверены, что хотите изменить этот заказ?`)) {
      return;
    }

    this.router.navigate(['admin', 'order', 'edit', this.order.id]);
  }

  isCancelOrderVisible(): boolean {
    return this.order.status === OrderStatusEnum.STARTED || this.order.status === OrderStatusEnum.NEW;
  }

  isStartOrderVisible(): boolean {
    return this.order.status === OrderStatusEnum.NEW;
  }

  isShipOrderVisible(): boolean {
    return this.order.status === OrderStatusEnum.STARTED || this.order.status === OrderStatusEnum.NEW;
  }

  isEditOrderVisible(): boolean {
    return this.order.status === OrderStatusEnum.STARTED || this.order.status === OrderStatusEnum.NEW;
  }

  openAddressForm() {
    this.isAddressFormVisible = true;
  }

  closeAddressForm() {
    this.isAddressFormVisible = false;
  }

  submitAddressForm() {
    if (!this.addressFormCmp.checkValidity()) {
      return;
    }

    const address = this.addressFormCmp.getValue();
    this.isLoading = true;
    this.orderService.updateOrderAddress(this.order.id, address)
      .pipe(
        this.notyService.attachNoty({ successText: 'Адрес в заказе успешно изменён' }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(
        response => {
          this.order = response.data;
          this.closeAddressForm();
        }
      );
  }

  openTrackingIdForm() {
    this.trackingIdControl = new FormControl(this.order.shipment.trackingNumber);
  }

  closeTrackingIdForm() {
    this.trackingIdControl = null;
  }

  updateTrackingId() {
    const trackingNumber = this.trackingIdControl.value;
    this.isLoading = true;
    this.orderService.updateOrderTrackingId(this.order.id, trackingNumber)
      .pipe(
        this.notyService.attachNoty({ successText: 'Номер ТТН успешно изменён' }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(
        response => {
          this.order = response.data;
          this.closeTrackingIdForm();
        }
      );
  }

  openShipmentInfo() {
    this.shipmentInfoModalCmp.openModal();
  }

  onShipmentInfoSubmit(shipment: ShipmentDto) {
    this.isLoading = true;
    this.orderService.shipOrder(this.order.id, shipment)
      .pipe(
        this.notyService.attachNoty({ successText: 'ЭН успешно создана' }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(
        response => {
          this.order = response.data;
        }
      );
  }
}
