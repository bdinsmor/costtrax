import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CurrencyMaskDirective } from "./currency-mask.directive";
var NgxCurrencyModule = (function () {
    function NgxCurrencyModule() {
    }
    return NgxCurrencyModule;
}());
export { NgxCurrencyModule };
NgxCurrencyModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    FormsModule
                ],
                declarations: [
                    CurrencyMaskDirective
                ],
                exports: [
                    CurrencyMaskDirective
                ]
            },] },
];
/** @nocollapse */
NgxCurrencyModule.ctorParameters = function () { return []; };
//# sourceMappingURL=currency-mask.module.js.map