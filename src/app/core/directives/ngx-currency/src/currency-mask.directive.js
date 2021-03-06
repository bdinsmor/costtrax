import {
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Inject,
  KeyValueDiffers,
  Input,
  Optional
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CURRENCY_MASK_CONFIG } from './currency-mask.config';
import { InputHandler } from './input.handler';
export var CURRENCYMASKDIRECTIVE_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(function() {
    return CurrencyMaskDirective;
  }),
  multi: true
};
var CurrencyMaskDirective = (function() {
  function CurrencyMaskDirective(currencyMaskConfig, elementRef, keyValueDiffers) {
    this.currencyMaskConfig = currencyMaskConfig;
    this.elementRef = elementRef;
    this.keyValueDiffers = keyValueDiffers;
    this.options = {};
    this.optionsTemplate = {
      align: 'left',
      allowNegative: true,
      allowZero: true,
      decimal: '.',
      precision: 2,
      prefix: '$ ',
      suffix: '',
      thousands: ','
    };
    if (currencyMaskConfig) {
      this.optionsTemplate = currencyMaskConfig;
    }
    this.keyValueDiffer = keyValueDiffers.find({}).create(null);
  }
  CurrencyMaskDirective.prototype.ngAfterViewInit = function() {
    this.elementRef.nativeElement.style.textAlign = this.options.align
      ? this.options.align
      : this.optionsTemplate.align;
  };
  CurrencyMaskDirective.prototype.ngDoCheck = function() {
    if (this.keyValueDiffer.diff(this.options)) {
      this.elementRef.nativeElement.style.textAlign = this.options.align
        ? this.options.align
        : this.optionsTemplate.align;
      this.inputHandler.updateOptions(Object.assign({}, this.optionsTemplate, this.options));
    }
  };
  CurrencyMaskDirective.prototype.ngOnInit = function() {
    this.inputHandler = new InputHandler(
      this.elementRef.nativeElement,
      Object.assign({}, this.optionsTemplate, this.options)
    );
  };
  CurrencyMaskDirective.prototype.handleBlur = function(event) {
    this.inputHandler.getOnModelTouched().apply(event);
  };
  CurrencyMaskDirective.prototype.handleCut = function(event) {
    if (!this.isChromeAndroid()) {
      this.inputHandler.handleCut(event);
    }
  };
  CurrencyMaskDirective.prototype.handleInput = function(event) {
    if (this.isChromeAndroid()) {
      this.inputHandler.handleInput(event);
    }
  };
  CurrencyMaskDirective.prototype.handleKeydown = function(event) {
    if (!this.isChromeAndroid()) {
      this.inputHandler.handleKeydown(event);
    }
  };
  CurrencyMaskDirective.prototype.handleKeypress = function(event) {
    if (!this.isChromeAndroid()) {
      this.inputHandler.handleKeypress(event);
    }
  };
  CurrencyMaskDirective.prototype.handlePaste = function(event) {
    if (!this.isChromeAndroid()) {
      this.inputHandler.handlePaste(event);
    }
  };
  CurrencyMaskDirective.prototype.isChromeAndroid = function() {
    return /chrome/i.test(navigator.userAgent) && /android/i.test(navigator.userAgent);
  };
  CurrencyMaskDirective.prototype.registerOnChange = function(callbackFunction) {
    this.inputHandler.setOnModelChange(callbackFunction);
  };
  CurrencyMaskDirective.prototype.registerOnTouched = function(callbackFunction) {
    this.inputHandler.setOnModelTouched(callbackFunction);
  };
  CurrencyMaskDirective.prototype.setDisabledState = function(value) {
    this.elementRef.nativeElement.disabled = value;
  };
  CurrencyMaskDirective.prototype.writeValue = function(value) {
    this.inputHandler.setValue(value);
  };
  return CurrencyMaskDirective;
})();
export { CurrencyMaskDirective };
CurrencyMaskDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: '[currencyMask]',
        providers: [CURRENCYMASKDIRECTIVE_VALUE_ACCESSOR]
      }
    ]
  }
];
/** @nocollapse */
CurrencyMaskDirective.ctorParameters = function() {
  return [
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [CURRENCY_MASK_CONFIG] }] },
    { type: ElementRef },
    { type: KeyValueDiffers }
  ];
};
CurrencyMaskDirective.propDecorators = {
  options: [{ type: Input }],
  handleBlur: [{ type: HostListener, args: ['blur', ['$event']] }],
  handleCut: [{ type: HostListener, args: ['cut', ['$event']] }],
  handleInput: [{ type: HostListener, args: ['input', ['$event']] }],
  handleKeydown: [{ type: HostListener, args: ['keydown', ['$event']] }],
  handleKeypress: [{ type: HostListener, args: ['keypress', ['$event']] }],
  handlePaste: [{ type: HostListener, args: ['paste', ['$event']] }]
};
//# sourceMappingURL=currency-mask.directive.js.map
