import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseDto } from '../dtos/response.dto';
import { AddOrUpdateCustomerDto, CustomerDto } from '../dtos/customer.dto';
import { toHttpParams } from '../helpers/to-http-params.function';
import { IGridValue } from '../../grid/grid.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) {
  }

  fetchAllCustomers(gridValue: IGridValue): Observable<ResponseDto<CustomerDto[]>> {
    return this.http.get<ResponseDto<CustomerDto[]>>(
      'http://localhost:3500/api/v1/admin/customers',
      { params: toHttpParams(gridValue) }
    );
  }

  fetchCustomer(id: string | number): Observable<ResponseDto<CustomerDto>> {
    return this.http.get<ResponseDto<CustomerDto>>(`http://localhost:3500/api/v1/admin/customers/${id}`);
  }

  addNewCustomer(dto: AddOrUpdateCustomerDto): Observable<ResponseDto<CustomerDto>> {
    return this.http.post<ResponseDto<CustomerDto>>(`http://localhost:3500/api/v1/admin/customers`, dto);
  }

  updateCustomer(id: number, dto: AddOrUpdateCustomerDto): Observable<ResponseDto<CustomerDto>> {
    return this.http.put<ResponseDto<CustomerDto>>(`http://localhost:3500/api/v1/admin/customers/${id}`, dto);
  }

  deleteCustomer(id: number) {
    return this.http.delete<any>(`http://localhost:3500/api/v1/admin/customers/${id}`);
  }
}
