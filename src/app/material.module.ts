import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
    imports: [
        MatTabsModule
        /*
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule*/
    ],
    exports: [
        MatTabsModule
        /*
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule*/
    ]
})
export class MaterialModule { }