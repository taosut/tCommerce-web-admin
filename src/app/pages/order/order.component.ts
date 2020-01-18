import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderDto } from '../../shared/dtos/order.dto';
import { FormBuilder } from '@angular/forms';
import { OrderService } from '../../shared/services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotyService } from '../../noty/noty.service';
import { EPageAction } from '../../shared/enums/category-page-action.enum';
import { CustomerDto } from '../../shared/dtos/customer.dto';
import { ProductSelectorComponent } from './product-selector/product-selector.component';
import { OrderItemDto } from '../../shared/dtos/order-item.dto';
import { ShippingMethodDto } from '../../shared/dtos/shipping-method.dto';
import { PaymentMethodDto } from '../../shared/dtos/payment-method.dto';
import { AddressFormComponent } from '../../address-form/address-form.component';

@Component({
  selector: 'order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  isNewOrder: boolean;
  isNewCustomer: boolean = false;
  order: OrderDto;
  customer: CustomerDto;

  get orderItemsCost() { return this.order.items.reduce((acc, item) => acc + item.cost, 0); }
  get orderItemsTotalCost() { return this.order.items.reduce((acc, item) => acc + item.totalCost, 0); }

  @ViewChild(ProductSelectorComponent) productSelectorCmp: ProductSelectorComponent;
  @ViewChild(AddressFormComponent) addressFormCmp: AddressFormComponent;

  constructor(private formBuilder: FormBuilder,
              private orderService: OrderService,
              private router: Router,
              private notyService: NotyService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.init();
  }

  private init() {
    this.isNewOrder = this.route.snapshot.data.action === EPageAction.Add;

    if (this.isNewOrder) {
      this.order = new OrderDto();
    } else {
      this.fetchOrder();
    }
  }

  private fetchOrder() {
    const id = this.route.snapshot.paramMap.get('id');

    this.orderService.fetchOrder(id).subscribe(
      response => {
        this.order = response.data;
      },
      error => console.warn(error)
    )
  }

  navigateToOrderList() {
    this.router.navigate(['admin', 'order']);
  }

  navigateToOrderView() {
    this.router.navigate(['admin', 'order', 'view', this.order.id]);
  }

  cancelEdit() {
    if (!confirm(`Вы уверены, что хотите отменить этот заказ?`)) {
      return;
    }

    if (this.isNewOrder) {
      this.customer = null;
      this.order = new OrderDto();
    } else {
      this.navigateToOrderView();
    }
  }

  placeOrder() {
    if (!this.addressFormCmp.checkValidity()) {
      return;
    }

    if (!this.order.shippingMethodId) {
      this.notyService.showErrorNoty(`Не выбран ни один способ доставки`);
      return;
    }
    if (!this.order.paymentMethodId) {
      this.notyService.showErrorNoty(`Не выбран ни один способ оплаты`);
      return;
    }

    const dto = {
      ...this.order,
      address: this.addressFormCmp.getValue()
    };

    console.log(dto);
    return;
    if (this.isNewOrder) {
      this.addNewOrder(dto);
    } else {
      this.updateOrder(dto);
    }
  }

  private addNewOrder(dto: OrderDto) {
    this.orderService.addNewOrder(dto)
      .pipe(this.notyService.attachNoty({ successText: 'Заказ успешно создан' }))
      .subscribe(
        response => {
          this.order = response.data;
          this.navigateToOrderView();
        },
        error => console.warn(error)
      );
  }

  private updateOrder(dto: OrderDto) {
    this.orderService.updateOrder(this.order.id, dto)
      .pipe(this.notyService.attachNoty({ successText: 'Заказ успешно обновлён' }))
      .subscribe(
        response => {
          this.navigateToOrderView();
        },
        error => console.warn(error)
      );
  }

  selectCustomer(customer: CustomerDto) {
    this.customer = customer;
    this.order.customerId = customer.id;
    this.order.customerFirstName = customer.firstName;
    this.order.customerLastName = customer.lastName;
    this.order.customerEmail = customer.email;
    this.order.customerPhoneNumber = customer.phoneNumber;

    this.order.address = this.customer.addresses.find(a => a.isDefault) || this.customer.addresses[0];
  }

  createNewCustomer() {
    this.isNewCustomer = true;
    this.selectCustomer(new CustomerDto());
  }

  showProductSelector() {
    this.productSelectorCmp.showSelector();
  }

  onProductSelect({ variant, qty }) {
    const found = this.order.items.find(item => item.sku === variant.sku);
    if (found) {
      const qtySum = found.qty + qty;
      if (qtySum > variant.qty) {
        alert(`Не хватает количества товара. Пытаетесь добавить: ${qtySum}. Всего в наличии: ${variant.qty}.`);
        return;
      }

      found.qty += qty;
      this.calcOrderItemCosts(found);

    } else {

      const orderItem = new OrderItemDto();
      orderItem.name = variant.name;
      orderItem.sku = variant.sku;
      orderItem.price = variant.price;
      orderItem.qty = qty;
      orderItem.discountPercent = variant.isDiscountApplicable ? this.customer.discountPercent : 0;
      this.calcOrderItemCosts(orderItem);
      this.order.items.push(orderItem);
    }
  }

  removeOrderItem(index: number) {
    this.order.items.splice(index, 1);
  }

  setOrderItemQty(target: any, orderItem: OrderItemDto) {
    const newValue = target.value;
    if (!newValue) {
      target.value = orderItem.qty;
      return;
    }

    orderItem.qty = newValue;
    this.calcOrderItemCosts(orderItem);
  }

  private calcOrderItemCosts(orderItem: OrderItemDto) {
    orderItem.cost = (orderItem.price * orderItem.qty);
    orderItem.totalCost = orderItem.cost - (orderItem.cost * (orderItem.discountPercent / 100));
  }

  onShippingMethodSelect(shippingMethod: ShippingMethodDto) {
    this.order.shippingMethodId = shippingMethod.id;
    this.order.shippingMethodName = shippingMethod.name;
  }

  onPaymentMethodSelect(paymentMethod: PaymentMethodDto) {
    this.order.paymentMethodId = paymentMethod.id;
    this.order.paymentMethodName = paymentMethod.name;
  }
}
