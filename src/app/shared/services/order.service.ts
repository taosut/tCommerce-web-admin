import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPagination } from '../../pagination/pagination.interface';
import { Observable } from 'rxjs';
import { ResponseDto, ResponsePaginationDto } from '../dtos/response.dto';
import { AddOrUpdateOrderDto, OrderDto } from '../dtos/order.dto';
import { toHttpParams } from '../helpers/to-http-params.function';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) {
  }

  fetchAllOrders(filter: IPagination): Observable<ResponsePaginationDto<OrderDto[]>> {
    return this.http.get<ResponsePaginationDto<OrderDto[]>>(
      'http://localhost:3500/api/v1/admin/orders',
      { params: toHttpParams(filter) }
    );
  }

  fetchOrder(id: string | number): Observable<ResponseDto<OrderDto>> {
    return this.http.get<ResponseDto<OrderDto>>(`http://localhost:3500/api/v1/admin/orders/${id}`);
  }

  addNewOrder(dto: AddOrUpdateOrderDto): Observable<ResponseDto<OrderDto>> {
    return this.http.post<ResponseDto<OrderDto>>(`http://localhost:3500/api/v1/admin/orders`, dto);
  }

  updateOrder(id: number, dto: AddOrUpdateOrderDto): Observable<ResponseDto<OrderDto>> {
    return this.http.put<ResponseDto<OrderDto>>(`http://localhost:3500/api/v1/admin/orders/${id}`, dto);
  }

  deleteOrder(id: number) {
    return this.http.delete<any>(`http://localhost:3500/api/v1/admin/orders/${id}`);
  }
}