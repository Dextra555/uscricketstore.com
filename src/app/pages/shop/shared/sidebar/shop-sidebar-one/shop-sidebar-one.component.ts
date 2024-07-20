import {
  Component,
  OnInit,
  Input,
  ViewChild,
  EventEmitter,
  OnChanges,
} from '@angular/core';

//import { shopData } from '../../data';
import { ActivatedRoute, Router } from '@angular/router';
import { Options } from '@angular-slider/ngx-slider';
import { SlimScrollOptions, SlimScrollEvent } from 'ngx-slimscroll';
import { ApiService } from './../../../../../shared/services/api.service';

@Component({
  selector: 'molla-shop-sidebar-one',
  templateUrl: './shop-sidebar-one.component.html',
  styleUrls: ['./shop-sidebar-one.component.scss'],
})
export class ShopSidebarOneComponent implements OnInit, OnChanges {
  @Input() toggle = false;
  @Input() shopData;
  @Input() currentCat;
  @Input() parentCategory;
  @Input() minPrice;
  @Input() maxPrice;
  @Input() totalProducts;
  @Input() products;

  opts: SlimScrollOptions;
  scrollEvents: EventEmitter<SlimScrollEvent>;

  params = {};
  priceRange: any = [0, 2000];
  queryParams: any = {};

  minValue: number = 0;
  maxValue: number = 2000;
  options: Options = {
    floor: 0,
    ceil: 2000,
    step: 50,
    showTicks: true,
  };

  @ViewChild('priceSlider') priceSlider: any;
  @ViewChild('priceSliderNew') priceSliderNew: any;

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public apiService: ApiService
  ) {
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    activeRoute.queryParams.subscribe((params) => {
      this.params = params;
      if (params['min_price'] && params['max_price']) {
        // this.priceRange = [
        // 	params['min_price'] / 10,
        // 	params['max_price'] / 10
        // ]
        this.priceRange = [params['min_price'], params['max_price']];

        this.minValue = params['min_price'];
        this.maxValue = params['max_price'];
      } else {
        // if(this.priceSlider) {
        // 	this.priceSlider.slider.reset({min: 0, max: 100});
        // }
        if (this.priceSliderNew) {
          //this.priceSliderNew.slider.reset({min: 0, max: 2000});
        }
      }
      this.queryParams = { ...this.activeRoute.snapshot.queryParams };
    });
  }

  ngOnChanges(): void {
    this.options = {
      floor: parseInt(this.minPrice),
      ceil: parseInt(this.maxPrice),
      step: 50,
      showTicks: true,
    };
    this.priceRange = [this.minPrice, this.maxPrice];
    if (this.minValue < this.minPrice) {
      this.minValue = this.minPrice;
    }
    if (this.maxValue > this.maxPrice) {
      this.maxValue = this.maxPrice;
    }

    if (this.maxValue == 0) {
      this.maxValue = this.maxPrice;
    }
  }

  ngOnInit(): void {

    this.priceRange = [this.minPrice, this.maxPrice];
    this.options = {
      floor: parseInt(this.minPrice),
      ceil: parseInt(this.maxPrice),
      step: 50,
      showTicks: true,
    };

    // if(this.minValue<this.minPrice){
    // 	this.minValue = this.minPrice;
    // }
    // if(this.maxValue>this.maxPrice){
    // 	this.maxValue = this.maxPrice;
    // }
    this.scrollEvents = new EventEmitter<SlimScrollEvent>();
    this.opts = new SlimScrollOptions({
      position: 'right', // left | right
      barBackground: '#C9C9C9', // #C9C9C9
      barOpacity: '0.3', // 0.8
      barWidth: '6', // 10
      barBorderRadius: '10', // 20
      barMargin: '0', // 0
      gridBackground: '#d9d9d9', // #D9D9D9
      gridOpacity: '1', // 1
      gridWidth: '0', // 2
      gridBorderRadius: '20', // 20
      gridMargin: '0', // 0
      alwaysVisible: true, // true
      visibleTimeout: 1000, // 1000
      alwaysPreventDefaultScroll: true, // true
    });
  }

  containsAttrInUrl(type: string, value: string) {
    const currentQueries = this.params[type]
      ? this.params[type].split(',')
      : [];
    return (
      currentQueries &&
      currentQueries.filter(function (e) {
        return e == value;
      }).length > 0
    ); //currentQueries.includes(value.toString());
  }

  getUrlForAttrs(type: string, value: string) {
    let currentQueries = this.params[type] ? this.params[type].split(',') : [];
    currentQueries = this.containsAttrInUrl(type, value)
      ? currentQueries.filter((item) => item.toString() !== value.toString())
      : [...currentQueries, value];
    return currentQueries.join(',');
  }

  onAttrClickNew(attr: string, value: string) {
    this.router.navigate([], {
      queryParams: { [attr]: value, page: 1 },
      queryParamsHandling: 'merge',
    });
  }

  onAttrClick(attr: string, value: string) {
    let url = this.getUrlForAttrs(attr, value);
    this.router.navigate([], {
      queryParams: { [attr]: this.getUrlForAttrs(attr, value), page: 1 },
      queryParamsHandling: 'merge',
    });
  }

  filterPrice() {
    this.router.navigate([], {
      queryParams: {
        min_price: this.priceRange[0],
        max_price: this.priceRange[1],
        page: 1,
      },
      queryParamsHandling: 'merge',
    });
  }

  changeFilterPrice(value: any) {
    this.priceRange = [value.value, value.highValue];
    this.filterPrice();
  }

  clearFilter(attr:string, selectedItems:number=0){
    if(attr === "all"){
      this.router.navigate([], {
        queryParams: {
          page: 1,
        },
        // queryParamsHandling: 'merge',
      });
    }
    else if(attr === "brand"){
      const queryParams = this.queryParams;
      delete queryParams['brand_ids'];
      // Navigate to the updated URL without the "brand_ids" query parameter
      this.router.navigate([], {
        queryParams,
        // queryParamsHandling: 'merge',
      });
    }
    else if(attr === "price"){
      const queryParams = this.queryParams;
      delete queryParams['min_price'];
      delete queryParams['max_price'];
      this.router.navigate([], {
        queryParams,
      });
    }
    else if(attr === "attribute"){
      let queryParams = this.queryParams;
      const updatedAttributeValues = this.removeAttributeFilterIfExist(selectedItems);
      delete queryParams['attribute_values'];

      if(updatedAttributeValues)
        queryParams['attribute_values'] = updatedAttributeValues;

      this.router.navigate([], {
        queryParams,
      });
    }
  }

  displayAttributeFilter(selectedItems:any) {
    const attribute_values = this.queryParams?.attribute_values;
    const idArray = attribute_values?.split(',').map((id:any) => parseInt(id, 10));

    // Check if any item in selectedItems has an ID in idArray
    return selectedItems?.some((item:any) => idArray?.includes(item.id));
  }

  removeAttributeFilterIfExist(selectedItems:any) {
    const attribute_values = this.queryParams?.attribute_values;
    const idArray = attribute_values?.split(',').map((id:any) => parseInt(id, 10));

    // Filter out IDs present in selectedItems
    const updatedIdArray = idArray?.filter((id: number) => !selectedItems.some((item: any) => item.id === id));

    // Convert the updatedIdArray to a comma-separated string
    const updatedIdsString = updatedIdArray?.join(',');

    return updatedIdsString || '';
  }
}
