import Cookie from 'js-cookie';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  NgbModalOptions,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';

import { Product } from 'src/app/shared/classes/product';

import { QuickViewComponent } from 'src/app/shared/components/modals/quick-view/quick-view.component';
import { QuickViewInnerComponent } from 'src/app/pages/product/shared/details/quick-view-inner/quick-view-inner.component';
import { QuickViewInnerModalComponent } from '../components/modals/quick-view-inner-modal/quick-view-inner-modal.component';
import { QuickViewTwoComponent } from 'src/app/shared/components/modals/quick-view-two/quick-view-two.component';
import { NewsletterModalComponent } from '../components/modals/newsletter-modal/newsletter-modal.component';
import { LoginModalComponent } from '../components/modals/login-modal/login-modal.component';
import { VideoModalComponent } from '../components/modals/video-modal/video-modal.component';

import { environment } from 'src/environments/environment';
import { ReachargeModalComponent } from '../components/modals/recharge-modal/recharge-modal.component';
import { ConfirmModalComponent } from '../components/modals/confirm-modal/confirm-modal.component';
import { AddressFormModalComponent } from '../components/modals/address-form-modal/address-form-modal.component';
import { ReviewModalComponent } from '../components/modals/review-modal/review-modal.component';
import { ForgotPasswordModalComponent } from '../components/modals/forgot-password-modal/forgot-password-modal.component';
import { ImagePreviewModalComponent } from '../components/modals/image-preview-modal/image-preview-modal.component';
import { SaleModalComponent } from '../components/modals/sale-modal/sale-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  products = [];
  timer: any;
  loginModalReference: NgbModalRef;
  quickViewModalReference: NgbModalRef;
  previewImageModal: NgbModalRef;

  private modalOption1: NgbModalOptions = {
    centered: true,
    size: 'xl',
    windowClass: 'newsletter-modal',
    beforeDismiss: async () => {
      document.querySelector('body')?.classList.remove('modal-open');

      await new Promise((resolve) => {
        setTimeout(() => {
          resolve('success');
        }, 250);
      });

      (document.querySelector('.logo') as HTMLElement)?.focus({
        preventScroll: true,
      });

      return true;
    },
  };

  private modalOption2: NgbModalOptions = {
    centered: true,
    size: 'lg',
    windowClass: 'login-modal',
    beforeDismiss: async () => {
      document.querySelector('body')?.classList.remove('modal-open');

      await new Promise((resolve) => {
        setTimeout(() => {
          resolve('success');
        }, 300);
      });

      (document.querySelector('.logo') as HTMLElement)?.focus({
        preventScroll: true,
      });

      return true;
    },
  };

  private modalOption3: NgbModalOptions = {
    centered: true,
    size: 'xl',
    scrollable: false,
    windowClass: 'vb-modal',
    beforeDismiss: async () => {
      document.querySelector('body')?.classList.remove('modal-open');

      await new Promise((resolve) => {
        setTimeout(() => {
          resolve('success');
        }, 300);
      });

      (document.querySelector('.logo') as HTMLElement)?.focus({
        preventScroll: true,
      });

      return true;
    },
  };

  private modalOption4: NgbModalOptions = {
    centered: true,
    size: 'xl',
    beforeDismiss: async () => {
      document.querySelector('body')?.classList.remove('modal-open');

      await new Promise((resolve) => {
        setTimeout(() => {
          resolve('success');
        }, 300);
      });

      (document.querySelector('.logo') as HTMLElement)?.focus({
        preventScroll: true,
      });

      return true;
    },
  };

  private modalOption5: NgbModalOptions = {
    centered: true,
    size: 'xl',
    windowClass: 'imagePreview-modal',
    beforeDismiss: async () => {
      document.querySelector('body')?.classList.remove('modal-open');

      await new Promise((resolve) => {
        setTimeout(() => {
          resolve('success');
        }, 300);
      });

      (document.querySelector('.logo') as HTMLElement)?.focus({
        preventScroll: true,
      });

      return true;
    },
  };

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private http: HttpClient
  ) {}

  openNewsletter() {
    if (this.timer) window.clearTimeout(this.timer);
    if (!Cookie.get(`hideNewsletter-${environment.demo}`)) {
      this.timer = window.setTimeout(() => {
        this.modalService.dismissAll();
        (document.querySelector('.logo') as HTMLElement)?.focus({
          preventScroll: true,
        });

        setTimeout(() => {
          if (
            this.router.url === '/' &&
            !document.querySelector('.newsletter-modal')
          ) {
            this.modalService.open(NewsletterModalComponent, this.modalOption1);
          }
        }, 400);
      }, 5000);
    }
  }

  // Show login modal
  showLoginModal(register:boolean=false) {
    (document.querySelector('.logo') as HTMLElement)?.focus({
      preventScroll: true,
    });
    this.loginModalReference = this.modalService.open(
      LoginModalComponent,
      this.modalOption2
    );
    this.loginModalReference.componentInstance.register = register;
  }

  closeLoginModal() {
    this.loginModalReference.close();
  }

  // Show preview modal
  showPreviewImageModal(image, data) {
    (document.querySelector('.logo') as HTMLElement)?.focus({
      preventScroll: true,
    });
    const modalRef = this.modalService.open(ImagePreviewModalComponent, {
      ...this.modalOption5,
      windowClass: 'imagePreview-modal',
    });
    modalRef.componentInstance.data = data;
    modalRef.componentInstance.image = image;
  }

  closePreviewImageModal() {
    this.previewImageModal.close();
  }

  // Show login modal
  showConfirmModal(type, message) {
    (document.querySelector('.logo') as HTMLElement)?.focus({
      preventScroll: true,
    });
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      ...this.modalOption4,
      windowClass: 'confirm-modal',
    });
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.confirmMessage = message;
  }

  showAddressFormModal(type, title, address: any = null) {
    (document.querySelector('.logo') as HTMLElement)?.focus({
      preventScroll: true,
    });
    const modalRef = this.modalService.open(AddressFormModalComponent, {
      ...this.modalOption4,
      windowClass: 'address-modal',
    });
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.address = address;
  }

  showReviewFormModal(product) {
    (document.querySelector('.logo') as HTMLElement)?.focus({
      preventScroll: true,
    });
    const modalRef = this.modalService.open(ReviewModalComponent, {
      ...this.modalOption4,
      windowClass: 'review-modal',
    });
    modalRef.componentInstance.product = product;
  }

  /**
   * Show Product in QuickView
   */
  public showRechargeModal() {
    (document.querySelector('.logo') as HTMLElement)?.focus({
      preventScroll: true,
    });

    const modalRef = this.modalService.open(ReachargeModalComponent, {
      ...this.modalOption4,
      windowClass: 'recharge-modal',
    });
  }

  public showQuickViewInnerModal(product, loaded) {
    (document.querySelector('.logo') as HTMLElement)?.focus({
      preventScroll: true,
    });

    this.quickViewModalReference = this.modalService.open(
      QuickViewInnerModalComponent,
      {
        ...this.modalOption4,
        windowClass: 'quickViewInnerModal-modal',
      }
    );

    this.quickViewModalReference.componentInstance.product1 = product;
    this.quickViewModalReference.componentInstance.loaded = loaded;
    this.quickViewModalReference.componentInstance.loaded1 = 'no';
  }

  closeQuickViewModal() {
    if (this.quickViewModalReference) {
      this.quickViewModalReference.close();
    }
  }

  public showForgotPasswordModal() {
    (document.querySelector('.logo') as HTMLElement)?.focus({
      preventScroll: true,
    });

    const modalRef = this.modalService.open(ForgotPasswordModalComponent, {
      ...this.modalOption4,
      windowClass: 'forgotPassword-modal',
    });
  }

  // Show Video modal
  showVideoModal(link = null) {
    const modalRef = this.modalService.open(
      VideoModalComponent,
      this.modalOption3
    );
    modalRef.componentInstance.link = link;
  }

  /**
   * Show Product in QuickView
   */
  public showQuickView(product: Product) {
    (document.querySelector('.logo') as HTMLElement)?.focus({
      preventScroll: true,
    });

    const modalRef = this.modalService.open(QuickViewComponent, {
      ...this.modalOption4,
      windowClass: 'quickView-modal',
    });

    modalRef.componentInstance.slug = product.slug;
  }

  /**
   * Show Product in QuickViewTwo
   */
  public showQuickViewTwo(product: Product) {
    (document.querySelector('.logo') as HTMLElement)?.focus({
      preventScroll: true,
    });

    const modalRef = this.modalService.open(QuickViewTwoComponent, {
      ...this.modalOption4,
      windowClass: 'quickView-modal',
    });

    modalRef.componentInstance.slug = product.slug;
  }

  // Show login modal
  showSaleModal() {
    (document.querySelector('.logo') as HTMLElement)?.focus({
      preventScroll: true,
    });
    this.loginModalReference = this.modalService.open(
      SaleModalComponent,
      this.modalOption2
    );
  }

  showTemplateModal(templateRef:any) {
    (document.querySelector('.logo') as HTMLElement)?.focus({
      preventScroll: true,
    });
    return this.modalService.open(templateRef, this.modalOption2);
  }
}
