import { Component } from '@angular/core';
import { fadeInOut } from '../../services/animations';

@Component({
    selector: 'providers',
    templateUrl: './providers.component.html',
    styleUrls: ['./providers.component.css'],
    animations: [fadeInOut]
})
export class ProvidersComponent {
}
