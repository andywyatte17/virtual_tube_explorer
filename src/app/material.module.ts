import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { CdkTableModule } from '@angular/cdk/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    imports: [
        MatTabsModule, CdkTableModule, BrowserAnimationsModule
    ],
    exports: [
        MatTabsModule
    ]
})
export class MaterialModule { }