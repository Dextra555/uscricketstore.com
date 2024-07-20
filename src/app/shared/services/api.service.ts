import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  @Output() isWishChanged: EventEmitter<any> = new EventEmitter();
  @Output() removeProduct: EventEmitter<any> = new EventEmitter();
  @Output() isCartChanged: EventEmitter<any> = new EventEmitter();
  @Output() isDialogConfirmed: EventEmitter<any> = new EventEmitter();
  @Output() isAddressAdded: EventEmitter<any> = new EventEmitter();

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  logout() {
    localStorage.removeItem('currentUser');
    //localStorage.removeItem('temp_user_id');
    let d = Date.now();
    localStorage.setItem('temp_user_id', d.toString());
    localStorage.removeItem('token');

    this.wishChanged(true);
    this.cartChanged(true);
    this.authService.loginStatus(false);
    this.router.navigate(['/']);
  }

  public authUser(token:string):Observable<any>{
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    });
  	return this.http.get(`${environment.SERVER_URL}/auth/user`,{
      headers: reqHeader,
    });
  }

  public fetchFooterData(initial = 'setting/footer'): Observable<any> {
    return this.http.get(`${environment.SERVER_URL}/${initial}`);
  }

  public wishChanged(status): void {
    if (status) {
      this.isWishChanged.emit(true);
    }
  }
  public removeWishlistId(id): void {
    if (id) {
      this.removeProduct.emit(id);
    }
  }

  public dialogConfirmed(type = ''): void {
    if (type) {
      this.isDialogConfirmed.emit(type);
    }
  }

  public addressAdded(type = ''): void {
    if (type) {
      this.isAddressAdded.emit(type);
    }
  }

  public cartChanged(status): void {
    if (status) {
      this.isCartChanged.emit(true);
    }
  }

  /**
   * Get Products
   */
  public fetchHeaderData(
    params: any,
    initial = 'setting/header'
  ): Observable<any> {
    let temp = initial;
    if (!initial.includes('?')) {
      temp += '?';
    }

    for (let key in params) {
      temp += key + '=' + params[key] + '&';
    }

    if (!params.page) {
      temp += 'page=1';
    }

    // if (!params.perPage) {
    // 	temp += '&perPage=' + perPage;
    // }

    return this.http.get(`${environment.SERVER_URL}/${temp}`);
  }

  /**
   * Get Products
   */
  public fetchShopData(
    params: any,
    perPage: number,
    initial = 'shop'
  ): Observable<any> {
    let temp = initial;
    if (!initial.includes('?')) {
      temp += '?';
    }

    for (let key in params) {
      temp += key + '=' + params[key] + '&';
    }

    if (!params.page) {
      temp += 'page=1';
    }

    if (!params.perPage) {
      temp += '&per_page=' + perPage;
    }

    temp += '&demo=' + environment.demo;
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });

    return this.http.get(`${environment.SERVER_URL}/${temp}`, {
      headers: reqHeader,
    });
  }

  public fetchOrders(page = 1): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this.http.get(`${environment.SERVER_URL}/user/orders?page=` + page, {
      headers: reqHeader,
    });
  }

  public fetchBookings(page = 1): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this.http.get(
      `${environment.SERVER_URL}/user/booked-slots?page=` + page,
      { headers: reqHeader }
    );
  }

  public fetchOrderDetails(orderid): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this.http.get(`${environment.SERVER_URL}/user/order/` + orderid, {
      headers: reqHeader,
    });
  }

  public fetchOrderSuccessDetails(orderid): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this.http.get(
      `${environment.SERVER_URL}/user/successorder/` + orderid,
      { headers: reqHeader }
    );
  }

  public getDashboardData(): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this.http.get(`${environment.SERVER_URL}/user/dashboard`, {
      headers: reqHeader,
    });
  }

  public passwordCreate(data): Observable<any> {
    var reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this.http.post(
      `${environment.SERVER_URL}/auth/password/create`,
      data,
      { headers: reqHeader }
    );
  }

  public passwordReset(data): Observable<any> {
    var reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this.http.post(
      `${environment.SERVER_URL}/auth/password/reset`,
      data,
      { headers: reqHeader }
    );
  }

  /**
   * Get Products
   */
  public fetchBlogData(
    params: any,
    initial = 'blogs/classic',
    perPage: number
  ): Observable<any> {
    let temp = initial;
    if (!initial.includes('?')) {
      temp += '?';
    }

    for (let key in params) {
      temp += key + '=' + params[key] + '&';
    }

    if (!params.page) {
      temp += 'page=1';
    }

    if (!params.perPage) {
      temp += '&perPage=' + perPage;
    }

    return this.http.get(`${environment.SERVER_URL}/${temp}`);
  }

  public fetchPage(slug: string): Observable<any> {
    return this.http.get(`${environment.SERVER_URL}/${'page/' + slug}`);
  }

  /**
   * Get Products
   */
  public fetchSinglePost(slug: string): Observable<any> {
    return this.http.get(
      `${environment.SERVER_URL}/${
        'single/' + slug + '?demo=' + environment.demo
      }`
    );
  }

  /**
   * Get Products for home page
   */
  public fetchHomeData(): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    // return this.http.get(`${environment.SERVER_URL}/${environment.demo}`);
    return this.http.get(`${environment.SERVER_URL}/setting/home`, {
      headers: reqHeader,
    });
  }

  public fetchMetaData(): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    // return this.http.get(`${environment.SERVER_URL}/${environment.demo}`);
    return this.http.get(`${environment.SERVER_URL}/setting/meta`, {
      headers: reqHeader,
    });
  }

  public getAllCategories(): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    // return this.http.get(`${environment.SERVER_URL}/${environment.demo}`);
    return this.http.get(`${environment.SERVER_URL}/all-categories`, {
      headers: reqHeader,
    });
  }

  public getCategoryMeta(slug:string): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    // return this.http.get(`${environment.SERVER_URL}/${environment.demo}`);
    return this.http.get(`${environment.SERVER_URL}/category/meta/${slug}`, {
      headers: reqHeader,
    });
  }

  /**
   * Get Page Settings
   */
  public fetchSettingsData(type): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    // return this.http.get(`${environment.SERVER_URL}/${environment.demo}`);
    return this.http.get(`${environment.SERVER_URL}/setting/` + type, {
      headers: reqHeader,
    });
  }

  public contactUs(data): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    // return this.http.get(`${environment.SERVER_URL}/${environment.demo}`);
    return this.http.post(`${environment.SERVER_URL}/setting/contactus`, data, {
      headers: reqHeader,
    });
  }

  public submitReview(data): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this.http.post(
      `${environment.SERVER_URL}/user/review/submit`,
      data,
      { headers: reqHeader }
    );
  }

  public updateUser(data): Observable<any> {
    const reqHeader = new HttpHeaders({
      // 'enctype': 'multipart/form-data',
      // 'Accept': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    const headers = new HttpHeaders();
    headers.append('enctype', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    // return this.http.get(`${environment.SERVER_URL}/${environment.demo}`);
    return this.http.post(`${environment.SERVER_URL}/user/info/update`, data, {
      headers: reqHeader,
    });
  }

  /**
   * Get products by demo
   */
  public getSingleProduct(
    slug: string,
    isQuickView = false,
    type = ''
  ): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this.http.get(
      `${environment.SERVER_URL}/product/details/${slug}?demo=${environment.demo}&isQuickView=${isQuickView}&type=${type}`,
      { headers: reqHeader }
    );
  }

  public getLaneSlots(productid, date): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this.http.get(
      `${environment.SERVER_URL}/product/laneslots/${productid}?date=${date}`,
      { headers: reqHeader }
    );
  }

  public lane_slot_price_with_tax(productid, price): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this.http.get(
      `${environment.SERVER_URL}/product/lane_slot_price_with_tax/${productid}/${price}`,
      { headers: reqHeader }
    );
  }

  public getRelatesProducts(id: string): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this.http.get(`${environment.SERVER_URL}/product/related/${id}`, {
      headers: reqHeader,
    });
  }

  /**
   * Get Products
   */
  public fetchHeaderSearchData(
    searchTerm: string,
    cat = null
  ): Observable<any> {
    return this.http.get(
      `${environment.SERVER_URL}/shop?perPage=5&searchTerm=${searchTerm}&category=${cat}&demo=${environment.demo}`
    );
  }

  /**
   * Get Element Products
   */
  public fetchElementData(): Observable<any> {
    return this.http.get(`${environment.SERVER_URL}/elements/products`);
  }

  /**
   * Get Element Blog
   */
  public fetchElementBlog(): Observable<any> {
    return this.http.get(`${environment.SERVER_URL}/elements/blogs`);
  }

  public fetchReviews(productid, page = 1): Observable<any> {
    return this.http.get(
      `${environment.SERVER_URL}/product/reviews/` +
        productid +
        '?page=' +
        page +
        '&sortby=latest&filterby=all'
    );
  }

  public fetchCountries(): Observable<any> {
    return this.http.get(`${environment.SERVER_URL}/all-countries`);
  }

  public fetchStates(country): Observable<any> {
    return this.http.get(`${environment.SERVER_URL}/states/` + country);
  }

  public fetchCities(country): Observable<any> {
    return this.http.get(`${environment.SERVER_URL}/cities/` + country);
  }

  public getAddresses(): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this.http.get(`${environment.SERVER_URL}/user/addresses`, {
      headers: reqHeader,
    });
  }

  public defaultShipping(id): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    // return this.http.get(`${environment.SERVER_URL}/${environment.demo}`);
    return this.http.get(
      `${environment.SERVER_URL}/user/address/default-shipping/` + id,
      { headers: reqHeader }
    );
  }

  public deleteAddress(id): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    // return this.http.get(`${environment.SERVER_URL}/${environment.demo}`);
    return this.http.get(
      `${environment.SERVER_URL}/user/address/delete/` + id,
      { headers: reqHeader }
    );
  }

  public defaultBilling(id): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    // return this.http.get(`${environment.SERVER_URL}/${environment.demo}`);
    return this.http.get(
      `${environment.SERVER_URL}/user/address/default-billing/` + id,
      { headers: reqHeader }
    );
  }

  public addAddress(data): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    // return this.http.get(`${environment.SERVER_URL}/${environment.demo}`);
    return this.http.post(
      `${environment.SERVER_URL}/user/address/create`,
      data,
      { headers: reqHeader }
    );
  }

  public updateAddress(data): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    // return this.http.get(`${environment.SERVER_URL}/${environment.demo}`);
    return this.http.post(
      `${environment.SERVER_URL}/user/address/update`,
      data,
      { headers: reqHeader }
    );
  }

  public checkInventory(ordercode): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this.http.get(
      `${environment.SERVER_URL}/checkinventory/${ordercode}`,
      { headers: reqHeader }
    );
  }

  public getShipping(address, addressdata = null): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this.http.get(
      `${environment.SERVER_URL}/checkout/get-shipping-cost/${address}`,
      { headers: reqHeader, params: addressdata }
    );
  }

  public getShippoShipping(
    address,
    addressdata = null,
    email = null
  ): Observable<any> {
    let data = {
      temp_user_id: localStorage.getItem('temp_user_id'),
      address: addressdata,
      email: email,
    };
    if (addressdata) {
      addressdata.temp_user_id = localStorage.getItem('temp_user_id');
      addressdata.email = email;
      data = addressdata;
    }
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this.http.get(
      `${environment.SERVER_URL}/get-shipping-cost-shippo/${address}`,
      { headers: reqHeader, params: data }
    );
  }

  public addToCart(
    qty,
    userid,
    variationid,
    addons = [],
    slotids = null,
    product_type = null,
    selectedDate = null
  ): Observable<any> {
    let data = {
      qty: qty,
      temp_user_id: userid,
      variation_id: variationid,
      addons: addons,
      slotids: slotids,
      product_type: product_type,
      selected_date: selectedDate,
    };
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this.http.post(`${environment.SERVER_URL}/carts/add`, data, {
      headers: reqHeader,
    });
  }

  public removeFromoCart(cart_id): Observable<any> {
    let data = {
      cart_id: cart_id,
      temp_user_id: localStorage.getItem('temp_user_id'),
    };
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this.http.post(`${environment.SERVER_URL}/carts/destroy`, data, {
      headers: reqHeader,
    });
  }

  public getUserInfo(): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    // return this.http.get(`${environment.SERVER_URL}/${environment.demo}`);
    return this.http.get(`${environment.SERVER_URL}/user/info`, {
      headers: reqHeader,
    });
  }

  public storeOrder(data): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    // return this.http.get(`${environment.SERVER_URL}/${environment.demo}`);
    return this.http.post(
      `${environment.SERVER_URL}/checkout/order/store`,
      data,
      { headers: reqHeader }
    );
  }

  public pay(gateway, data): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    // return this.http.get(`${environment.SERVER_URL}/${environment.demo}`);
    return this.http.post(`${environment.SERVER_URL}/${gateway}/pay`, data, {
      headers: reqHeader,
    });
  }

  // Braintree Gateway

  public fetchClientToken(): Observable<any> {
    return this.http.get(`${environment.BASE_URL}/payment`);
  }

  public fetchPaymentInfo(order_code): Observable<any> {
    return this.http.get(`${environment.BASE_URL}/order-details/` + order_code);
  }

  public sendPaymentMethod(data): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this.http.post(`${environment.BASE_URL}/process-payment`, data, {
      headers: reqHeader,
    });
  }
  // End

  public changeCartQtyt(cart_id, type): Observable<any> {
    let data = {
      cart_id: cart_id,
      type: type,
      temp_user_id: localStorage.getItem('temp_user_id'),
    };
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this.http.post(
      `${environment.SERVER_URL}/carts/change-quantity`,
      data,
      { headers: reqHeader }
    );
  }

  public applyCoupon(items, coupon): Observable<any> {
    let data = {
      cart_item_ids: items,
      coupon_code: coupon,
      temp_user_id: localStorage.getItem('temp_user_id'),
    };
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this.http.post(
      `${environment.SERVER_URL}/checkout/coupon/apply`,
      data,
      { headers: reqHeader }
    );
  }

  public getCart(): Observable<any> {
    let data = {
      temp_user_id: localStorage.getItem('temp_user_id'),
    };
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this.http.post(`${environment.SERVER_URL}/carts`, data, {
      headers: reqHeader,
    });
  }

  public addToWish(productid): Observable<any> {
    let data = {
      product_id: productid,
    };
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this.http.post(`${environment.SERVER_URL}/user/wishlists`, data, {
      headers: reqHeader,
    });
  }

  public getWish(): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this.http.get(`${environment.SERVER_URL}/user/wishlists`, {
      headers: reqHeader,
    });
  }

  public removeFromoWish(productid): Observable<any> {
    let data = {
      product_id: productid,
    };
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this.http.delete(
      `${environment.SERVER_URL}/user/wishlists/` + productid,
      { headers: reqHeader }
    );
  }
}
