import { Component, OnInit, signal } from '@angular/core';
import { CheckoutProductCard } from '../../components/checkout-product-card/checkout-product-card';
import { CheckDeactivate } from '../../utils/check-deactivate';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideVan, lucideWalletCards } from '@ng-icons/lucide';
import { CartService } from '../../services/cart-service';
import { CartInterface } from '../../utils/cart-interface';
import { CurrencyPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShippingAddressI, StripeShippingAddressI } from '../../utils/order-interface';
import { NgxStripeModule } from 'ngx-stripe';
import { PaymentService } from '../../services/payment-service';
import { OrdersService } from '../../services/orders-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  imports: [CheckoutProductCard, NgIcon, CurrencyPipe, ReactiveFormsModule, NgxStripeModule],
  providers: [provideIcons({ lucideVan, lucideWalletCards, lucideCheck })],
  templateUrl: './checkout.html',
  styles: ``,
})
export class Checkout implements CheckDeactivate, OnInit {
  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private ordersService: OrdersService,
    private router: Router,
  ) {}

  isLoading = signal<boolean>(true);
  spinner = signal<boolean>(false);

  cartData = signal<CartInterface>({
    _id: '',
    user: '',
    items: [],
    totalItems: 0,
    totalPrice: 0,
    createdAt: '',
    updatedAt: '',
    __V: 0,
    id: '',
  });

  readonly nameRegex = /^[\p{L}]+$/u;

  checkoutForm: FormGroup = new FormGroup({
    fName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(this.nameRegex),
    ]),
    lName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(this.nameRegex),
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern('^\\+?[0-9]*$'),
      Validators.minLength(7),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    address: new FormControl('', [Validators.required, Validators.minLength(5)]),
    city: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[a-zA-Z\s\-\'.]*$/),
    ]),
    zip: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
      Validators.minLength(5),
    ]),
    paymentMethod: new FormControl('stripe', Validators.required),
  });

  ngOnInit(): void {
    this.cartService.getCart().subscribe({
      next: (data) => {
        this.cartData.set(data.data);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        console.log(error);
      },
    });
  }

  sessionURL = signal<string>('');

  isPayClicked = signal<boolean>(false);

  canDeactivate(): boolean {
    if (this.checkoutForm.dirty && !this.isPayClicked()) {
      return confirm('You have unsaved changes! Are you sure you want to leave the checkout?');
    }
    return true;
  }

  handlePay() {
    if (this.checkoutForm.valid) {
      this.spinner.set(true);
      if (this.checkoutForm.get('paymentMethod')?.value === 'stripe') {
        const formVal = this.checkoutForm.value;
        const shippingAddress: StripeShippingAddressI = {
          firstName: formVal.fName,
          lastName: formVal.lName,
          email: formVal.email,
          street: formVal.address,
          city: formVal.city,
          state: formVal.city,
          zip: formVal.zip,
        };
        this.paymentService.checkout(shippingAddress).subscribe({
          next: (data) => {
            this.spinner.set(false);
            this.sessionURL.set(data.data.url);
            window.location.href = this.sessionURL();
          },
          error: (error) => {
            this.spinner.set(false);
            console.log(error);
          },
        });
      } else {
        const orderRequest = {
          shippingAddress: {
            firstName: this.checkoutForm.get('fName')?.value,
            lastName: this.checkoutForm.get('lName')?.value,
            email: this.checkoutForm.get('email')?.value,
            address: this.checkoutForm.get('address')?.value,
            city: this.checkoutForm.get('city')?.value,
            postalCode: this.checkoutForm.get('zip')?.value,
            phone: this.checkoutForm.get('phone')?.value,
          },
          payment: {
            method: this.checkoutForm.get('paymentMethod')?.value,
          },
        };
        this.ordersService.makeOrder(orderRequest).subscribe({
          next: (data: any) => {
            this.isPayClicked.set(true);
            this.spinner.set(false);
            this.router.navigate(['/order/success'], {
              queryParams: {
                session_id: data.data._id,
                method: 'cash_on_delivery',
              },
              state: { orderCompleted: true },
            });
          },
          error: (error) => {
            this.spinner.set(false);
            console.log(error);
          },
        });
      }
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }
}
